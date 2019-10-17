window.WebSocket = window.WebSocket || window.MozWebSocket;

class Realtime {
    constructor(){
        if(!!Realtime.instance && !Realtime.instance.forceClose){
            return Realtime.instance;
        }

        Realtime.instance = this;

        this.connect();

        return this;
    }

    connect(){
        this.forceClose = false;

        try {
            this.connection = new WebSocket(WS);
            this.connection.onopen    =  this.ws_open.bind(this);
            this.connection.onerror   =  this.ws_error.bind(this);
            this.connection.onclose   =  this.ws_close.bind(this);
            this.connection.onmessage =  this.ws_message.bind(this);
        } catch(e) {
        }
    }

    reconnect(){
        setTimeout(() => {
            this.connect();
        }, 10000);
    }

    ws_open(){
        /// Use token in background.js
        if(!!token){
            this.send('admin', token);
        }
    }

    ws_error(){
    }

    ws_close(){
        if(!this.forceClose)
            this.reconnect();
    }

    ws_message(e){
        var obj = JSON.parse(e.data);
        this[obj.action](obj.data);
    }

    send(action, data){
        this.connection.send(JSON.stringify({
            action: action,
            data: data
        }));
    }
    
    close(){
        this.forceClose = true;
        this.connection.close();
    }


    ///////////ACTION///////////////

    actionShowNumClient(data){
        var d = {
            action: 'actionShowNumClient',
            data
        };

        SendAllTabs(d);

        (new SendWhenStart()).add(d.action, d);
    }

    actionAuthAdmin(data){
    }
}