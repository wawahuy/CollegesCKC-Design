window.WebSocket = window.WebSocket || window.MozWebSocket;

class Realtime {
    constructor(){
        if(!!Realtime.instance){
            return Realtime.instance;
        }

        Realtime.instance = this;

        this.notif_rconnect = new YNotification("", "Connecting...", "rconnect", -1)
        this.notif_rconnect.OnClick = () => {};
        this.connect();

        return this;
    }

    connect(){
        try {
            this.connection = new WebSocket(WS);
            this.connection.onopen    =  this.ws_open.bind(this);
            this.connection.onerror   =  this.ws_error.bind(this);
            this.connection.onclose   =  this.ws_close.bind(this);
            this.connection.onmessage =  this.ws_message.bind(this);
            this.notif_rconnect.hide();
        } catch(e) {
        }
    }

    reconnect(){
        setTimeout(() => {
            this.connect();
            this.notif_rconnect.show();
        }, 10000);
    }

    ws_open(){
        var notif = new YNotification("", "WS Connected!");
        notif.show();
    }

    ws_error(){
        var notif = new YNotification("", "WS Error!");
        notif.show();
    }

    ws_close(){
        this.reconnect();
    }

    ws_message(data){
    }

}