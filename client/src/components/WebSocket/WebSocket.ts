import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  senderId: string;
  content: string;
  timestamp: number;
}

const WebSocketClient = () => {
  const client = useRef<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        'heart-beat': '10000,10000',
        'accept-version': '1.2',
        host: 'localhost:8080',
        login: userId,
      },
      debug: (str) => {
        console.log('📡 STOMP DEBUG:', str);
      },
      onConnect: () => {
        setIsConnected(true);

        stompClient.subscribe('/topic/chat/message', (message: IMessage) => {
          try {
            if (!message || !message.body) {
              console.warn('⚠️ message 또는 body 없음');
              return;
            }

            const parsed: ChatMessage = JSON.parse(message.body);

            setMessages((prev) => [...prev, parsed]);
          } catch (error) {
            console.error('❌ 메시지 처리 오류:', error);
            console.log('원본 메시지:', message);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 프로토콜 오류:', frame);
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket 오류:', event);
      },
    });

    client.current = stompClient;
    stompClient.activate();

    return () => {
      if (client.current) {
        client.current.deactivate();
        setIsConnected(false);
      }
    };
  }, []);

  const sendMessage = (content: string) => {
    if (!client.current || !client.current.connected) {
      console.error('WebSocket이 연결되어 있지 않습니다.');
      return;
    }

    const userId = sessionStorage.getItem('userId') || '';
    const message: ChatMessage = {
      senderId: userId,
      content,
      timestamp: Date.now(),
    };

    client.current.publish({
      destination: '/topic/chat/message',
      body: JSON.stringify(message),
      headers: { 'content-type': 'application/json' },
    });
  };

  return { sendMessage, messages, isConnected };
};

export default WebSocketClient;
