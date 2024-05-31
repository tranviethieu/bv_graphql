// By default, this project supports all modern browsers.
// Support for Internet Explorer 11 requires polyfills.
// For to support Internet Explorer 11, install react-app-polyfill,
// https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import 'typeface-muli';
import './react-table-custom';
import './styles/custom.css'
import './react-chartjs-2-defaults';
import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from 'app/App';
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

serviceWorker.register({
  onSuccess: async (register) => {
    // console.log("register success");
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_PUSH_KEY),
    });
    // console.log("get subscription info");
    var p256dh = base64Encode(subscription.getKey('p256dh'));
    var auth = base64Encode(subscription.getKey('auth'));
    // console.log("subscription Info = ", subscription, " p256dh=", p256dh, "auth=", auth);
    //lưu mọi thứ vào store để chờ khi login sẽ gọi
    localStorage.setItem('device', JSON.stringify({ p256dh, auth, tokenId: subscription.endpoint }));
  },
  onUpdate: (register) => {
    console.log("onUpdate Push:", register);
    // const subscription = register.pushManager.subscribe({
    //   userVisibleOnly: true,
    //   applicationServerKey: urlBase64ToUint8Array(window.env.PublicVapidKey),
    // });

    // var p256dh = base64Encode(subscription.getKey('p256dh'));
    // var auth = base64Encode(subscription.getKey('auth'));
    // console.log("subscription Info = ",subscription," p256dh=",p256dh,"auth=",auth);
  }
});


function base64Encode(arrayBuffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
}
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
