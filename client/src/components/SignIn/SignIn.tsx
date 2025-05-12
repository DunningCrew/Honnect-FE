import { useState, useEffect } from 'react';
import LoginForm from '../Login/Login';
import * as S from './SignIn.styles';

interface User {
  id: string;
  username: string;
  password: string;
}

const SignIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user: User) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleSignUp = (user: User) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    setIsSignUp(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
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
          <S.WelcomeMessage>
            환영합니다, {currentUser?.username}님!
          </S.WelcomeMessage>
          <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>
        </S.WelcomeContainer>
      )}
    </S.SignInContainer>
  );
};

export default SignIn;
