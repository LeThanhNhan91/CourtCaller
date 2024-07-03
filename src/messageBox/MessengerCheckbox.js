import React, { Component} from 'react';
import { FacebookProvider, MessengerCheckbox } from 'react-facebook';

export default class MessengerCheckboxMsg extends Component {
  render() {
    return (
      <FacebookProvider appId="981312986521330">
        <MessengerCheckbox messengerAppId="981312986521330" pageId="330210223511680"/>
      </FacebookProvider>    
    );
  }
}