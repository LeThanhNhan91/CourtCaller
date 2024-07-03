// src/components/FacebookChat.js
import React, { useEffect } from 'react';

const FacebookMsg = () => {
    useEffect(() => {
        // Ensure the SDK is initialized before rendering the chat plugin
        const checkFbInit = setInterval(() => {
            if (window.FB) {
                window.FB.XFBML.parse();
                clearInterval(checkFbInit);
            }
        }, 100);
    }, []);

    return (
        <div>
            <div
                className="fb-customerchat"
                attribution="setup_tool"
                page_id="330210223511680"
                minimized="false"
            ></div>
        </div>
    );
};

export default FacebookMsg;
