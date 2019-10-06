var handleTimeout;
var nameID = ['ops_course_', 'ops_industry_', 'ops_class_', 'ops_codename_'];

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    var data = message.data;
    switch(message.action){
        case 'init':
            init();
            break;
    }
});


var htmlCardProfile = function (id){
    return `
        <div class="_yuh_b_card" id="yuh_profile_${id}">
            <div class="_yuh_b_deltail">UID:${id} getting ...</div>
        </div>
    `;
}

var CreateOption = function (idname, id, opts){
    var code = `<div class="select"><select id="${idname + id}">`;
    Object.keys(opts).forEach(e => {
        code += `<option value="${e}">${opts[e]}</option>`;
    });
    code += "</select></div>"
    return code;
}

var applyResponseGetting = function (id, data){
    d = $(`#yuh_profile_${id}`);
    d.html(
        CreateOption("ops_course_", id, {
            0  : "khóa học",
            17 : "Khóa 17",
            18 : "Khóa 18",
            19 : "Khóa 19",
        }) +
        CreateOption("ops_industry_", id, {
            0  : "nghành",
        }) +
        CreateOption("ops_class_", id, {
            0  : "lớp",
        }) +
        CreateOption("ops_codename_", id, {
            0  : "mssv + tên",
        }) +
        `<button class='button-upd'>cập nhật</button>
         <div class='deltail'>
            <div>cập nhật</div>
            <div class='date'>2:04SA 07/19/2019</div>
            <div class='line'></div>
            <div>bởi</div>
            <div class='author'>YUH</div>
         </div>
         <div class='cls-both'></div>
        `
    );

    nameID.forEach(element => {
        $('#' + element + id).change(function (){
            var t = $(this);
            var r = /^(?<name>.*)_(?<id>[\d]+)$/g.exec(t.attr('id'));
            var name = r.groups['name'];
            var id = r.groups['id'];
            var index = nameID.indexOf(name + '_');

            if(index < nameID.length){
                $('#' + nameID[index + 1] + id).after("<div class='lds-hourglass'></div>");

                for(i=index+1; i<nameID.length; i++){
                    $('#' + nameID[i] + id).prop( "disabled", true );
                }
            }
        });
    });

    if(!!data){
    } else {
    }
}

var findCardProfile = function (){
    var get_uid = "";

    $('div[id^="pagelet_timeline_app_collection_"]').find('li:not([yuh_test])').each(function (){
        var link = $(this).find("a[data-hovercard^='/'");
        try {
            var uid = /user\.php\?id=(?<uid>[\d\D]+)&/g.exec(link.attr('data-hovercard')).groups.uid;
            get_uid += uid+"|";
            $(this).attr("yuh_test", true);
            $(this).append(htmlCardProfile(uid));
        } catch (e){
        }
    });

    chrome.runtime.sendMessage(
        { 
            action: 'find_by_uid',
            data: get_uid.substr(0, get_uid.length-1)
        },
        function (data){
            Object.keys(data).forEach(key => {
                applyResponseGetting(key, data[key]);
            });
        });
}


var init = function () {
    $(document).ready(function (){
        handleTimeout = setTimeout(findCardProfile, 500);

        $(window).scroll(function(){
            clearTimeout(handleTimeout);
            handleTimeout = setTimeout(findCardProfile, 100);
        });
    });
}