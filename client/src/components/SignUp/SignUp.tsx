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

      // handleLogin(data);
    } catch (error) {
      console.error('사용자 등록 실패:', error);
      alert(
        error instanceof Error ? error.message : '사용자 등록에 실패했습니다.',
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
