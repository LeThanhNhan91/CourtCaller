import React, { Component} from 'react';
import { FacebookProvider, SendToMessenger } from 'react-facebook';

export default class SendToMessengerMsg extends Component {
  render() {
    return (
      <FacebookProvider appId="981312986521330">
        <SendToMessenger messengerAppId="981312986521330" pageId="330210223511680"/>
      </FacebookProvider>    
    );
  }
}