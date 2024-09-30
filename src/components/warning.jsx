import React, { useState, useEffect } from 'react';
import { convertStringToHTML } from '../utils'
import JsonData from "../data/data.json";

export const ImportantMessage = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const [landingPageData, setLandingPageData] = useState({});

    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    // Check localStorage to see if the message has been accepted
    useEffect(() => {
        const messageAccepted = localStorage.getItem('messageAccepted');
        if (messageAccepted === 'true') {
            setVisible(false);
        } else {
            setVisible(true); // Show the message if not accepted
        }
        setLoading(false); // Set loading to false after checking
    }, []);

    // Function to handle accepting the message
    const acceptMessage = () => {
        localStorage.setItem('messageAccepted', 'true');
        setVisible(false); // Hide the message after accepting
    };

    if (loading) return null; // Don't render anything while loading

    if (!visible) return null; // Don't render if the message is dismissed or accepted

    const message = landingPageData?.Warning?.message

    return (
        <>
            {message && <div className="important-message">
                <div className="container">
                    <div className="message-content">
                        <p>{convertStringToHTML(message)}</p>
                        <button className="close-btn" onClick={acceptMessage}>✕</button>
                    </div>
                </div>
            </div>}
        </>
    );
};
