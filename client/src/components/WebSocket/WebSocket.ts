import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
}

const WebSocketClient = () => {
  const client = useRef<CompatClient | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      // SockJS 클라이언트 생성 함수
      const createSocket = () => {
        return new SockJS('http://localhost:8080/ws');
      };

      const stompClient = Stomp.over(createSocket);
      stompClient.debug = () => {};

      const connectHeaders = {
        'heart-beat': '10000,10000',
        'accept-version': '1.2',
        host: 'localhost:8080',
        login: userId,
      };

      // 연결 설정
      stompClient.connect(
        connectHeaders,
        () => {
          client.current = stompClient;
          setIsConnected(true);
          console.log('✅ WebSocket 연결 성공');

          // 개인 메시지 구독
          client.current.subscribe(`/sub/chat/private/${userId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, receivedMessage]);
          });
        },
        (error: unknown) => {
          console.error('WebSocket 연결 오류:', error);
          setIsConnected(false);
        },
      );

      stompClient.reconnect_delay = 5000; // 5초 후 재연결 시도
      stompClient.heartbeat.outgoing = 10000; // 10초마다 heartbeat 전송
      stompClient.heartbeat.incoming = 10000; // 10초마다 heartbeat 수신 대기

      return () => {
        if (client.current) {
          client.current.disconnect();
          setIsConnected(false);
        }
      };
    }
  }, []);

  const sendMessage = (receiverId: string, content: string) => {
    if (client.current && isConnected) {
      const message: ChatMessage = {
        senderId: sessionStorage.getItem('userId') || '',
        receiverId,
        content,
        timestamp: Date.now(),
      };

      client.current.send(
        '/pub/chat/private',
        {
          'content-type': 'application/json',
          destination: receiverId,
        },
        JSON.stringify(message),
      );

      setMessages((prev) => [...prev, message]);
    } else {
      console.error('WebSocket이 연결되어 있지 않습니다.');
    }
  };

  return { sendMessage, messages, isConnected };
};

export default WebSocketClient;
