window.WebSocket = window.WebSocket || window.MozWebSocket;

class Realtime {
    constructor(){
        if(!!Realtime.instance && !Realtime.instance.forceClose){
            return Realtime.instance;
        }

        Realtime.instance = this;

        this.connect();

        this.stackId = 0;
        this.stackReCall = {};

        return this;
    }

    connect(){
        this.forceClose = false;

        try {
            this.connection = new WebSocket(WS+'/admin_'+token);
            this.connection.onopen    =  this.ws_open.bind(this);
            this.connection.onerror   =  this.ws_error.bind(this);
            this.connection.onclose   =  this.ws_close.bind(this);
            this.connection.onmessage =  this.ws_message.bind(this);
        } catch(e) {
        }
    }

    reconnect(){
        AlertClient("server RT re-connection...");
        setTimeout(() => {
            this.connect();
        }, 5000);
    }

    ws_open(){
        AlertClient("server RT connected!");
    }

    ws_error(){
    }

    ws_close(){
        if(!this.forceClose)
            this.reconnect();
        else {
            (new SendWhenStart()).add(d.action, {admins: '--', guests: '--'});
        }
    }

    ws_message(e){
        var obj = JSON.parse(e.data);
        try {
            this[obj.action](obj.data, obj);
        } catch {
        }


        if(!!obj.id){
            this.stackReCall[obj.id].response(obj.data);
            this.clear_stack(obj.id);
        }
    }

    send(action, data){
        this.connection.send(JSON.stringify({
            action: action,
            data: data
        }));
    }

    send_and_response(action, data, res, timeout = 20000){
        this.stackId++;
        this.stackReCall[this.stackId] = {};
        this.connection.send(JSON.stringify({
            action: action,
            data: data,
            id: this.stackId
        }));
        this.stackReCall[this.stackId].response = res;
        this.stackReCall[this.stackId].handleTimeout = setTimeout(() => {
            (this.clear_stack.bind(this))(this.stackId);
        }, timeout);
    }

    clear_stack(idStack){
        clearTimeout(this.stackReCall[idStack].handleTimeout);
        this.stackReCall[idStack].response(null);
        delete this.stackReCall[idStack];
    }
    
    close(){
        this.forceClose = true;
        this.connection.close();
    }


    ///////////ACTION///////////////

    getNumClient(data, obj){
        var d = {
            action: 'getNumClient',
            data
        };

        SendAllTabs(d);

        var redata = new SendWhenStart();
        var olddata = redata.get(d.action);

        if(!!olddata){
            var iadmins = data.admins - olddata.data.admins;
            var iguests = data.guests - olddata.data.guests;

            if(iadmins != 0){
                AlertClient(BeaNum(iadmins) + " admin");
            }

            if(iguests != 0){
                AlertClient(BeaNum(iguests) + " guest");
            }
        }

        audio['alert'].play();

        redata.add(d.action, d);
    }
    

    getChatID(id, obj){
        SendAllTabs(obj);
        var redata = new SendWhenStart();
        redata.add(obj.action, obj);
    }

    newChat(data, obj){        
        if((new SendWhenStart()).get('getChatID').data != data.id) 
            audio['chat'].play();
        SendAllTabs(obj);
    }

    actionAuthAdmin(data){
    }
}


function  BeaNum(num) {
    return num < 0 ? num : "+"+num;
}