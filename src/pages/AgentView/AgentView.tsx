import React from 'react';
import { useNavigate } from 'react-router-dom';
import TwilioLogo from '../../components/IntroContainer/TwilioLogo';

const AgentView = () => {
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
            VKYC Agent Dashboard
          </h1>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {/* Stats Card */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ color: '#00194c', marginBottom: '10px' }}>Today's Sessions</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff8500' }}>0</p>
            </div>

            {/* Status Card */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ color: '#00194c', marginBottom: '10px' }}>Status</h3>
              <p style={{ 
                color: '#28a745',
                fontWeight: 'bold'
              }}>Available</p>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: '30px' }}>
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
              onClick={() => navigate('/agent/session')}
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentView;
