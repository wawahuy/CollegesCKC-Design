chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    var data = message.data;
    switch(message.action){
        case 'init':
            /// content.js
            init();
            break;

        case 'init_profile':
            /// content.js
            initProfileCurrent();
            break;

        case 'init_admin':
            Admin.IconPos = message.data;
            Admin.init();
            break;

        case 'getNumClient':
            $('#n-admin').html("Admin("+message.data.admins+")");
            $('#n-guest').html("Guest("+message.data.guests+")");
            break;

        case 'alert':
            AlertClient(message.data);
            break;
    }
});


//// Alert ////
function AlertClient(message){
    var o = $("<div>"+message+"</div>");
    $("#yuh-alert").append(o);
    setTimeout(function (o){
        o.remove();
    }, 4300, o);
}



////// Move Element ///////
class DragDom {
    constructor(e, callback, mx = 0, my = 0){
        this.drag = false;
        this.e = e;
        this.e.mousedown(this.down.bind(this));
        $(document.body).mousemove(this.move.bind(this));
        $(document.body).mouseup(this.up.bind(this));
        this.mx = mx;
        this.my = my;
        this.callback = callback;
        this.updMar();
    }

    down(e){
        
        if(this.drag == false){
            this.handlerTO = setTimeout(this.reg_down.bind(this), 250, e);
        } else {
            this.e.css('cursor', 'default');
            this.drag = false;
            $(".yuh_drag").remove();
            this.callback(this.mx, this.my);
        
        }
    }

    reg_down(e){
        this.drag = true;
        this.p = e;
        this.e.css('cursor', 'move');
        $(document.body).append('<div class="yuh_drag"></div>');
    }

    up(e){
        if(!!this.handlerTO){
            clearInterval(this.handlerTO);
            this.handlerTO = undefined;
        }

    }

    move(e){
        if(this.drag == false)
            return;

        var tx = e.pageX - this.p.pageX;
        var ty = e.pageY - this.p.pageY;
        this.mx += tx;
        this.my += ty;
        this.updMar();
        this.p = e;
    }

    updMar(){
        this.e.css('margin-left', this.mx+'px');
        this.e.css('margin-top', this.my+'px');
    }
}


Admin = {};
Admin.IconPos = {};

Admin.init = function (){
    if($('#yuh_admin').length > 0)
        return;

    $(document.body).append(Admin.generalCode);
    new DragDom($('#yuh_admin'), Admin.changeIconPosition, Admin.IconPos.x, Admin.IconPos.y);

    $('.yuh-admin-menu').click(function (){
        if(!$(this).hasClass('exit-menu')){
            $(this).addClass('exit-menu');
            $('.yuh-admin-main').css('display', 'block');
            $('.yuh-admin-main').css('opacity', 1);
            $($('.menu').find('div').get(0)).click();
        }
        else {
            $(this).removeClass('exit-menu');
            $('.yuh-admin-main').css('display', 'none');
            $('.yuh-admin-main').css('opacity', 0);
            $('.menu div[data-load="1"]').attr('data-load', 0);
        }
    });

    $('.menu').find('div').click(function (){
        var m = $(this).attr('data-page');
        if(!!m && $(this).attr('data-load') == '0'){
            $('#yuh_content').html("<div class='lds-hourglass'></div>");
            $('.menu div[data-load="1"]').attr('data-load', 0);
            $(this).attr('data-load', '1');
            (Pages[m].bind($('#yuh_content')))();
        }
    });

}

Admin.changeIconPosition = function (x, y) {
    chrome.runtime.sendMessage(
        { 
            action: 'upd_pos_icon_admin',
            data: {
                x, y
            },
        }, data => {});
}



Admin.generalCode = `
    <div class="yuh-admin" id="yuh_admin">
        <div class="yuh-admin-menu">
            <span></span>
            <span></span>
            <span></span>
            <span id="n-admin">---</span>
            <span id="n-guest">---</span>
            <div class="alert" id="yuh-alert">
            </div>
        </div>

        <div class="yuh-admin-main">
            <div class="title">
                Admin Cao Thắng Student
            </div>
            <div class="menu">
                <div data-load='0' data-page='PageInfo'>Chung</div>
                <div data-load='0' data-page='PageUserOnline'>DS User</div>
                <div data-load='0' data-page='PageProfie'>DS Hồ Sơ FB</div>
                <div data-load='0' data-page='PageLike'>DS Like</div>
                <div data-load='0' data-page='PageHistory'>Lịch Sử Search</div>
                <div data-load='0' data-page='PageComment'>Duyệt B.Luận</div>
                <div data-load='0' data-page='PageChat'>Kênh thế giới</div>
            </div>
            <div class="content" id="yuh_content">
            </div>
        </div>
    </div>
`;


////// Real time init ////////
function Send(action, data){
    return new Promise((res, rej) => {
        try {
            chrome.runtime.sendMessage(
                { 
                    action: 'realtime',
                    data: {action, data}
                }, dt => { res(dt) });
        } catch(e) {
            rej();
        }
    });
}



//////// Page /////////

Pages = {};


////////////////////// Page Info /////////////////////

Pages.PageInfo = async function () {
    info = await Send('getPageInfo');
    
    admins = info.admins.map(element => {
        return element;
    });

    this.html(`
        <div style="line-height: 25px;">
            Hiện tại có <span style="color: red;">${info.admins.length}</span> admin trực tuyến.<br>
            Hiện tại có <span style="color: red;">${info.guests}</span> khách trực tuyến.<br> 
            Server RT uptime: <span style="color: red;">${info.uptime}</span><br>
            <hr>
            Danh sách admin trực tuyến: <span style="color: red;">
                ${admins}
            </span>
        </div>
    `);
}