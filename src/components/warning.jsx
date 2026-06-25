import React, { useState, useEffect } from 'react';
import { convertStringToHTML } from '../utils'

export const ImportantMessage = ({ message }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check localStorage to see if the message has been dismissed
    useEffect(() => {
        const messageAccepted = localStorage.getItem('messageAccepted');
        setVisible(messageAccepted !== 'true');
        setLoading(false);
    }, []);

    const acceptMessage = () => {
        localStorage.setItem('messageAccepted', 'true');
        setVisible(false);
    };

    if (loading || !visible || !message) return null;

    return (
        <div className="banner">
            <div className="container banner__inner">
                <p>{convertStringToHTML(message)}</p>
                <button className="banner__close" aria-label="Închide" onClick={acceptMessage}>✕</button>
            </div>
        </div>
    );
};
