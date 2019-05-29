$(function() {
    drawNavAct(0);
    darwJxtztb();
    darwDzlbtb();
    darwTktjtb();
    darwBrACphb();
    blocks();
    Copmlist();
    CompRank();
});

//加载教学通知信息方法
function darwJxtztb() {
    $.ajax({
        type: "POST",
        url: "/index/getJxtzList",
        dataType: "json",
        success: function (result) {
            debugger
            var s = "";
            for (var i=0; i<result.length; i++){
                s += '<tr><td class="project-title">'
                s += '<a onclick="openJxtzById(\''+result[i].id+'\')">'+result[i].author+'－'+result[i].title+'</a><br>'
                s += '<small>创建于 '+result[i].time+'</small></td></tr>'
            }
            $("#jxtztb").append(s)
        }
    });
}

//加载教学通知弹窗信息方法
function openJxtzById(id) {
    $.ajax({
        type: "POST",
        url: "/index/getJxtzById",
        data:{
            id:id
        },
        dataType: "json",
        success: function (result) {
            $("#jxtzDialogTitle").html(result.title);
            $("#jxtzDialogZuoZhe").html(result.author);
            $("#jxtzDialogCjsj").html(result.time);
            $("#jxtzDialogTznr").html(result.content);
            $('#jxtzDialog').modal('show');
        }
    });
}

//加载待做列表table
function darwDzlbtb() {
    if($("#dzlbTb").length>0){
        $.ajax({
            type: "POST",
            url: "/index/getReToDo",
            dataType: "json",
            success: function (result) {
                debugger
                if(result.length > 0){
                    var s = '';
                    s += '<table class="table table-hover"><tbody>';
                    for (var i=0; i< result.length; i++){
                        s += '<tr><td class="project-status">';
                        //若当前时间大于等于开始时间为进行中
                        if (new Date() >= new Date(result[i].start)){
                            s+='<span class="label label-primary">进行中</span>'
                        }else{
                            s+='<span class="label label-warning-light">未开始</span>'
                        }
                        s += '</td><td class="project-title"><a>'+result[i].name+'</a><br>';
                        s += '<small>开始时间:'+result[i].start+'&nbsp;&nbsp;&nbsp;</small>';
                        s += '<small> 结束时间:'+result[i].end+'</small></td></tr>';
                    }
                    s += '<tbody></table>';

                    $("#dzlbTb").append(s)
                    drawOverFlow("dzlbTb");
                }else{
                    $("#dzlbTb").append('<img src="/css/img/blank2.jpg" style="height: 330px;padding-left: 28px;">');
                }
            }
        });
    }
}


function darwTktjtb() {
    if($("#tktjTb").length>0){
        $.ajax({
            type: "POST",
            url: "/index/getRecommandList",
            dataType: "json",
            success: function (result) {
                debugger
                if(result.length > 0){
                    var s = '';
                    s += '<table class="table table-hover"><tbody>';
                    for (var i=0; i< result.length; i++){
                        s += '<tr><td class="project-title">'+result[i].pid+'</td><td class="project-title">';
                        s += '<a onclick="openJxtzById(\'\')">'+result[i].p_name+'</a>'
                        s += '</td></tr>';
                    }
                    s += '<tbody></table>';

                    $("#tktjTb").append(s)
                    drawOverFlow("tktjTb");
                }else{
                    $("#tktjTb").append('<img src="/css/img/blank2.jpg" style="height: 330px;padding-left: 28px;">');
                }
            }
        });
    }
}
function darwBrACphb() {
    $.ajax({
        type: "POST",
        url: "/index/getRankPerDayFromRedis",
        dataType: "json",
        success: function (result) {
            debugger
            if(result.length > 0){
                var s = '<table class="table table-hover"><thead><tr>';
                s += '<th>排名</th><th>姓名</th><th>学号</th><th>班级</th><th>A题数量</th>';
                s += '</tr></thead><tbody>';
                for (var i=0; i< result.length; i++){
                    s += '<tr>';
                    s += '<td>'+(i+1)+'</td>';
                    s += '<td>'+result[i].userName+'</td>';
                    s += '<td>'+result[i].userAccount+'</td>';
                    s += '<td>'+result[i].userClassName+'</td>';
                    s += '<td>'+result[i].userACProblems.length+'</td>';
                    s += '</tr>';
                }
                s += '</tbody></table>';

                $("#brACphb").append(s)
                drawOverFlow("brACphb");
            }else{
                $("#brACphb").append('<img src="/css/img/blank2.jpg" style="height: 330px;padding-left: 28px;">');
            }
        }
    });
}


//通过标签ID动态添加纵向滚动条
function drawOverFlow(tagId) {
    if ($("#"+tagId).parent().height() < $("#"+tagId).height()){
        $("#"+tagId).parent().css("overflow","scroll");
        $("#"+tagId).parent().css("overflow-x","hidden");
    }
}
function blocks() {
    $.ajax({
        type:"POST",
        url: "/index/getPostFlagList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function(result) {
            debugger
            var end=3
            if(end>result.length){
                end=result.length
            }

            var newTest="";
            for(var i=0;i<end;i++){
                newTest+=' <div class="row">\n' +
                    '                        <div class="col-sm-9">\n' +
                    '                            <div class="forum-icon">\n' +
                    '                                <i class="fa fa-clock-o"></i>\n' +
                    '                            </div>\n' +
                    '                            <a onclick="openPage(\'/discussion/showarticle/'+result[i].id+'/'+result[i].name+'/'+result[i].sub_id+'\''+')" class="forum-item-title">'+result[i].title+
                    '                                    <b class="btn btn-primary btn-xs">置顶</b>                                        </a>\n' +
                    '                            <div class="forum-sub-title">'+result[i].content.replace(/<[^>]+>/g,"").substring(0,50)+'</div>\n' +
                    '                            <span color="#676a6c">'+result[i].name+'&nbsp;&nbsp;<i class="fa fa-clock-o"></i>发表于 :'+formatTime(result[i].time)+'</span>\n' +
                    '                            <span>&nbsp;&nbsp;&nbsp;&nbsp;发表在[<b color="#676a6c">'+result[i].topic_name+'</b>]中</span>                                </div>\n' +
                    '                        <div class="col-sm-1 forum-info">\n' +
                    '                                        <span class="views-number">\n' +result[i].view_num+
                    '                                        </span>\n' +
                    '                            <div>\n' +
                    '                                <small>浏览</small>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <div class="col-sm-1 forum-info">\n' +
                    '                                        <span class="views-number">\n' +result[i].zan_num+
                    '                                        </span>\n' +
                    '                            <div>\n' +
                    '                                <small>点赞</small>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                        <div class="col-sm-1 forum-info">\n' +
                    '                                        <span class="views-number">\n' +result[i].reply_num+
                    '                                        </span>\n' +
                    '                            <div>\n' +
                    '                                <small>回复</small>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </div><hr>';
            }
        $('#Parentform').append(newTest);
        }
    })
}
function formatTime(time) {
    time = time.split(".")[0];
    time = time.replace("T", " ");
    return time;
}

function Copmlist() {
    $.ajax({
        type:"POST",
        url: "/index/getAComp",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function (result) {
            debugger;
            var end=0;
            if(result.length==0){
               $('#Comp').html("")
                return;
            }else{
                $('#node').html("")
            }
            if(result.length>=3) {
                end=3
            }else{
                end=result.length
            }
            var newTest="";
            for(var i=0;i<end;i++){
                newTest+='   <tr>\n' +
                    '                                    <td class="project-status">\n' +
                    '                                                    <span class="label label-primary"\n' ;
                if(result[i].flag==1){
                    newTest+=' style="background-color: #52dc5bd6;">进行中';
                }else{
                    newTest+='>未开始';
                }
                    newTest+='                                                </span></td>\n' +
                    '                                    <td class="project-title">\n' +
                    '                                        <a onclick="openPage('+'/competition/'+')">'+result[i].name+'</a>\n' +
                    '                                        <br>\n' +
                    '                                        <small>开始时间' + formatTime(result[i].start) + '</small>\n' +
                    '                                    </td>\n' +
                    '                                    <td class="project-completion">\n' ;
                if(result[i].flag==1){
                    newTest+='<small>竞赛正在进行中</small>';
                }else{

                        newTest+='                                    <small>点击进行报名</small>\n';


                }

                newTest+= '                                </td>\n' +
                    '                            </tr>';
            }
            $('#Comp').append(newTest);
            }
        })
}
function CompRank() {
    $.ajax({
        type: "POST",
        url: "/index/getrankList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success: function (result) {
            debugger;
            console.log(result);
            var newTest="";
            var k=0;
            for(var i=0;i<result.length;i++){
                if(result[i].name!=undefined) {
                    k = i + 1;
                    newTest += '<tr>\n' +
                        '<td><span class="rate-num rating'+k+'">'+k+'</span></td>' +
                        '<td>'+result[i].className+'</td>'+
                        '                        <td  style="color:'+getColor()+'">' + result[i].name + '</td>\n' +
                        '<td>'+result[i].ac+'</td>'+
                        '                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + result[i].num + '</td>\n' +
                        '</tr>';
                }
                // var oGameName = document.getElementsByClassName("gameName")[0];

            }
            $('#rankList').append(newTest);
        }

    })
}
function getColor()
{
    var colorArray =new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
    var color="#";
    for(var i=0;i<6;i++)
    {
        color += colorArray[Math.floor(Math.random()*16)];
    }
    return color;
}