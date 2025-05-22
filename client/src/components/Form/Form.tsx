import * as S from './Form.styles';
import { useState } from 'react';

const Form = ({
  buttonText,
  onSubmit,
}: {
  buttonText: string;
  onSubmit: (formData: { username: string; password: string }) => void;
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <S.Container>
      <S.Form onSubmit={handleSubmit}>
        <S.FormGroup>
          <S.Label>아이디</S.Label>
          <S.Input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleChange}
          ></S.Input>
        </S.FormGroup>
        <S.FormGroup>
          <S.Label>비밀번호</S.Label>
          <S.Input
            type='text'
            name='password'
            value={formData.password}
            onChange={handleChange}
          ></S.Input>
        </S.FormGroup>
        <S.Button type='submit'>{buttonText}</S.Button>
      </S.Form>
    </S.Container>
  );
};

export default Form;
