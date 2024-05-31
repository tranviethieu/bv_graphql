self.addEventListener('push', event => {
  const data = event.data.json();
  console.log("push event:", JSON.stringify(data));
  // self.registration.showNotification(data.title, {
  //     body: 'Yay it works!',
  // });
  // const { body, badge, icon, image, data: custom } = data.payload;
  // var options = {
  //   body: 'Here is a notification body!',
  //   icon: 'images/example.png',
  //   vibrate: [100, 50, 100],
  //   data: {
  //     dateOfArrival: Date.now(),
  //     primaryKey: 1
  //   }
  // };

  event.waitUntil(
    self.registration.showNotification(data.title, data.payload )
  );

  // self.registration.showNotification(data.title, options);
});
self.onnotificationclick = function (event) {
  console.log('On notification click: ', event.notification);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function (clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow) {
      if(event.notification.data&&event.notification.data.url)
        return clients.openWindow(event.notification.data.url)
      else
        return clients.openWindow('/');
    }
  }));
};