import { useState, useEffect } from 'react';
import LoginForm from '../Login/Login';
import ChatRoom from '../ChatRoom/ChatRoom';
import * as S from './SignIn.styles';

interface User {
  id: string;
  username: string;
  password?: string;
}

interface SignUpUser {
  username: string;
  password: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

const SignIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const savedUserId = sessionStorage.getItem('userId');
    const savedUsername = sessionStorage.getItem('username');
    if (savedUserId && savedUsername) {
      setCurrentUser({ id: savedUserId, username: savedUsername });
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user: User) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    sessionStorage.setItem('userId', user.id);
    sessionStorage.setItem('username', user.username);
  };

  const handleSignUp = async (user: SignUpUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      console.log('회원가입 응답:', data);

      if (!response.ok) {
        throw new Error(data.error || '사용자 등록에 실패했습니다.');
      }

      handleLogin(data);
      setIsSignUp(false);
    } catch (error) {
      console.error('사용자 등록 실패:', error);
      alert(
        error instanceof Error ? error.message : '사용자 등록에 실패했습니다.',
      );
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
  };

  return (
    <S.SignInContainer>
      {!isLoggedIn ? (
        <LoginForm
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
        />
      ) : (
        <S.WelcomeContainer>
          {currentUser && (
            <S.WelcomeMessage>
              {currentUser.username}님 환영합니다!
            </S.WelcomeMessage>
          )}
          <ChatRoom />
          <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>
        </S.WelcomeContainer>
      )}
    </S.SignInContainer>
  );
};

export default SignIn;
