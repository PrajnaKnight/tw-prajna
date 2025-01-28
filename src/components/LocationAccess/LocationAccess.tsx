import React, { useState, useEffect } from 'react';
import ConsentModal from './ConsentModal';

const LocationAccess: React.FC = () => {
    const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
    const [consent, setConsent] = useState<boolean | null>(null);

    useEffect(() => {
        if (consent) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }, (error) => {
                    console.error("Error accessing the location", error);
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }
    }, [consent]);

    const handleConsent = (userConsent: boolean) => {
        setConsent(userConsent);
    };

    return (
        <div>
            {consent === null && <ConsentModal onConsent={handleConsent} />}
            {location && <p>Your location: Latitude: {location.latitude}, Longitude: {location.longitude}</p>}
        </div>
    );
};

export default LocationAccess;
