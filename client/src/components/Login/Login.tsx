import { useState } from 'react';
import Form from '../Form/Form';
import { API_BASE_URL } from '../../constants/apiUrl';
import { useNavigate } from 'react-router-dom';

interface User {
  id?: string;
  username: string;
  password?: string;
}

const Login = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (user: User) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      console.log('로그인 응답:', data);

      if (response.ok) {
        const { id, username } = data;
        sessionStorage.setItem('userId', id);
        sessionStorage.setItem('username', username);
        setCurrentUser({ id, username });
        navigate('/chat');
      } else {
        console.error('로그인 실패:', data);
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    setCurrentUser(null);
  };

  return <Form buttonText='로그인' onSubmit={handleLogin} />;
};

export default Login;
