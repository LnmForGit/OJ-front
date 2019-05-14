var list=[];
var s=false;
var page=1;
var preComp=[];
$(document).ready(function () {
    getCompList();
    getAComp();
    getrankList();
});
function getCompList() {
    $.ajax({
        type:"POST",
        url: "/competition/getComp",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function (result) {
            console.log(result.list);
             list=result.list;
             Page();
         }
    })
}
function Page() {
    if(list.length<=10){
       List(0);
    }else{
       List(0);
        var page=list.length/10;
        console.log(page);
        test="";
        test+='<button class="btn btn-white" type="button"><i class="fa fa-chevron-left"></i>\n' +
            '                </button>';
        for(var i=0;i<page;i++){
            j=i+1;
            test+='<button class="btn btn-white" onclick="List('+i+')">'+j+'</button>\n'
        }
        test+=' <button class="btn btn-white" type="button"><i class="fa fa-chevron-right"></i>\n' +
            '                </button>';
        $('#page').append(test);
    }
}
function List(page){
    $('#compList').html("");
    newTest="";
    var first=0;
    var end=list.length;
    if(page==0){
        first=0;
        if(list.length<10) {
            end = list.length;
        }else{
            end=10;
        }
    }else{
        first=(page)*10;
        if(first>list.length){
            return;
        }
        if(list.length> page*2*10){
            end=page*10*2;
        }else{
            end=list.length;
        }
    }
    newTest="";
    var k=0
    for(var i=first;i<end;i++){

            k=i+1;
            newTest+='<tr>'+
                '<td>'+k+'</td>\n'+
                '<td><a href="/competition/showComp/'+list[i].id+'">\n'+
                '  <div class="title">'+list[i].name+'</div>\n'+
                '<div class="date">'+formatTime(list[i].start)+'</div></a></td>\n'+
                '<td>'+ list[i].time+'</td>\n'+
                '<td><b class="btn btn-primary btn-xs">虚拟</b></td>\n'+
                '</tr>';

    }
    $('#compList').append(newTest);
}
function getAComp(){
    $.ajax({
        type:"POST",
        url: "/competition/getAComp",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function (result) {
           console.log(result);
          preComp=result;
          var end=0;
          if(result.length==0){
              $('#none').modal();
              return;
          }
          if(result.length>=3) {
              end=3
          }else{
              end=result.length
          }

            newTest = ""
            for (var i=0;i<end;i++) {
                newTest += '<tr onclick="Pan(' + result[i].id + ',' + result[i].flag + ')">\n' +
                    '                                <td class="project-status">\n' +
                    '                                            <span class="label label-primary">进行中\n' +
                    '                                            </span>\n' +
                    '                                </td>\n' +
                    '                                <td class="project-title">\n' + result[i].name +

                    '                                    <br/>\n' +
                    '                                    <small>开始时间' + formatTime(result[i].start) + '</small>\n' +
                    '                                </td>\n' +
                    '                                <td class="project-completion">\n' +
                    '                                    <small>点击进行报名</small>\n' +
                    '                                </td>\n' +
                    '                            </tr>';
            }
            $('#list').append(newTest);
        }
    })
}
function showComp(){
    if(page*3>=preComp.length){
        swal("没有更多了");
        return ;
    }
    var start=page*3;
    var end=start+3;
    if(end>=preComp.length){
        end=preComp.length
    }
    page++;
        newTest = ""
        for (var i=start;i<end;i++) {
            newTest += '<tr onclick="Pan(' + preComp[i].id + ',' + preComp[i].flag + ')">\n' +
                '                                <td class="project-status">\n' +
                '                                            <span class="label label-primary">进行中\n' +
                '                                            </span>\n' +
                '                                </td>\n' +
                '                                <td class="project-title">\n' + preComp[i].name +

                '                                    <br/>\n' +
                '                                    <small>开始时间' + formatTime(preComp[i].start) + '</small>\n' +
                '                                </td>\n' +
                '                                <td class="project-completion">\n' +
                '                                    <small>点击进行报名</small>\n' +
                '                                </td>\n' +
                '                            </tr>';
        }

    $('#list').html("");
    $('#list').append(newTest);
}
function Pan(id,flag) {
   if(flag=='0'){
       window.location.href="/competition/showComp/"+id;
   }else if(flag=='1'){
       console.log(isenroll(id));
      if(isenroll(id)==true){
          window.location.href="/competition/showComp/"+id;
      }else{
          swal("您并未报名此次竞赛！", "记得下次提前报名哦~");
          return;
      }
   }else{
       window.location.href="/competition/showComp/"+id;
   }
}
function isenroll(id){
    var s=false;
    $.ajax({
        type: "POST",
        async:false,
        url: "/competition/Isenroll",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "test_id":id
        }),
        success:function (result) {

            if(result==1){
                console.log(1)
               s= true;
           }else{
                s= false;
          }

        }

    })
  return s;
}
function getrankList() {
    $.ajax({
        type: "POST",
        url: "/competition/getrankList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success: function (result) {
            console.log(result);
            $('#one').html(result[0].name)
            $('#two').html(result[1].name)
            $('#three').html(result[2].name)
            newTest="";
            var k=0;
            for(var i=3;i<15;i++){
                k=i+1;
                newTest+='<tr>\n'+
                    ' <td>&nbsp;&nbsp;'+k+'</td>\n' +
                    '                        <td>'+result[i].name+'</td>\n' +
                    '                        <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+result[i].num+'</td>\n'+
                    '</tr>';
            }
            $('#rankList').append(newTest);
        }

    })
}
function showmore(){
    window.location.href="/competition/showmorerank";
}
function invented(id){
    $.ajax({
        type: "POST",
        url: "/competition/invComp",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "flag":id
        }),
        success: function (result) {
            console.log(1,result);
            if(result!=""){
                 window.location.href="/competition/showComp/"+result;
             }
            if(result=="none"){
                 console.log(1);
                 swal("这里没有你想要的内容哦！", "请重新选择", "fail");
             }
        }

    })
}
function showCompedList() {
    $.ajax({
        type: "POST",
        url: "/competition/CompedList",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success: function (result) {
           if(result.length==0){
                 console.log("没有数据哦");
                 $('#hei').modal();
           }else{
             var dataTable=$('#CompedTable');
               if ($.fn.dataTable.isDataTable(dataTable)) {
                   dataTable.DataTable().destroy();
               }
               dataTable.DataTable({
                   "paging": true,
                   "serverSide": false,
                   "autoWidth": false,
                   "bSort": false,
                   "data": result,
                   "columns": [{
                       "data": "id"
                   }, {
                       "data": "name"
                   }]

               })
           }
        }

    })
}
function formatTime(time) {
    time = time.split(".")[0];
    time = time.replace("T", " ")
    return time;
}
function formatendtime(time){
    return formatTime(time).split(" ")[1];
}