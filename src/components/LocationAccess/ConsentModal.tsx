import React from 'react';

// Define an interface for the component props
interface ConsentModalProps {
    onConsent: (consent: boolean) => void; // Function that takes a boolean argument
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onConsent }) => {
    return (
        <div style={{
            position: 'fixed', /* Positioned relative to the viewport */
            top: 0,
            left: 0,
            width: '100vw', /* Full width */
            height: '100vh', /* Full height */
            backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Black background with opacity */
            display: 'flex',
            alignItems: 'center', /* Center vertically */
            justifyContent: 'center', /* Center horizontally */
            zIndex: 1000, /* Ensure it sits on top of other content */
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                <p>We need your permission to access your location.</p>
                <div>
                    <button style={{
                        background: '#00194c', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '10px 20px', 
                        borderRadius: '5px', 
                        marginRight: '10px',
                        cursor: 'pointer',
                    }} onClick={() => onConsent(true)}>Allow</button>
                </div>
            </div>
        </div>
    );
};

export default ConsentModal;
