from urllib.request import urlopen
from bs4 import BeautifulSoup
import xlrd
import xlwt
import re
import time

urlsToVisit=[]
outputTarget="./Final_Answer.xls"
contentState={}
finalAns=[]
cnt=0
version="ver 1.0.1"

def GetSingleTable(num,bigTables):
    ans=[]
    all_Rows = bigTables[num].table.findAll("tbody")
    for eachRow in all_Rows:
        infos = eachRow.tr.findAll("td")
        for eachInfo in infos:
            ans.append(eachInfo.get_text())
    return ans

total=0

def GetDetailedPage(currentURL):

    global cnt
    Info=[]
    ProjectInfo=[]

    html = urlopen("http://www.etherscan.io"+currentURL)
    BeautifulSoupOBJ=BeautifulSoup(html.read(),'html.parser')
    bigTables=BeautifulSoupOBJ.findAll("div",{"class":"tabBody"})
    cnt+=1
    if(len(bigTables)==4):
        contentState[currentURL]=4
        Info = GetSingleTable(2, bigTables)
        ProjectInfo = GetSingleTable(3, bigTables)
        finalAns.append( (True,cnt,currentURL,ProjectInfo,Info))
    else :
        contentState[currentURL]=3
        ProjectInfo = GetSingleTable(2, bigTables)
        finalAns.append( (False,cnt,currentURL, ProjectInfo))

    print (Info)
    print (ProjectInfo)
    # print (finalAns)

def makeFirstSheet(firstSheet):

    firstSheet.write(0,0,"xxx")
    firstSheet.write(1,0,"yyy")
    firstSheet.write(1,1,version)
    firstSheet.write(2,0,"time")
    firstSheet.write(2,1,"Today")
    startLine=6
    tempCnt=0
    # firstSheet.write(,,"")
    firstSheet.write(5, 0, "rank")
    firstSheet.write(5, 1, "name")
    firstSheet.write(5, 2, "time")
    firstSheet.write(5, 3, "link")
    firstSheet.write(5, 4, "money")
    firstSheet.write(5, 5, "lin2")

    for i in range(len(finalAns)):
        tempCnt+=1
        nowProject=finalAns[i]
        firstSheet.write(startLine, 0, str(tempCnt))
        firstSheet.write(startLine, 1, nowProject[3][0])
        firstSheet.write(startLine, 2, nowProject[3][3])
        if(nowProject[0]):
            firstSheet.write(startLine, 3, nowProject[4][22])
            firstSheet.write(startLine, 4, nowProject[4][12])
        firstSheet.write(startLine, 5, "http://www.etherscan.io"+nowProject[2])
        startLine+=1

def makeEverySheet(newSheet,num):
    nowProject = finalAns[num]
    newSheet.write(0, 0, nowProject[3][0])
    newSheet.write(1,0,"info")

    newSheet.write(2, 0, "english")
    newSheet.write(3, 0, "chie")
    newSheet.write(4, 0, "shor")
    newSheet.write(5, 0, "time")

    newSheet.write(2, 1, str(nowProject[3][0]))
    newSheet.write(3, 1, str(nowProject[3][1]))
    newSheet.write(4, 1, str(nowProject[3][2]))
    newSheet.write(5, 1, str(nowProject[3][3]))

    if nowProject[0]:
        words=['state']
        newSheet.write(6, 0, "【test】")
        startLine=7
        for i in range(23):
            newSheet.write(startLine, 0, words[i])
            newSheet.write(startLine, 1, nowProject[4][i])
            startLine+=1

def Output():

    newExcelBook=xlwt.Workbook()
    firstSheet=newExcelBook.add_sheet("首页")
    makeFirstSheet(firstSheet)
    for i in range(len(finalAns)):
        nowProject = finalAns[i]
        sheetName=str(i+1)+" "+''.join([x for x in nowProject[3][0] if x.isalnum()])
        newSheet=newExcelBook.add_sheet(sheetName)
        makeEverySheet(newSheet,i)
    newExcelBook.save(outputTarget)

def GetFirstPage():

    urlsToVisit=[]
    firstPageHtml = urlopen("http://www.etherscan.io/")
    firstPageObj = BeautifulSoup(firstPageHtml.read(), 'html.parser')
    all_TR_tag = firstPageObj.find("table", {"class": "table maintable"}).tbody.findAll("tr")
    for eachCoin in all_TR_tag:
        urlsToVisit.append(eachCoin.findAll("td")[1].a['href'])
    for eachURL in urlsToVisit:
        GetDetailedPage(eachURL)

def GetEveryPage(num):

    global urlsToVisit
    URL="http://www.etherscan.io/list_"+str(num)+".html"
    print (URL)
    firstPageHtml = urlopen(URL)
    firstPageObj = BeautifulSoup(firstPageHtml.read(), 'html.parser')
    all_TR_tag = firstPageObj.find("table", {"class": "table maintable"}).tbody.findAll("tr")
    for eachCoin in all_TR_tag:
        urlsToVisit.append(eachCoin.findAll("td")[1].a['href'])

def Solve():

    str='''
    ************************
           New    Page
    ************************
    '''
    for i in range(14):
        print (str)
        # print (i)
        GetEveryPage(i+1)

    print (urlsToVisit)

    for eachURL in urlsToVisit:
        GetDetailedPage(eachURL)

if __name__ == '__main__':

    Solve()
    # # GetFirstPage()
    # nowURL='/currencies/dao-casino/'
    # GetDetailedPage(nowURL)
    Output()

