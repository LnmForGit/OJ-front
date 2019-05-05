var table = $("#table");
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
            })

        }
    })

}

//将时间戳转换为正常时间格式
function formatTime(timeStamp) {
    var date = new Date(timeStamp*1000);
    var  Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var  D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var  m = date.getMinutes() + ':';
    var  s = date.getSeconds();
    return (Y+M+D+h+m+s);
}

//显示单个实验
function setExperItem(id,name,start,end,score){
    var experItem = "<tr>";
    var underWay =   "<td class=\"project-status\">" +
                    "<span class=\"label label-primary\">进行中</span>" +
                     "</td>";
    var finished = "<td class=\"project-status\">\n" +
                     "<span class=\"label label-default\">已结束\n" +
                    "</td>";
    var endIf = isEnd(end) ? 1 : 0;
    experItem += isEnd(end) ? finished : underWay;
    experItem += "<td class=\"project-title\">\n" +
        "                                        <a href=experDetail?id=" + id + "&isEnd="+endIf+"  >" +name+"</a>\n" +
        "                                        <br/>\n" +
        "                                        <small>创建日期:"+ start  +"&nbsp&nbsp&nbsp</small>\n" +
        "                                        <small>  结束日期:" + end + "</small>\n" +
        "                                    </td>\n" +
        "\n" +
        "                                    <td class=\"project-actions\">\n" +
        "                                        <a href=experDetail?id=" + id + "&isEnd="+endIf+" class=\"btn btn-white btn-sm link\"><i class=\"fa fa-folder\"></i> 查看 </a>\n" +
        "                                    </td>\n" +
        "                                </tr>";
    table.append(experItem);
}

//判断实验是否到期
function isEnd(end){
    var time = getNowFormatDate();
    return ((time >= end)  ? true :false);
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
function examOrExper(){
    var pathname = window.location.pathname;
    if(pathname == "/experiment/"){
        getExperInfo();
    }else if(pathname == "/exam/"){
        $("#title").html("考试");
        $("#t").html("所有考试")
    }

}



