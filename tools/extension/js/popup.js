/// Load page
const load_page = function (name, ...args){
    $.ajax(name+".html",
        {
            success: function (data, status, xhr) {
                $('#content').html(data);
                Page[name](args);
            }
        });
}


/// Status
const initStatus = function (){
    $('#on-off-switch').change(function (){
        
        if(!this.checked){
            $('#loading').hide();
        }

        chrome.runtime.sendMessage(
            { 
                action: 'status',
                status: this.checked
            },
            function (data){
                refer_page();
            });

    });
}


/// Login
const initLogin = function (){
    $('#login').click(function (){
        $('#loading').show();

        chrome.runtime.sendMessage(
            { 
                action: 'login',
                user: $('#username').val(),
                pass: $('#password').val()
            },
            function (data){
                if(data.status){
                    $('#loading').hide();
                    load_page('app', data.data);
                } else {
                    alert('Lỗi đăng nhập!');
                }
            });
    });
}


/// Relogin
const initReLogin = function (){
    $('#loading').show();

    chrome.runtime.sendMessage(
        { 
            action: 'relogin'
        },
        function (data){
            if(data.status){
                load_page('app', data.data);
            } else {
                load_page('login');
            }
            $('#loading').hide();
        });
}


/// App
const initApp = function (...args){
    let data = args[0][0];
    $('#aliases').html(data["aliases"]);
}




/// ------------ Main ------------------------

Page = {
    "login"     : initLogin,
    "relogin"   : initReLogin,
    "off"       : function (){},
    "app"       : initApp
};


const refer_page = function (){
    chrome.storage.sync.get(["token", "status"], function (data){
        let page = 'off';
        if(data["status"]){
            page = "login";
            $("#on-off-switch").prop('checked', true);

            if(data["token"]){
                load_page("relogin");
                return;
            }
        } else {
            $("#on-off-switch").prop('checked', false);
        }
        
        load_page(page);
    });
}


$(document).ready(function() {
    refer_page();
    initStatus();
});
