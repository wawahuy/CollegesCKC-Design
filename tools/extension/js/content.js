var handleTimeout;
var handleTimeoutSearch;
var limitSearch = 10;
var currentDataSearch;
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

var CreateOption = function (idname, id, opts, width, disabled = false){
    var code = `<div class="select" style='width: ${width}px'}><select id="${idname + id}" style='width: ${width}px' data-load="0"  ${disabled ? 'disabled' : ''}>`;
    Object.keys(opts).forEach(e => {
        code += `<option value="${e}">${opts[e]}</option>`;
    });
    code += "</select></div>"
    return code;
}

var applyResponseGetting = function (id, data){
    d = $(`#yuh_profile_${id}`);
    d.html(
        `   
            <div class="rela">
                <input type="text" name="sea_${id}" id="sea_${id}" class="inp-sea" placeholder="Nhập tên tìm kiếm..."/> 
                [<a id='supportSearch${id}'>?</a>]
                `
                +
                `
                <div class="result-sea" id="result_sea_${id}"></div>
            </div>
            <div class="title-up">
                <span></span>
                <span class="text">Cập nhật</span>
                <span></span>
            </div>
        `+
        CreateOption("ops_course_", id, {
            "-1"  : "khóa học",
        }, 77) +
        CreateOption("ops_industry_", id, {
            "-1"  : "nghành",
        }, 69, true) +
        CreateOption("ops_class_", id, {
            "-1"  : "lớp",
        }, 46, true) +
        CreateOption("ops_codename_", id, {
            "-1"  : "mssv + tên",
        }, 87, true) +
        `<button class='button-upd' id='upd_${id}' disabled>cập nhật</button>
         <div class='deltail'>
            <div>cập nhật</div>
            <div class='date'>--</div>
            <div class='line'></div>
            <div>bởi</div>
            <div class='author'>--</div>
         </div>
         <div class='cls-both'></div>
        `
    );

    $('#supportSearch'+id).click(function () {
        alert(`
            - Tìm nhiều phần ngăn cách bởi dấu phẩy
            VD: Nguyen, Huy
            - Tìm tên bắt đầu bằng Ten:ten
            VD: Nguyen, Ten:Huy
            - Kèm MSSV bắt đầu bằng MSSV:mssv
            VD: MSSV:0306171248
        `);
    });
    

    var cll = function (data){
        this.obj.next(".lds-hourglass").remove();
        this.obj.prop("disabled", false );
        this.obj.attr('data-load', '1');
        this.obj.find("option:not([value='-1'])").remove();

        data.forEach(e => {
            this.obj.append(`<option value=${e.code}>${e.name}</option>`);
        });

        for(i=this.index + 1; i<nameID.length; i++){
            $('#' + nameID[i] + this.id).attr('data-load', '0');
            $('#' + nameID[i] + this.id).prop( "disabled", true );
        }
    };

    var courseDom = $('#ops_course_'+id);
    
    var updateOptions = ((d, data) => {
        $('#yuh_test_'+id).css('border', '1px solid green');
        d.find('.author').html(data.admin_aliases);
        d.find('.date').html(data.updated_at);
        $('#upd_'+id).next('.lds-hourglass').remove();
        d.find('.author').next('span').remove();
    }).bind(null, d)


    $('#upd_'+id).click(() => {
        $('#upd_'+id).after("<div class='lds-hourglass'></div>");
        chrome.runtime.sendMessage(
            { 
                action: 'update_fb_uid',
                data: {
                    'fb_uid': id,
                    'profile_id': $('#ops_codename_'+id).val()
                }
            }, (data) => {
                updateOptions(data[id]);
            });
    });

        
    if(!!data){
        updateOptions(data);
        $('#'+nameID[0] + id).append(`<option value='${data.course_code}' selected>${data.course_name}</option>`);
        $('#'+nameID[1] + id).append(`<option value='${data.industry_code}' selected>${data.industry_code} - ${data.industry_name}</option>`);
        $('#'+nameID[2] + id).append(`<option value='${data.class_id}' selected>${data.class_name}</option>`);
        $('#'+nameID[3] + id).append(`<option value='${data.id}' selected>${data.code} - ${data.name}</option>`);
        nameID.forEach(e => $('#'+ e + id).prop('disabled', true));

        if(!!data.fb_uid){
            $('#upd_'+id).prop('disabled', $('#ops_codename_'+id).val()=='-1');
        } else {
            $('#upd_'+id).after(`<button id="del_${id}" class="button-upd">Xóa</button>`);
            $('#del_'+ id).click(() => applyResponseGetting(id, null));
        }
    }
    else {
        d.find('.deltail').append('<span>Chưa có thông tin!</span>');

        courseDom.after("<div class='lds-hourglass'></div>");
        courseDom.prop( "disabled", true );

        chrome.runtime.sendMessage(
            { 
                action: 'get_course'
            },cll.bind({
                obj: courseDom,
                id,
                index: 0
            }));
    }

    

    $('#sea_' + id).keyup(function (){

        var s = $(this);
        var t = $(`#result_sea_${id}`);

        if($(this).val() == ""){
            t.html('');
            t.hide();
            return;
        }

        clearTimeout(handleTimeoutSearch);
        handleTimeoutSearch = setTimeout(() => {

            chrome.runtime.sendMessage(
                { 
                    action: 'find_by_name',
                    data : {
                        start: 0,
                        name: s.val(),
                        num: limitSearch
                    }
                }, (data) => {
                    currentDataSearch = data;
                    var code =  `
                    <span onclick='this.parentNode.style.display = "none"'>x</span>
                    
                    <div class='tb-se'>
                        <table>
                            <tr>
                                <th>Khóa</th>
                                <th>Nghành</th>
                                <th>Lớp</th>
                                <th>Tên</th>
                                <th>MSSV</th>
                            </tr>
                        `;

                    data.forEach((e, i) => {
                        code += `
                        <tr yuh-id='${i}' ${ e.fb_uid != null ? "style='border: 1px solid green;'" : ""}>
                            <td>${e.course_code}</td>
                            <td>${e.industry_name}</td>
                            <td>${e.class_name}</td>
                            <td>${e.name}</td>
                            <td>${e.code}</td>
                        </tr>`;                    
                    })

                    code += `</table></div>
                    <div class='s-p-n'><span class='se-next'>Kế tiếp</span></div>
                    `;

                    t.html(code);

                    $('tr').click(function (){
                        currentDataSearch[$(this).attr('yuh-id')].fb_uid = true;
                        applyResponseGetting(id, currentDataSearch[$(this).attr('yuh-id')]);
                    });
                });

        }, 500);

        if(t.find('.lds-hourglass').length == 0){
            t.html(`
                    <span onclick='this.parentNode.style.display = "none"'>x</span>
                    <div class='lds-hourglass'></div>
                    `);
        }

        t.show();
    });


    nameID.forEach(element => {
        $('#' + element + id).change(function (){
            var t = $(this);
            var r = /^(?<name>.*)_(?<id>[\d]+)$/g.exec(t.attr('id'));
            var name = r.groups['name'];
            var id = r.groups['id'];
            var index = nameID.indexOf(name + '_');

            if(index < nameID.length){
                for(i=index+1; i<nameID.length; i++){
                    $('#' + nameID[i] + id).attr( "data-load", "0" );
                }
            }

            if(index == 3){
                $('#upd_'+id).prop('disabled', $('#ops_codename_'+id).val()=='-1');
            }

            if(t.val() != "-1" && index < nameID.length - 1){
                var i2 = index + 1;
                var t2 = $('#' + nameID[i2] + id);
                t2.after("<div class='lds-hourglass'></div>");
                t2.prop( "disabled", true );

                var cll2 = cll.bind({
                    obj: t2,
                    index: i2,
                    id
                });

                switch(i2){
                    case 1:
                        chrome.runtime.sendMessage(
                            { 
                                action: 'get_industry'
                            }, (data) => {
                                data.forEach(e => {
                                    e.name = e.code + ' - ' + e.name;
                                });
                                cll2(data);
                            });
                        break;

                    case 2:
                        chrome.runtime.sendMessage(
                            { 
                                action: 'get_class',
                                data : {
                                    course: $('#' + nameID[0] + id).val(),
                                    industry: $('#' + nameID[1] + id).val()
                                }
                            }, (data) => {
                                data.forEach(e => {
                                    e.code = e.id;
                                    e.name = 'Lớp ' + e.name;
                                });
                                cll2(data);
                            });
                        break;

                    case 3:
                        chrome.runtime.sendMessage(
                            { 
                                action: 'get_profile',
                                data : {
                                    cls: $('#' + nameID[2] + id).val(),
                                }
                            }, (data) => {
                                data.forEach(e => {
                                    e.name = e.code + ' - ' + e.name;
                                    e.code = e.id;
                                });
                                cll2(data);
                            });
                        break;
                }
            }
        });

        
    });

}

var findCardProfile = function (){
    var get_uid = "";

    $('div[id^="pagelet_timeline_app_collection_"]').find('li:not([yuh_test])').each(function (){
        var link = $(this).find("a[data-hovercard^='/'");
        try {
            var uid = /user\.php\?id=(?<uid>[\d\D]+)&/g.exec(link.attr('data-hovercard')).groups.uid;
            get_uid += uid+"|";
            $(this).attr("yuh_test", true);
            $(this).attr('id', 'yuh_test_'+uid);
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