import styled from 'styled-components';

export const SignInContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const WelcomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

export const WelcomeMessage = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

export const LogoutButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;
