import { useState, useEffect } from "react";
// import http from "./utils/http";
//the function to call the push server: https://github.com/Spyna/push-notification-demo/blob/master/front-end-react/src/utils/http.js
import { MUTATION_REGISTER_DEVICE } from '../auth/store/actions/query';
import graphqlService from 'app/services/graphqlService';
import { showMessage } from 'app/store/actions';
import {useSelector,useDispatch} from 'react-redux';
import fp from "fingerprintjs2";

import {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  createNotificationSubscription,
  getUserSubscription
} from "./push-notifications";
//import all the function created to manage the push notifications

const pushNotificationSupported = isPushNotificationSupported();
//first thing to do: check if the push notifications are supported by the browser
const getFingerprint = () =>
  new Promise(resolve => {
    fp.get(components => {
      resolve(components);
    });
  });
export default function usePushNotifications() {
  const [userConsent, setSuserConsent] = useState(Notification.permission);
  //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
  //We initialize the userConsent with that value
  const [userSubscription, setUserSubscription] = useState(null);
  //to manage the use push notification subscription
  const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
  //to manage the push server subscription
  const [error, setError] = useState(null);
  //to manage errors
  const [loading, setLoading] = useState(true);
  //to manage async actions
  const userData = useSelector(({auth})=>auth.user.data);
  const dispatch = useDispatch();
  useEffect(() => {
    if (pushNotificationSupported) {
      setLoading(true);
      setError(false);
      registerServiceWorker().then(() => {
        setLoading(false);
      });
    }
  }, []);
  //if the push notifications are supported, registers the service worker
  //this effect runs only the first render

  useEffect(() => {
    setLoading(true);
    setError(false);
    const getExixtingSubscription = async () => {
      const existingSubscription = await getUserSubscription();
      setUserSubscription(existingSubscription);
      setLoading(false);
    };
    getExixtingSubscription();
  }, []);
  //Retrieve if there is any push notification subscription for the registered service worker
  // this use effect runs only in the first render

  /**
   * define a click handler that asks the user permission,
   * it uses the setSuserConsent state, to set the consent of the user
   * If the user denies the consent, an error is created with the setError hook
   */
  const onClickAskUserPermission = () => {
    setLoading(true);
    setError(false);
    askUserPermission().then(consent => {
      setSuserConsent(consent);
      if (consent !== "granted") {
        setError({
          name: "Consent denied",
          message: "You denied the consent to receive notifications",
          code: 0
        });
      }
      setLoading(false);
    });
  };
  //

  /**
   * define a click handler that creates a push notification subscription.
   * Once the subscription is created, it uses the setUserSubscription hook
   */
  const onClickSusbribeToPushNotification = () => {
    setLoading(true);
    setError(false);
    createNotificationSubscription()
      .then(function (subscrition) {
        setUserSubscription(subscrition);
        setLoading(false);
      })
      .catch(err => {
        console.error("Couldn't create the notification subscription", err, "name:", err.name, "message:", err.message, "code:", err.code);
        setError(err);
        setLoading(false);
      });
  };

  /**
   * define a click handler that sends the push susbcribtion to the push server.
   * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
   */
  const onClickSendSubscriptionToPushServer = () => {
    setLoading(true);
    setError(false);
    // console.log("onClickSendSubscriptionToPushServer:", userSubscription);
    var p256dh = base64Encode(userSubscription.getKey('p256dh'));
    var auth = base64Encode(userSubscription.getKey('auth'));
    
    getFingerprint().then(fp => {
      
      const fpbase64 = btoa(JSON.stringify(fp));
      // console.log("fingerprint:", JSON.stringify(fp),fpbase64);
      graphqlService.mutate(MUTATION_REGISTER_DEVICE, { data: {uniqueId:fpbase64, p256dh,auth,tokenId: userSubscription.endpoint, userId: userData.sub, platform: "WEB" } }).then(() => {
        dispatch(showMessage({ message: "Đăng ký nhận thông báo thành công" }));
        setLoading(false);
      })  
    });
    
    // http
    //   .post("/subscription", userSubscription)
    //   .then(function(response) {
    //     setPushServerSubscriptionId(response.id);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setLoading(false);
    //     setError(err);
    //   });
  };
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
  /**
   * define a click handler that requests the push server to send a notification, passing the id of the saved subscription
   */
  const onClickSendNotification = async () => {
    setLoading(true);
    setError(false);
    // await http.get(`/subscription/${pushServerSubscriptionId}`).catch(err => {
    //   setLoading(false);
    //   setError(err);
    // });
    console.log("onClickSendNotification");
    setLoading(false);
  };

  /**
   * returns all the stuff needed by a Component
   */
  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    userConsent,
    pushNotificationSupported,
    userSubscription,
    error,
    loading
  };
}
