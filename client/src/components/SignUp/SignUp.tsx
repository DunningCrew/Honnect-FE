import AuthForm from '../Form/AuthForm';
import { signup } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = async (data: { username: string; password: string }) => {
    try {
      await signup(data);
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(
        error instanceof Error ? error.message : '회원가입에 실패했습니다.',
      );
    }
  };

  return <AuthForm mode='signup' onSubmit={handleSignUp} />;
};

export default SignUp;
