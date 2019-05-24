$(function() {
    darwJxtztb();
    darwDzlbtb();
    darwTktjtb();
    darwBrACphb();
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