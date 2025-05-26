import styled from 'styled-components';

export const SignInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const WelcomeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

export const WelcomeMessage = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 16px;
  background-color: #e3f2fd;
  color: #fc6a03;
  border-radius: 4px;
  font-size: 1rem;
  z-index: 1000;
`;

export const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  z-index: 1000;

  &:hover {
    background-color: #d32f2f;
  }
`;
