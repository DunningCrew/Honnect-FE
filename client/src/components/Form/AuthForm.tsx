import * as S from './AuthForm.styles';
import { useState } from 'react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: { username: string; password: string }) => void;
}

const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <S.Container onSubmit={handleSubmit}>
      <S.Title>{mode === 'login' ? '로그인' : '회원가입'}</S.Title>

      <S.Label>아이디</S.Label>
      <S.Input
        type='text'
        name='username'
        value={formData.username}
        onChange={handleChange}
        required
      ></S.Input>
      <S.Label>비밀번호</S.Label>
      <S.Input
        type='password'
        name='password'
        value={formData.password}
        onChange={handleChange}
        required
      ></S.Input>
      <S.Button type='submit'>
        {mode === 'login' ? '로그인' : '회원가입'}
      </S.Button>
    </S.Container>
  );
};

export default AuthForm;
