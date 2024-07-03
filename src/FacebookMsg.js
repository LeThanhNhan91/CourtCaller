import React, { useEffect } from 'react';

const FacebookMsg = () => {
    useEffect(() => {
        // Load the Facebook SDK script
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Initialize the Facebook SDK
        window.fbAsyncInit = function() {
            window.FB.init({
                appId            : '981312986521330', // Replace with your Facebook app ID
                autoLogAppEvents : true,
                xfbml            : true,
                version          : 'v11.0'
            });

            // Parse the page for the chat plugin
            window.FB.XFBML.parse();
        };
    }, []);

    return (
        <div id="fb-root">
            <div
                className="fb-customerchat"
                attribution="setup_tool"
                page_id="330210223511680" // Replace with your Facebook page ID
                theme_color="#0084ff"
                logged_in_greeting="Hi! How can we help you?"
                logged_out_greeting="Hi! How can we help you?">
            </div>
        </div>
    );
};

export default FacebookMsg;