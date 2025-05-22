import express from "express";
import http from "http";
import cors from "cors";
import SockJS from "sockjs";

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

const users = new Map();

users.clear();

app.post("/api/reset", (req, res) => {
  users.clear();
  console.log("사용자 목록 초기화 완료");
  res.json({ message: "사용자 목록이 초기화되었습니다." });
});

app.post("/api/login", (req, res) => {
  try {
    console.log("로그인 요청:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "사용자 이름과 비밀번호가 필요합니다.",
      });
    }

    const user = Array.from(users.values()).find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        error: "사용자 이름 또는 비밀번호가 일치하지 않습니다.",
      });
    }

    console.log("로그인 성공:", { id: user.id, username: user.username });
    res.json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("로그인 실패:", error);
    res.status(500).json({ error: "로그인 처리 중 오류가 발생했습니다." });
  }
});

// 사용자 목록 API
app.get("/api/users", (req, res) => {
  try {
    const userList = Array.from(users.values()).map((user) => ({
      id: user.id,
      username: user.username,
    }));
    res.json(userList);
  } catch (error) {
    console.error("사용자 목록 조회 실패:", error);
    res.status(500).json({ error: "사용자 목록을 가져오는데 실패했습니다." });
  }
});

// 회원가입 API
app.post("/api/users", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "사용자 이름과 비밀번호가 필요합니다.",
      });
    }

    const currentUsers = Array.from(users.values());
    const existingUser = currentUsers.find(
      (user) => user.username === username
    );

    if (existingUser) {
      console.log("중복 사용자 발견:", existingUser.username);
      return res
        .status(400)
        .json({ error: "이미 사용 중인 사용자 이름입니다." });
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
    };

    users.set(newUser.id, newUser);
    console.log("회원가입 성공:", {
      id: newUser.id,
      username: newUser.username,
    });

    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    console.error("회원가입 실패:", error);
    res.status(500).json({ error: "회원가입 처리 중 오류가 발생했습니다." });
  }
});

app.use((req, res) => {
  console.log("404 Not Found:", req.method, req.url);
  res.status(404).json({ error: "요청한 API를 찾을 수 없습니다." });
});

app.use((err, req, res, next) => {
  console.error("서버 에러:", err);
  res.status(500).json({ error: "서버에서 오류가 발생했습니다." });
});

const server = http.createServer(app);
const sockjs = SockJS.createServer({ prefix: "/ws" });
sockjs.installHandlers(server, { prefix: "/ws" });

const clients = new Map();

sockjs.on("connection", (conn) => {
  let userId = null;

  conn.on("data", (message) => {
    try {
      const frame = message.toString();
      console.log("받은 프레임:", frame);

      if (frame.startsWith("CONNECT")) {
        const headers = frame.split("\n").slice(1);
        const headerMap = {};

        for (const header of headers) {
          if (header.trim() === "") break;
          const [key, value] = header.split(":");
          headerMap[key] = value;
        }

        userId = headerMap["login"] || Date.now().toString();
        clients.set(userId, conn);
        console.log(`✅ Client connected: ${userId}`);
        console.log("현재 연결된 클라이언트:", [...clients.keys()]);

        conn.write(
          "CONNECTED\n" + "version:1.2\n" + "heart-beat:0,0\n" + "\n\0"
        );
      } else if (frame.startsWith("SEND")) {
        const lines = frame.split("\n");
        const headers = lines.slice(1);
        const headerMap = {};

        let bodyStartIndex = 0;
        for (let i = 0; i < headers.length; i++) {
          if (headers[i].trim() === "") {
            bodyStartIndex = i + 1;
            break;
          }
          const [key, value] = headers[i].split(":");
          headerMap[key] = value;
        }

        const messageBody = lines
          .slice(bodyStartIndex)
          .join("\n")
          .replace(/\0/g, "")
          .trim();

        if (!messageBody) {
          console.error("메시지 본문이 없습니다.");
          return;
        }

        try {
          const jsonMatch = messageBody.match(/\{.*\}/);
          if (!jsonMatch) {
            throw new Error("JSON 형식이 아닙니다.");
          }

          const messageData = JSON.parse(jsonMatch[0]);
          console.log("메시지 데이터:", messageData);

          // 모든 클라이언트에게 메시지 전달
          const messageWithSender = {
            ...messageData,
            senderId: userId,
          };

          console.log("전송할 메시지:", messageWithSender);
          console.log("연결된 클라이언트 수:", clients.size);

          clients.forEach((client, clientId) => {
            const responseFrame =
              "MESSAGE\n" +
              `destination:/sub/chat/room\n` +
              `message-id:${Date.now()}\n` +
              "content-type:application/json\n" +
              "\n" +
              JSON.stringify(messageWithSender) +
              "\0";

            client.write(responseFrame);
            console.log(`📨 Message sent to ${clientId}`);
          });
        } catch (parseError) {
          console.error("메시지 파싱 실패:", parseError);
          console.log("원본 메시지:", messageBody);
        }
      }
    } catch (error) {
      console.error("메시지 처리 중 오류 발생:", error);
      console.log("원본 프레임:", message.toString());
    }
  });

  conn.on("close", () => {
    if (userId) {
      clients.delete(userId);
      console.log(`❌ Client disconnected: ${userId}`);
      console.log("남은 클라이언트:", [...clients.keys()]);
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on http://localhost:${PORT}/ws`);
  console.log(`📡 REST API server running on http://localhost:${PORT}/api`);
});
