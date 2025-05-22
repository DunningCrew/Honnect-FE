import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`;

export const UserList = styled.div`
  width: 250px;
  padding: 20px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
`;

export const ConnectionStatus = styled.div<{ connected: boolean }>`
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 4px;
  text-align: center;
  background-color: ${({ connected }) => (connected ? '#4caf50' : '#f44336')};
  color: white;
`;

export const UserItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f5f5f5;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const MessageItem = styled.div<{ isMine: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
  width: 100%;
`;

export const MessageSender = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

export const MessageContent = styled.div<{ isMine: boolean }>`
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ isMine }) => (isMine ? '#e3f2fd' : '#f5f5f5')};
  max-width: 70%;
  word-break: break-word;
  color: #000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const MessageTime = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

export const InputArea = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #2196f3;
    }
  }

  button {
    padding: 10px 20px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #1976d2;
    }

    &:disabled {
      background-color: #bdbdbd;
      cursor: not-allowed;
    }
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 20px;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  color: #f44336;
  padding: 20px;
`;
