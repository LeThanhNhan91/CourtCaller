import React from 'react';
import { FacebookProvider, CustomChat } from 'react-facebook';

const FacebookMsg = () => {
    return (
      <FacebookProvider appId="981312986521330" chatSupport>
        <CustomChat pageId="330210223511680" minimized={false}/>
      </FacebookProvider>    
    );
};

export default FacebookMsg;