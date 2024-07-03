import React, { Component} from 'react';
import { FacebookProvider, MessageUs } from 'react-facebook';

export default class MessageUsMsg extends Component {
  render() {
    return (
      <FacebookProvider appId="981312986521330">
        <MessageUs messengerAppId="981312986521330" pageId="330210223511680"/>
      </FacebookProvider>    
    );
  }
}