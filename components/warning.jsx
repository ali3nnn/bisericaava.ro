"use client";

import React, { useState, useEffect } from 'react';
import { convertStringToHTML } from '@/lib/utils';
import JsonData from "@/lib/data.json";

export const ImportantMessage = () => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const message = JsonData?.Warning?.message;

    useEffect(() => {
        const messageAccepted = localStorage.getItem('messageAccepted');
        if (messageAccepted === 'true') {
            setVisible(false);
        } else {
            setVisible(true);
        }
        setLoading(false);
    }, []);

    const acceptMessage = () => {
        localStorage.setItem('messageAccepted', 'true');
        setVisible(false);
    };

    if (loading) return null;
    if (!visible) return null;

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
