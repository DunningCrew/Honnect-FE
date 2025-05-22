import { Routes, Route } from 'react-router-dom';
import SignUp from '@/components/SignUp/SignUp';
import ChatRoom from '@/components/ChatRoom/ChatRoom';
import Login from '@/components/Login/Login';

function App() {
  return (
    <Routes>
      <Route path='/' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/chat' element={<ChatRoom />} />
    </Routes>
  );
}

export default App;
