import React, { Component} from 'react';
import { FacebookProvider, CustomChat } from 'react-facebook';

export default class FacebookMsg extends Component {
  render() {
    return (
      <FacebookProvider appId="981312986521330" chatSupport>
        <CustomChat pageId="330210223511680" minimized={false} themeColor='Black'/>
      </FacebookProvider>    
    );
  }
}