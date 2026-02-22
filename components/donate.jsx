"use client";

import React, { useEffect, useRef, useState } from "react";

const StripeButton = () => {
    const containerRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loaded) {
                    const script = document.createElement("script");
                    script.src = "https://js.stripe.com/v3/buy-button.js";
                    script.async = true;
                    document.body.appendChild(script);
                    setLoaded(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [loaded]);

    return (
        <div ref={containerRef} style={{ transform: "scale(1)" }}>
            <stripe-buy-button
                buy-button-id="buy_btn_1QXfATDkjbxnO7r8eUMIXBxk"
                publishable-key="pk_live_51QXQj0DkjbxnO7r8LvGpYRPpGVan1Cszpky34agWZZQBtE9b52gzzASa8e2SIGGKRJ6r15czfgWliwTYydB8FU8M00tEkBIo8K"
            ></stripe-buy-button>
        </div>
    );
};

export default StripeButton;
