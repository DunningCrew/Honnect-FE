import AuthForm from '../Form/AuthForm';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const token = await login(data);
      setAccessToken(token);

      // 쿠키에도 수동 저장 (서버에서 Set-Cookie로 안 넣어줄 경우 대비)
      document.cookie = `access_token=${token}; path=/;`;

      alert('로그인에 성공했습니다.');
      navigate('/'); // 로그인 성공 후 이동할 페이지로 설정
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return <AuthForm mode='login' onSubmit={handleLogin} />;
};

export default Login;
