import React from 'react';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';

const position = {
  topLeft: { top: 70, left: 0, alignItems: 'flex-start' },
  topCenter: { top: 70, left: '50%', transform: 'translateX(-50%)' },
  topRight: { top: 70, right: 0, alignItems: 'flex-end' },
  bottomLeft: { bottom: 0, left: 0, alignItems: 'flex-start' },
  bottomCenter: { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  bottomRight: { bottom: 0, right: 0, alignItems: 'flex-end' }
};

export const infoMessage = (msg) => {
  
  alert(''+ msg);

};

export const warnMessage = (msg) => {
  alert(''+ msg);
};

export const errorMessage = (msg) => {
  alert(''+ msg);
};

export const _infoMessage = (msg) => (
  <NotificationGroup style={position.topCenter}>
     <Notification key="info" type={{ style: 'info' }}>{msg}</Notification>
  </NotificationGroup>
);


export const _warnMessage = (msg) => (
  <NotificationGroup style={position.topCenter}>
  <Notification key="warning" type={{ style: 'warning' }}>{msg}</Notification>
</NotificationGroup>
);

export const _errorMessage = (msg) => (
  <NotificationGroup style={position.topCenter}>
  <Notification key="error" type={{ style: 'error' }}>{msg}</Notification>
</NotificationGroup>
);