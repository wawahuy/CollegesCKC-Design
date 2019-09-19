import requests
import xlsxwriter
import os
import threading
import time
 
dirpath = os.path.dirname(os.path.abspath(__file__))

codeClass = {
    "0463"  :   "CĐN Hàn",
    "0461"  :   "CĐN C.Gọt K.Loại",
    "0462"  :   "CĐN Nguội Sưa Máy",
    "0464"  :   "CĐN KTML & ĐH K.Khí",
    "0465"  :   "CĐN Ô tô",
    "0466"  :   "CĐN Điện Công Nghiệp",
    "0468"  :   "CĐN Quản Trị Mạng PC",
    "0469"  :   "CĐN Lắp Ráp & Sửa PC",
    "0467"  :   "CĐN Đ.Tử Công Nghiệp",
    "0470"  :   "CĐN Kế Toán DN",
    "0301"  :   "CĐ Cơ Khí",
    "0302"  :   "CĐ Ô Tô",
    "0306"  :   "CĐ CNTT",
    "0303"  :   "CĐ KT ĐĐT",
    "0304"  :   "CĐ Cơ Điện Lạnh",
    "0307"  :   "CĐ Cơ Điện Tử",
    "0310"  :   "CĐ Kế Toán", 
    "0308"  :   "CĐ Điện Tử, TT",
    "0300"  :   "CĐ Tự Động Hóa"
}

START_K = 17
END_K = 19


def post(url, data):
    return requests.post(url=url, data=data)

def getInfo(codeA, year, i, row, worksheet):
    if i<10:
        i= '000' + i
    elif i<100:
        i= '00' + i
    elif i<1000:
        i= '0' + i
    else:
        i= str(i)


    data = {'txtMaHSSV': codeA+year+i}
    res = post('http://tradiem.caothang.edu.vn/', data)
    body = res.content

    spbody = body.split('Mã HSSV: <b>'.encode("utf-8"))

    if len(spbody) == 1:
        return False

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

    return True



workbooks = []
countThread = 0

def getClass(c, k, name, worksheet):
    global countThread
    print('Get Class '+name + " K"+ k + " MSSV" + str(c)+str(k)+"xxxx!")
    row = 0
    found = 0
    for stt in range(1001, 5000):
        status = getInfo(str(c), str(k), stt, row, worksheet)
        if status == False:
            found += 1
        else:
            found = 0
            row += 1
        
        if found >= 20:
            print('Complete Class '+name+"! K" + k)
            countThread-=1
            break
        



for k in range(START_K, END_K+1):
    workbook = xlsxwriter.Workbook(dirpath + '/excel/K'+str(k)+'.xlsx')

    for c in codeClass:
        name = codeClass[c]
        worksheet = workbook.add_worksheet(name)
        countThread += 1
        t = threading.Thread(target = getClass, args = (str(c), str(k), name, worksheet))
        t.start()

    workbooks.append(workbook)
    

while countThread > 0:
    time.sleep(1)

for workbook in workbooks:
    workbook.close()

