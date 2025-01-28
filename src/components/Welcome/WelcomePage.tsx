import React, { useState } from 'react';
import welcomeGif from './kyc.gif';
import TwilioLogo from '../../components/IntroContainer/TwilioLogo';
import '@fortawesome/fontawesome-free/css/all.css';
import { useNavigate } from 'react-router-dom';
import LoginPage from '../../components/LoginPage/LoginPage';

const WelcomePage = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = () => {
    console.log("Clicked Start Now", termsAccepted);
    if (termsAccepted) {
      navigate('/login');
    } else {
      alert('Please agree to all terms and conditions before proceeding.');
    }
  };

  return (
   <div>
     <div>
       <TwilioLogo style={{width:'150px'}}/>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', backgroundColor: '#f5f5f5' }}>
      
      <div style={{ maxWidth: '90%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {/* Left Side: Welcome Message and Image */}
        <div style={{ flexBasis: '40%', height:"90vh" }}>
          <div style={{ background: '#ff8500', borderRadius: '8px', padding: '20px' }}>
          <h1 style={{color:'#ffffff',textAlign:'center', fontSize:'40px'}}>Welcome To Video KYC</h1>
            {/* Insert your image here */}
            <img src={welcomeGif} alt="Welcome animation" style={{ maxWidth: '98%', height: 'auto', borderRadius: '8px' }} />
          </div>
        </div>
        
        {/* Right Side: Checklist and Start Button */}
        <div style={{ flexBasis: '60%', background: 'white', padding: '30px 20px', borderRadius: '8px', height:"90vh" }}>
          <h3 style={{color: '#00194c', fontSize: "19px",borderBottom: "1px solid #00194c",padding: "10px 0"}}>You would need the following to start the process:</h3>
         <div style={{maxWidth: "100%",margin: "20px 0",padding: "20px",backgroundColor: "#ffffff", border: "1px solid #ddd", borderRadius: "8px",boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"}}>
          <ul style={{listStyle:"none"}}>
            <li style={{padding: "12px 16px", borderBottom: "1px solid #eee",color: "#333",transition: "backgroundColor 0.3s ease",}}><i style={{marginRight: "8px",color:"#00194c", width: "30px"}} className="fas fa-credit-card"></i> PAN</li>
            <li style={{padding: "12px 16px", borderBottom: "1px solid #eee",color: "#333",transition: "backgroundColor 0.3s ease",}}><i style={{marginRight: "8px",color:"#00194c", width: "30px"}} className="fas fa-id-card"></i> Aadhaar</li>
            <li style={{padding: "12px 16px", borderBottom: "1px solid #eee",color: "#333",transition: "backgroundColor 0.3s ease",}}><i style={{marginRight: "8px",color:"#00194c", width: "30px"}} className="fas fa-mobile"></i> Mobile linked with Aadhaar</li>
            <li style={{padding: "12px 16px", borderBottom: "1px solid #eee",color: "#333",transition: "backgroundColor 0.3s ease",}}><i style={{marginRight: "8px",color:"#00194c", width: "30px"}} className="fas fa-pen"></i> Paper and Pen</li>
          </ul>
          </div>
          <div>
          <label>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              I Agree to all terms and conditions
            </label>
          </div>
          <button
            onClick={handleStartClick}
            disabled={!termsAccepted}
            style={{
              marginTop: '30px',
              padding: '10px 20px',
              backgroundColor: termsAccepted ? '#00194c' : '#d3d3d3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: termsAccepted ? 'pointer' : 'not-allowed',
            }}
          >Start Now</button>
        </div>
      </div>
    </div>
   </div>
     
    
  );
};

export default WelcomePage;
