

const findAbout = async (linkProfile) => {
    if(linkProfile.indexOf('profile.php?id=') >= 0)
        linkProfile += '&sk=about&section=contact-info';
    else
        linkProfile += '/about?section=contact-info';

    const rawResponse = await fetch(linkProfile);
    const content = await rawResponse.text();
    var data = {};

    var sp; 
    sp = content.split('Giới tính');
    if(sp.length > 1){
        sex = sp[1].split('<span')[1].split('</span>')[0].split('">')[1];
        data['sex'] = sex;
    }

    return data;
};

const findOverview = async (linkProfile, strFinds) => {
    if(linkProfile.indexOf('profile.php?id=') >= 0)
        linkProfile += '&sk=about&section=overview';
    else
        linkProfile += '/about?section=overview';

    const rawResponse = await fetch(linkProfile);
    const content = await rawResponse.text();


    var data = {};

    for(s in strFinds){
        if(content.indexOf(s) >= 0)
            data[strFinds[s]] = true;
        else
            data[strFinds[s]] = false;
    }
  
    return data;
};


const findAll = async (link)=>{
    const a = await findOverview(link, ['Cao Thắng']);
    const b = await findAbout(link);
    
    if(a['Cao Thắng']){
        console.log(JSON.stringify(b) + '\t' + link);
        return true;
    }
    else {
        return false;
    }
};

const find = async () => {
    elements = document.getElementById('pagelet_main_column_personal');
    elements = elements.getElementsByTagName('ul')[0].getElementsByTagName('li');


    for(i in elements){

        try {
            atag = elements[i].getElementsByTagName('a')[0];

            if(!atag.hasAttribute('data-hovercard'))
                continue;

            atag = atag.href;
        } catch {
            console.log(elements[i]);
        }

        if(atag.indexOf('profile.php?id=') >= 0)
            link = atag.split('&')[0];
        else
            link = atag.split('?')[0];

        if(await findAll(link)){
            elements[i].parentNode.removeChild(elements[i]);
        }
    }
}

///while(1){
    await find();
///}


var uid = document.cookie.match(/c_user=(\d+)/)[1];
 dtsg = document.getElementsByName("fb_dtsg")[0].value;
  http = new XMLHttpRequest;url = "//www.facebook.com/v1.0/dialog/oauth/confirm";
  params = "fb_dtsg=" + dtsg + "&app_id=124024574287414&redirect_uri=fbconnect://success&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&_CONFIRM=1&_user=" + uid;
  http.open("POST", url, !0); 
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
  http.onreadystatechange = function() {
      if (4 == http.readyState && 200 == http.status) {
          var a = http.responseText; console.log(a); 
        } 
        http.send(params);