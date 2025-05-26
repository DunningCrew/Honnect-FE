import Form from '../Form/Form';
import { API_BASE_URL } from '@/constants/apiUrl';
import * as S from './SignUp.styles';

interface SignUpUser {
  username: string;
  password: string;
}

const SignUp = () => {
  const handleSignUp = async (user: SignUpUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      console.log('회원가입 응답:', data);

      if (!response.ok) {
        throw new Error(data.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(
        error instanceof Error ? error.message : '회원가입에 실패했습니다.',
      );
    }
  };

  return (
    <S.SignInContainer>
      <Form buttonText='회원가입' onSubmit={handleSignUp} />
    </S.SignInContainer>
  );
};

export default SignUp;
