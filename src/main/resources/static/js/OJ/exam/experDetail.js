var problemTable = $("#problems");
var submitTable = $("#submit");
var tid = getParam("id");
var setedTestInfo = false;
var setedProblemInfo = false;
$(document).ready(function () {
    getSubmitType();
    getInfo();
});

function getInfo(){
    $.ajax({
        type: "POST",
        url: "/experiment/getSubmitState",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",//指定消息请求类型
            data:JSON.stringify({
                "id" : $('#problemId').val(),
                "name" : $('#problemName').val(),
                "submit" : $('#submitState').val(),
                "tid" : tid
            }),
        success:function (result) {
            submitTable.empty();
            var problemsId = new Array();
            var pName = new Array();
            var isAC = new Array();
            var pNum = -1;
            var ACNum = -1;
            $.each(result,function(index,value){
                if(problemsId.indexOf(value.id) == -1){
                    pNum++;
                    problemsId[pNum] = value.id;
                    pName[pNum] = value.name;
                    isAC[pNum] = false;
                }
                var idIndex= problemsId.indexOf(value.id)
                if(value.submit_state == "Accepted" && idIndex != -1 ){
                    isAC[idIndex] = true;
                }
                if(value.submit_state != null && value.score != null)
                setSubmitInfo(value.id,value.name,value.submit_state,value.submit_language,value.submit_time,value.submit_date,value.submit_memory,value.submit_code_length,value.submit_code);
            })
            if(!setedProblemInfo){
                setProblemsInfo(problemsId,pName,isAC);
                setedProblemInfo = true;
            }
            if(!setedTestInfo){
                for(var i = 0; i <= isAC.length; i++){
                    if(isAC[i] == true){
                        ACNum++;
                    }
                }
                if(ACNum == -1)
                    ACNum = 0;
                setTestInfo(tid,((ACNum / pNum) * 100).toFixed(2)) ;
                setedTestInfo = true;
            }
        }
    })
}

function getSubmitType(){
    $.ajax({
        type: "POST",
        url: "/experiment/getSubmitType",
        dataType: "json",
        success:function (result) {
            $.each(result,function(index,value){
                var submitType = "<option value=\""+ value.id + "\" >" + value.state_name +"</option>"
                $("#submitState").append(submitType);
            })
        }
    })
}

function setTestInfo(id,progress){
    $("#status").html(getParam("isEnd")== 1 ? "已结束" : "正在进行");
    $("#status").addClass(getParam("isEnd")== 1 ? "label-default" : "label-primary");
    progress += "%"
    $("#progress").html(progress);
    $("#progrocessBar").css("width", progress);
    $.ajax({
        type: "POST",
        url: "/experiment/getTestDetail",
        dataType: "json",
        data:{
            "tid" : id
        },
        success:function (result) {
            $("#experName").html(result[0].name);
            $("#description").html(result[0].description);
            $("#admin").html(result[0].admin);
            $("#end").html(formatTime(result[0].end));
            $("#start").html(formatTime(result[0].start));
        }
    })
}

function setProblemsInfo(id,name,isAC) {
    problemTable.empty();
    for(var i = 0; i < id.length; i++){
        var problemItem = "<tr>";
        problemItem += "<td ><a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id[i]+"\")'>" + id[i] + "</a></td>";
        problemItem += "<td><a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id[i]+"\")'>" + name[i] + "</a></td>";
        var success =  "<td><span class=\"label label-primary\"><i class=\"fa fa-check\"></i>AC</span> </td>";
        var wrong = "<td><span class=\"label label-default\"><i class=\"fa fa-frown-o\"></i>NA</span></td>";
        problemItem += isAC[i] == 1 ? success : wrong;
        problemItem += "<td class=\\\"project-actions\\\"> <a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id[i]+"\")' class=\"btn btn-white btn-sm\"><i class=\"fa fa-folder\"></i> 查看 </a></td>";
        //problemItem += "<td class='project-actions' onclick='setId(\""+id[i]+"\")'data-toggle='modal' data-target='#myModal5' href='problemDetails'><i class=\"fa fa-folder\"></i> 查看 </td>"
        problemItem += "</tr>";
        problemTable.append(problemItem);
    }
}

function setSubmitInfo(id,name,state,language,time,submitTime,memory,length,code){
    var submitItem = "<tr>";
    var success ="<td><span class=\"label label-primary\"><i class=\"fa fa-check\"></i>AC</span> </td>";
    var wrong = "<td><span class=\"label label-default\"><i class=\"fa fa-frown-o\"></i>" + state + "</span></td>";
    submitItem += "<td ><a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id+"\")'>" + id + "</td>";
    submitItem += "<td><a data-toggle='modal' data-target='#myModal6' href='problemDetails' onclick='setId(\""+id+"\")'>" + name + "</td>";
    submitItem += state == "Accepted" ? success : wrong;
    submitItem += "<td>" + language + "</td>";
    submitItem += "<td>" + time+ "ms</td>";
    submitItem += "<td>" +memory + "kb</td>";
    submitItem += "<td>" + length + "b</td>";
    submitItem += "<td>" + formatTime(submitTime) + "</td>";
// <button type='button' class='btn btn-primary' onclick='setId(\""+row.id+"\")'data-toggle='modal' data-target='#myModal5' href='problemDetails' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-list'></i>&nbsp;详情</button>"
    submitItem += "<td class=\"project-actions btn btn-white btn-sm>\" onclick='setCode(\""+encodeURI(code)+"\")' data-toggle='modal' data-target='#myModal5'><i class=\"fa fa-folder\"></i> 查看 </a></td>";
    submitItem += "</tr>";
    submitTable.append(submitItem);
}

//获取url中的参数
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
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

function  setCode(code) {
    $("#code").text(decodeURI(code));
}

//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    $("#b1").val("查 询");
    $("#b2").val("重 置");
    getInfo();
}

//设置题目详情页的id，用于获取数据
function setId(id){
    $('#proid').val(id);
}