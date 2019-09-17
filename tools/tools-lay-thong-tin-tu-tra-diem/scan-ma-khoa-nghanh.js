
const load = (async (khoa, nghanh) => {
  if(khoa < 10) khoa = '0' + khoa;
  if(nghanh < 10) nghanh = '0' + nghanh;

  var f = new FormData();
  f.append('txtMaHSSV', khoa + '' + nghanh + '191001');

  const rawResponse = await fetch('http://tradiem.caothang.edu.vn/', {
    method: 'POST',
    body: f
  });
  const content = await rawResponse.text();

  var p = content.indexOf('Tên Lớp: <b>');

  if(p >= 0){
    ten = content.substring(p + 12, content.length);
    ten = ten.split("</b>")[0];
    console.log(khoa + "" + nghanh + "\t" +ten);
  }

});

for(khoa = 0; khoa<100; khoa++)
    for(nghanh = 0; nghanh<100; nghanh++)
        load(khoa, nghanh);