import React from 'react';
import { useNavigate } from 'react-router-dom';
import TwilioLogo from '../../components/IntroContainer/TwilioLogo';

const UserView = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ padding: '20px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <TwilioLogo style={{ width: '150px' }} />
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px' }}>
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            color: '#00194c',
            fontSize: '24px',
            marginBottom: '20px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px'
          }}>
            Video KYC Session
          </h1>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#00194c', marginBottom: '15px' }}>Important Instructions</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ margin: '10px 0', color: '#333' }}>
                <i className="fas fa-check" style={{ color: '#28a745', marginRight: '10px' }}></i>
                Keep your PAN and Aadhaar card ready
              </li>
              <li style={{ margin: '10px 0', color: '#333' }}>
                <i className="fas fa-check" style={{ color: '#28a745', marginRight: '10px' }}></i>
                Ensure good internet connectivity
              </li>
              <li style={{ margin: '10px 0', color: '#333' }}>
                <i className="fas fa-check" style={{ color: '#28a745', marginRight: '10px' }}></i>
                Find a well-lit quiet place
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              style={{
                backgroundColor: '#ff8500',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={() => navigate('/user/session')}
            >
              Start Session
            </button>
            <button
              style={{
                backgroundColor: '#ffffff',
                color: '#ff8500',
                padding: '12px 24px',
                border: '1px solid #ff8500',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
