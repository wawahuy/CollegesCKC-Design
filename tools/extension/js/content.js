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

var CreateOption = function (idname, id, opts, width, disabled = false){
    var code = `<div class="select" style='width: ${width}px'}><select id="${idname + id}" style='width: ${width}px'} data-load="0"  ${disabled ? 'disabled' : ''}>`;
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
                `
                +
                CreateOption("select_search", id, {
                    "0"  : "Tìm tên",
                    "1"  : "Tìm lớp",
                    "2"  : "Tìm MSSV"
                }, 87)
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

    $('#sea_' + id).keydown(function (){
        var t = $(this).next().next();

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

        // $('#' + element + id).click(function (){
        //     var t = $(this);

        //     if(t.attr('data-load') == "1"){
        //         return;
        //     }

        //     t.after("<div class='lds-hourglass'></div>");
        //     t.prop( "disabled", true );

        //     var r = /^(?<name>.*)_(?<id>[\d]+)$/g.exec(t.attr('id'));
        //     var name = r.groups['name'];
        //     var id = r.groups['id'];
        //     var index = nameID.indexOf(name + '_');

        //     if(index < nameID.length){
        //         for(i=0; i<nameID.length; i++){
        //             $('#' + nameID[i] + id).prop( "disabled", true );
        //         }
        //     }
        // });
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