import express from "express";
import http from "http";
import cors from "cors";
import SockJS from "sockjs";

const app = express();

// CORS 설정 상세화
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"], // 클라이언트 주소 추가
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// 메모리에 사용자 목록 저장 (실제로는 데이터베이스 사용)
const users = new Map();

// 서버 시작 시 사용자 목록 초기화
console.log("서버 시작: 사용자 목록 초기화");
users.clear();

// 사용자 목록 초기화 API (테스트용)
app.post("/api/reset", (req, res) => {
  users.clear();
  console.log("사용자 목록 초기화 완료");
  res.json({ message: "사용자 목록이 초기화되었습니다." });
});

// 로그인 API
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

// 사용자 등록 API
app.post("/api/users", (req, res) => {
  try {
    console.log("회원가입 요청:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log("필수 필드 누락:", { username, password });
      return res.status(400).json({
        error: "사용자 이름과 비밀번호가 필요합니다.",
      });
    }

    // 현재 등록된 사용자 목록 로깅
    const currentUsers = Array.from(users.values());
    console.log("현재 등록된 사용자 수:", currentUsers.length);
    console.log("현재 등록된 사용자 목록:", currentUsers);

    // 이미 존재하는 사용자인지 확인
    const existingUser = currentUsers.find(
      (user) => user.username === username
    );

    console.log("입력된 사용자 이름:", username);
    console.log("기존 사용자와 비교:", existingUser);

    if (existingUser) {
      console.log("중복 사용자 발견:", existingUser);
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
    console.log("회원가입 후 사용자 수:", users.size);
    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    console.error("회원가입 실패:", error);
    res.status(500).json({ error: "회원가입 처리 중 오류가 발생했습니다." });
  }
});

// 404 처리
app.use((req, res) => {
  console.log("404 Not Found:", req.method, req.url);
  res.status(404).json({ error: "요청한 API를 찾을 수 없습니다." });
});

// 에러 처리
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
      const [command, ...headers] = frame.split("\n");
      const headerMap = {};

      for (const header of headers) {
        if (header.trim() === "") break;
        const [key, value] = header.split(":");
        headerMap[key] = value;
      }

      if (command.startsWith("CONNECT")) {
        userId = headerMap["login"] || Date.now().toString();
        clients.set(userId, conn);
        console.log(`✅ Client connected: ${userId}`);

        conn.write(
          "CONNECTED\n" + "version:1.2\n" + "heart-beat:0,0\n" + "\n\0"
        );
      } else if (command.startsWith("SEND")) {
        const destination = headerMap["destination"];
        const messageBody = frame.split("\n\n")[1];

        try {
          const messageData = JSON.parse(messageBody);

          // 수신자에게 메시지 전달
          const receiver = clients.get(destination);
          if (receiver) {
            receiver.write(
              "MESSAGE\n" +
                `destination:/sub/chat/private/${destination}\n` +
                `message-id:${Date.now()}\n` +
                "content-type:application/json\n" +
                "\n" +
                messageBody +
                "\0"
            );
            console.log(
              `📨 Message sent from ${messageData.senderId} to ${destination}`
            );
          } else {
            console.log(`❌ Receiver ${destination} not found`);
          }
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
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on http://localhost:${PORT}/ws`);
  console.log(`📡 REST API server running on http://localhost:${PORT}/api`);
});
