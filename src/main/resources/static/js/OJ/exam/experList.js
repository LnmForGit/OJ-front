var table = $("#table");
var tableRows = 0;
$(document).ready(function () {
    examOrExper();
});

function getExperInfo() {
    $.ajax({
        type: "POST",
        url: "/experiment/getAllExper",
        dataType: "json",
        // data:{
        //     "experName" : $('#experName').val()
        // },
        success:function (result) {
            $.each(result,function(index,value){
                value.start = formatTime(value.start)
                value.end = formatTime(value.end)
                setExperItem(value.id,value.name,value.start,value.end);
                tableRows++;
            })
            tableNull()
        }
    })

}

function getExamInfo() {
    var testID = new Array();
    var testName = new Array();
    var testStart= new Array();
    var testEnd = new Array();
    var is_ip = new Array();
    var only_ip = new Array();
    var first_ip = new Array();
    $.ajax({
        type: "POST",
        url: "/exam/getAllExam",
        dataType: "json",
        // data:{
        //     "experName" : $('#experName').val()
        // },
        success:function (result) {
            //console.log(result)
            var ip = result[result.length - 1].userIp;
            result = result.slice(0,result.length - 1);
            //console.log(result)
            $.each(result,function(index,value){
                value.start = formatTime(value.start)
                value.end = formatTime(value.end)
                tableRows++;
            })
            for(var i = 0; i < result.length; i = i + 2){
                var j = 0;
                if(getTestState(result[i].start,result[i].end) != 0&& getTestState(result[i + 1].start,result[i + 1].end) != 0 && result[i].start == result[i + 1].start){
                    testID[j] = result[i].id;
                    testID[j + 1] = result[i + 1].id;
                    testName[j] = result[i].name;
                    testName[j + 1] = result[i + 1].name;
                    testStart[j] = result[i].start;
                    testStart[j + 1] = result[i + 1].start;
                    testEnd[j] = result[i].end;
                    testEnd[j + 1] = result[i + 1].end;
                    is_ip[j] = result[i].is_ip;
                    is_ip[j + 1] = result[i + 1].is_ip;
                    only_ip[j] = result[j].only_ip;
                    only_ip[j + 1] = result[j + 1].only_ip;
                    first_ip[j] = result[j].first_ip;
                    first_ip[j + 1] = result[j + 1].first_ip;
                    j = j + 2;
                }
            }
            var ipTail = ip.charAt(ip.length - 1);

            //var i = ipTail % 2 == 0 ? 0 : 1;
            for(var i = 0; i < testID.length; i++) {
                console.log(ipTail % 2  == i % 2)

                        if(typeof (result[i].sid) != "undefined"){
                            //console.log(testName[i])
                            i = i + 2
                        }

                        else if(ipTail % 2  == i % 2){
                            //console.log(testName[i])
                            setExperItem(testID[i],testName[i],testStart[i],testEnd[i],is_ip[i],only_ip[j],first_ip[j],ip,1);
                        }
                //alert(testID[i].id)
                // savaFirstIP(ip,testID[i]);
            }

            $.each(result,function(index,value){
                if(typeof (value.sid) != "undefined" ){
                    // if(testID.indexOf(value.sid) == -1){
                       // console.log(value.name)
                        setExperItem(value.id,value.name,value.start,value.end,value.is_ip,value.only_ip,value.first_ip,ip,0);
                    // }
                }else if((testStart.indexOf(value.start) == -1) &&  (testEnd.indexOf(value.end) == -1) && getTestState(value.start,value.end) != 0){
                    setExperItem(value.id,value.name,value.start,value.end,value.is_ip,value.only_ip,value.first_ip,ip,1);
                }
            })
            tableNull()


        }
    })

}

//将时间戳转换为正常时间格式
function formatTime(timeStamp) {
    var date = new Date(timeStamp*1000);
    var  Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var  D = (date.getDate() +1 < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
    var h = date.getHours() + ':';
    var  m = date.getMinutes() + ':';
    var  s = date.getSeconds();
    return (Y+M+D+h+m+s);
}

//显示单个实验
function setExperItem(id,name,start,end,is_ip,only_ip,first_ip,ip,isSaveIp){
   // console.log(first_ip)
    var experItem = "<tr>";
    var underWay =   "<td class=\"project-status\">" +
                    "<span class=\"label label-primary\">进行中</span>" +
                     "</td>";
    var finished = "<td class=\"project-status\">\n" +
                     "<span class=\"label label-danger\">已结束\n" +
                    "</td>";
    var notStarted = "<td class=\"project-status\">\n" +
        "<span class=\"label label-warning-light\">未开始\n" +
        "</td>";
    var testState = getTestState(start,end);
    if(testState == 1){
        experItem += underWay;
    }else if(testState == 0){
        experItem += finished;
    }else if(testState == -1){
        experItem += notStarted;
    }
    experItem += "<td class=\"project-title\">\n";
    experItem += (testState == 0) ?  "<a href=experDetail?id=" + id + "&testState="+testState+"&isSaveIp="+isSaveIp+"  >" +name+"</a>\n" : "<a onclick='hint(\""+id+"\",\""+testState+"\",\""+isSaveIp+"\",\""+is_ip+"\",\""+only_ip+"\",\""+first_ip+"\",\""+ip+"\")'>"+ name + "</a>" ;
    experItem +=   " <br/>\n" +
        "                                        <small>开始日期:"+ start  +"&nbsp&nbsp&nbsp</small>\n" +
        "                                        <small>  结束日期:" + end + "</small>\n" +
        "                                    </td>\n" +
        "\n" +
        "                                    <td class=\"project-actions\">\n" ;
    experItem += (testState == 0) ? " <a href=experDetail?id=" + id + "&testState="+testState+"&isSaveIp="+isSaveIp+" class=\"btn btn-white btn-sm link\"><i class=\"fa fa-folder\"></i> 查看 </a>\n" :" <a onclick='hint(\""+id+"\",\""+testState+"\",\""+isSaveIp+"\",\""+is_ip+"\",\""+only_ip+"\",\""+first_ip+"\",\""+ip+"\")' class=\"btn btn-white btn-sm link\"><i class=\"fa fa-folder\"></i> 查看 </a>\n";
        experItem += "</td>\n" +
        "                                </tr>";
    table.append(experItem);
}

function hint(id,testState,isSaveIp,is_ip,only_ip,first_ip,ip){
    console.log("isSaveIp: " + isSaveIp)
    if(isSaveIp == "undefined"){
        window.location.href ="experDetail?id=" + id + "&testState="+testState+ "&isSaveIp="+isSaveIp;
    }
    if(testState == -1){
        swal({
            title: "未到考试时间",
            text: "现在还未到考试时间，请等待。"
        });
    }else if(testState == 1  &&only_ip == "on" && is_ip == "on" ){
        $.ajax({
            type: "POST",
            url: "/exam/getTestIp",
            dataType: "json",
            data:{
                "tid" : id
            },
            success:function (result) {
                var ipArray = new Array();
                for(var i = 0; i< result.length; i++){
                    if(result[i].ip.charAt(result.length - 1) == '.')
                        result[i].ip = result[i].ip.substring(0,length - 1);
                    ipArray[i] = result[i].ip;
                    console.log("允许进入考试的ip段:" + result[i].ip)
                }
                console.log("绑定ip:"+first_ip)
                console.log("用户ip：" + ip)
                if(!checkIP(ip,ipArray)){
                    //如果用户登陆ip不符合，弹出提示窗

                        swal({
                            title: "考试地址错误！",
                            type: "error",
                            text: "请按照老师要求到指定机房进行考试",
                            confirmButtonText:"确认",
                        });

                }else if(ip != first_ip){

                    swal({
                        title: "该主机ip已绑定！",
                        type: "error",
                        text: "该主机ip已绑定，考试结束后管理员解绑后可使用",
                        confirmButtonText:"确认",
                    });
                }
                else{
                   // window.location.href ="experDetail?id=" + id + "&testState="+testState+ "&isSaveIp="+isSaveIp;
                }
            }
        })
    }

}

//判断实验的状态
// 1.正在进行
// 0. 已结束
// -1.未开始
function getTestState(start,end){
    var time = getNowFormatDate();
    var state = 0;
    if(time >= end){
        state = 0;
    }else if(start > time){
        state = -1;
    }else{
        state = 1;
    }
    return state;
}

//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

//获取url中的参数
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//判断应该展示实验信息/考试信息
function examOrExper(ip){
    var pathname = window.location.pathname;
    if(pathname == "/experiment/"){
        getExperInfo();
    }else if(pathname == "/exam/"){
        $("#bread").html("考试列表")
        $("#t").html("所有考试")
        getExamInfo(ip);
    }
}

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs

    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //sten for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

//考试时检查用户ip是否符合要求
function   checkIP(userIp,ipArray)
{
    var userIp = userIp.substring(0, userIp.lastIndexOf('.'));     //截取IP地址中最后一个.前面的数字
    var res = ipArray.indexOf(userIp) == -1 ? false: true;
    return res;
}

//如果没有考试或实验，删除table，显示图标
function tableNull(){
    //alert(tableRows)
    if(tableRows <= 0){
        $("#table").remove();
        $("#blankImg").css("height",$(window).innerHeight() * 0.7)
    }else{
        $("#tableNull").remove();
    }

}




