class YNotification {
    constructor(title, message, id = null, timeout = 3000){
        this.id = "notif" + (id ? id : Number.toString(Notification.id++));
        this.title = title;
        this.message = message;
        this.timeout = timeout;
        this.OnClick = () => {
          this.free();
        }
        YNotification._evtClick[this.id] = this;
    }

    show(){
        chrome.notifications.create(this.id, {
            type: 'basic',
            iconUrl: "image/icon/128.png",
            title: this.title,
            message: this.message
        }, (notificationId) => {
            if(this.timeout != -1)
              setTimeout(
                () => {
                  this.free();
                },
                this.timeout,
                notificationId
              );
        });
    }

    free(){
      chrome.notifications.clear(this.id);
      YNotification._evtClick[this.id] = undefined;
    }

    hide(){
      chrome.notifications.clear(this.id);
    }
}

YNotification.id = 0;
YNotification._evtClick = {};

chrome.notifications.onClicked.addListener(function(notificationId) {
  YNotification._evtClick[notificationId].OnClick();
});