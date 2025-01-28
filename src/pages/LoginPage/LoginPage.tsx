import React, { useState } from 'react';
import { useAuth } from '../../components/Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TwilioLogo from '../../components/IntroContainer/TwilioLogo';

export default function LoginPage() {
  const { setRole } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'agent' && password === '1234') {
      setRole('agent');
      navigate('/agent');
    } else if (username === 'user' && password === '1234') {
      setRole('user');
      navigate('/user');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ padding: '5px 10px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <TwilioLogo style={{ width: '150px' }} />
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{
            color: '#00194c',
            fontSize: '24px',
            marginBottom: '20px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px',
            textAlign: 'center'
          }}>
            Login
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                fontSize: '16px'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                fontSize: '16px'
              }}
            />
            <button
              onClick={handleLogin}
              style={{
                backgroundColor: '#ff8500',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
