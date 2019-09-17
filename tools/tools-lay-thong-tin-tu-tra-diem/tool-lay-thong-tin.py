import requests
import xlsxwriter
import os
 
dirpath = os.path.dirname(os.path.abspath(__file__))


# Create an new Excel file and add a worksheet.
workbook = xlsxwriter.Workbook(dirpath + '/excel/19KeToan.xlsx')
worksheet = workbook.add_worksheet()
row = 0
stop = False


def post(url, data):
    return requests.post(url=url, data=data)

def getInfo(codeA, codeB, year, i):
    global workbook, row, stop

    if i<10:
        i= '000' + i
    elif i<100:
        i= '00' + i
    elif i<1000:
        i= '0' + i
    else:
        i= str(i)


    data = {'txtMaHSSV': codeA+codeB+year+i}
    res = post('http://tradiem.caothang.edu.vn/', data)
    body = res.content

    spbody = body.split('Mã HSSV: <b>'.encode("utf-8"))

    if len(spbody) == 1:
        stop = True
        return

    body = spbody[1]


    #sbd
    spbody = body.split('</b><br>Họ Tên: <b>'.encode("utf-8"))
    body = spbody[1]
    sbd = (spbody[0].decode("utf-8"))

    #ten
    spbody = body.split('</b><br/>Ngày Sinh: <b>'.encode("utf-8"))
    body = spbody[1]
    ten = (spbody[0].decode("utf-8"))

    #ngay sinh
    spbody = body.split('</b><br/>Nơi Sinh: <b>'.encode("utf-8"))
    body = spbody[1]
    ngaysinh = (spbody[0].decode("utf-8"))

    #noi sinh
    spbody = body.split('</b><br/>Tên Lớp: <b>'.encode("utf-8"))
    body = spbody[1]
    noisinh = (spbody[0].decode("utf-8"))
    
    #ten lop
    spbody = body.split('</b><br/>Ghi Chú: <b>'.encode("utf-8"))
    body = spbody[1]
    tenlop = (spbody[0].decode("utf-8"))

    worksheet.write(row, 0, sbd)
    worksheet.write(row, 1, ten)
    worksheet.write(row, 2, ngaysinh)
    worksheet.write(row, 3, noisinh)
    worksheet.write(row, 4, tenlop)

    row = row + 1


for i in range(1001, 4010):
    if stop == False:
        getInfo('03','10','19', i)

workbook.close()


#04 70 : CĐN Kế Toán Doanh Ngiệp
#03 10 : CĐ Kế Toán