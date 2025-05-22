import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  senderId: string;
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
      const createSocket = () => {
        return new SockJS('http://localhost:8080/ws');
      };

      const stompClient = Stomp.over(createSocket);

      const connectHeaders = {
        'heart-beat': '10000,10000',
        'accept-version': '1.2',
        host: 'localhost:8080',
        login: userId,
      };

      stompClient.connect(
        connectHeaders,
        () => {
          setIsConnected(true);
          console.log('✅ WebSocket 연결 성공');
          console.log('✅ 현재 로그인된 유저 ID:', userId);
          client.current = stompClient;

          // 공통 채팅방 구독
          client.current.subscribe('/sub/chat/room', (message) => {
            console.log('📥 [subscribe] 공통 채팅방 메시지 수신');
            console.log('수신된 메시지:', message.body);

            try {
              const receivedMessage = JSON.parse(message.body);
              console.log('✅ 파싱된 메시지:', receivedMessage);

              setMessages((prev) => {
                const next = [...prev, receivedMessage];
                console.log('✅ 메시지 스택 상태:', next);
                return next;
              });
            } catch (error) {
              console.error('메시지 파싱 오류:', error);
            }
          });
        },
        (error: unknown) => {
          console.error('WebSocket 연결 오류:', error);
          setIsConnected(false);
        },
      );

      stompClient.reconnect_delay = 5000;
      stompClient.heartbeat.outgoing = 10000;
      stompClient.heartbeat.incoming = 10000;

      return () => {
        if (client.current) {
          client.current.disconnect();
          setIsConnected(false);
        }
      };
    }
  }, []);

  const sendMessage = (content: string) => {
    if (client.current && isConnected) {
      const userId = sessionStorage.getItem('userId') || '';
      const message: ChatMessage = {
        senderId: userId,
        content,
        timestamp: Date.now(),
      };

      console.log('전송할 메시지:', message);

      client.current.send(
        '/pub/chat/message',
        {
          'content-type': 'application/json',
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
