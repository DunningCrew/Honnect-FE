import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`;

export const UserList = styled.div`
  width: 250px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
`;

export const UserItem = styled.div<{ selected: boolean }>`
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${(props) => (props.selected ? '#e3f2fd' : 'transparent')};
  &:hover {
    background-color: #f5f5f5;
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
  align-items: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};
  margin: 10px 0;
`;

export const MessageContent = styled.div`
  background-color: #e3f2fd;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 70%;
  word-wrap: break-word;
`;

export const MessageTime = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
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
    font-size: 1rem;

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  button {
    padding: 10px 20px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &:disabled {
      background-color: #90caf9;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #1976d2;
    }
  }
`;

export const NoChatSelected = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 1.2rem;
`;

export const ConnectionStatus = styled.div<{ connected: boolean }>`
  padding: 8px 12px;
  margin-bottom: 15px;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
  background-color: ${(props) => (props.connected ? '#e8f5e9' : '#ffebee')};
  color: ${(props) => (props.connected ? '#2e7d32' : '#c62828')};
`;

export const LoadingMessage = styled.div`
  padding: 10px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

export const ErrorMessage = styled.div`
  padding: 10px;
  text-align: center;
  color: #c62828;
  font-size: 0.9rem;
  background-color: #ffebee;
  border-radius: 4px;
`;
