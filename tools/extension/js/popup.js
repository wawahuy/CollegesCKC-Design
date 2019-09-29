
/// Load page
const load_page = function (name){
    $.ajax(name+".html",
        {
            success: function (data, status, xhr) {
                $('#content').html(data);
                Page[name]();
            }
        });
}


/// Status
const initStatus = function (){
    $('#on-off-switch').change(function (){
        chrome.storage.sync.set({"status" : this.checked}, function (){
            refer_page();
        });
    });
}


/// Login
const initLogin = function (){
    $('#login').click(function (){
        $('#loading').show();
    });
}




/// ------------ Main ------------------------

Page = {
    "login" : initLogin,
    "off" : function (){}
};


const refer_page = function (){
    chrome.storage.sync.get("status", function (data){
        let page = 'off';
        if(data["status"]){
            page = "login";
            $("#on-off-switch").prop('checked', true);
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
