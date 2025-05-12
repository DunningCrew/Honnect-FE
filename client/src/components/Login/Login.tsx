import { useState } from 'react';
import type { ChangeEvent } from 'react';
import * as S from './Login.styles';

interface User {
  id: string;
  username: string;
  password: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
  onSignUp: (user: User) => void;
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

const LoginForm = ({
  onLogin,
  onSignUp,
  isSignUp,
  setIsSignUp,
}: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSignUp) {
      // 로그인 로직
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(
        (u: User) => u.username === username && u.password === password,
      );

      if (user) {
        onLogin(user);
      } else {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } else {
      // 회원가입 로직
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.some((u: User) => u.username === username)) {
        setError('이미 사용 중인 아이디입니다.');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        username,
        password,
      };

      onSignUp(newUser);
      setUsername('');
      setPassword('');
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <S.Container>
      <S.Form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isSignUp ? '회원가입' : '로그인'}
        </h2>
        <S.FormGroup>
          <S.Label htmlFor='username'>아이디</S.Label>
          <S.Input
            type='text'
            id='username'
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            required
          />
        </S.FormGroup>
        <S.FormGroup>
          <S.Label htmlFor='password'>비밀번호</S.Label>
          <S.Input
            type='password'
            id='password'
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
        </S.FormGroup>
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        <S.Button type='submit'>{isSignUp ? '회원가입' : '로그인'}</S.Button>
        <S.ToggleButton type='button' onClick={toggleForm}>
          {isSignUp ? '로그인하기' : '회원가입하기'}
        </S.ToggleButton>
      </S.Form>
    </S.Container>
  );
};

export default LoginForm;
