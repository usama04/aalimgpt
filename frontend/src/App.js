//import logo from './logo.svg';
import React, { useContext} from 'react';
import './App.css';
import './normal.css';
import { Chat } from './pages/Chat';
import { UserContext } from './context/UserContext';
import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { ForgotPassword } from './pages/ForgotPassword';


function App() {
  const { token } = useContext(UserContext);

  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {token && <Route path="/chat" element={<Chat />} />}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password?token=:token" element={<ResetPassword />} />
    </Routes>
    </>
    
  );
}

export default App;
