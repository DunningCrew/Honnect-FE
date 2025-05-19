import { useState } from 'react';
import type { ChangeEvent } from 'react';
import * as S from './Login.styles';

interface User {
  id: string;
  username: string;
  password?: string;
}

interface SignUpUser {
  username: string;
  password: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
  onSignUp: (user: SignUpUser) => void;
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}

const API_BASE_URL = 'http://localhost:8080/api';

const LoginForm = ({ onLogin, isSignUp, setIsSignUp }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      if (!isSignUp) {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '로그인에 실패했습니다.');
        }

        onLogin(data);
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
      );
      console.error('인증 실패:', err);
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
