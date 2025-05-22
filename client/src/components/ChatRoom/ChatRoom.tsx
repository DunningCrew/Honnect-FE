import { useState, useEffect } from 'react';
import WebSocketClient from '../WebSocket/WebSocket';
import { API_BASE_URL } from '@/constants/apiUrl';
import * as S from './ChatRoom.styles';

interface User {
  id: string;
  username: string;
}

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sendMessage, messages, isConnected } = WebSocketClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          throw new Error('사용자 목록을 가져오는데 실패했습니다.');
        }

        const userList = await response.json();
        setUsers(userList);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.',
        );
        console.error('사용자 목록 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    sendMessage(message);
    setMessage('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const userId = sessionStorage.getItem('userId');

  return (
    <S.ChatContainer>
      <S.UserList>
        <S.ConnectionStatus connected={isConnected}>
          {isConnected ? '연결됨' : '연결 끊김'}
        </S.ConnectionStatus>
        <h3>접속 중인 사용자</h3>
        {isLoading ? (
          <S.LoadingMessage>사용자 목록 로딩 중...</S.LoadingMessage>
        ) : error ? (
          <S.ErrorMessage>{error}</S.ErrorMessage>
        ) : (
          users.map((user) => (
            <S.UserItem key={user.id}>{user.username}</S.UserItem>
          ))
        )}
      </S.UserList>

      <S.ChatArea>
        <S.MessageList>
          {messages.map((msg, index) => (
            <S.MessageItem key={index} isMine={msg.senderId === userId}>
              <S.MessageSender>
                {msg.senderId === userId
                  ? '나'
                  : users.find((u) => u.id === msg.senderId)?.username ||
                    '알 수 없음'}
              </S.MessageSender>
              <S.MessageContent>{msg.content}</S.MessageContent>
              <S.MessageTime>{formatTime(msg.timestamp)}</S.MessageTime>
            </S.MessageItem>
          ))}
        </S.MessageList>
        <S.InputArea>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder='메시지를 입력하세요'
            disabled={!isConnected}
          />
          <button onClick={handleSendMessage} disabled={!isConnected}>
            전송
          </button>
        </S.InputArea>
      </S.ChatArea>
    </S.ChatContainer>
  );
};

export default ChatRoom;
