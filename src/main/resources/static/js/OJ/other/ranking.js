$(document).ready(function () {
    index();
    getRanking();
    getRanking1();
});

function index() {
    $.ajax({
        url: "/ranking/",
    })
}
//重置form内的标签
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
}

function getRanking() {
    var dataTable = $('#RankingInfoTable');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "searching" : false,
        "serverSide": true,
        "autoWidth": false,
        "processing": true,
        "ajax": {
            url: "/ranking/getRankingMaplist",
            type: "POST",
        },
        "bSort": false,
        "columns": [{
            "data": "rank"
        }, {
            "data": "name"
        }, {
            "data": "ac"
        }, {
            "data": "tot"
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                return '<a data-toggle=\'modal\' data-target=\'#myModal5\' onclick="showEdit(\''+row.name+'\',\''+row.account+'\')">'+row.name+'</a>'
            },
            "targets" :1
        }]
    });
}

function showEdit(name,account) {
    $("#dialogTitle").html("用户信息")
    $("#name").html("")
    $("#rank").html("")
    $("#aclv").html("")
    $("#Class").html("")
    $("#user_id").html("")
    $("#ac").html("")
    $("#nac").html("")
    document.getElementById("bb1").innerHTML = "";
    document.getElementById("bb2").innerHTML = "";
    document.getElementById("bb3").innerHTML = "";
    document.getElementById("bb4").innerHTML = "";
    $.ajax({
        type: "POST",
        url: "/ranking/getStudent",
        dataType: "json",
        data:{
             "account" : account
        },
        success:function (result){
            console.log(result);
            $("#name").html(name)
            $("#rank").html(result.rank)
            $("#aclv").html(result.aclv+"(AC:"+result.ac+"/Sub:"+result.tot+")")
            $("#Class").html(result.class)
            $("#user_id").html(account)
            $("#ac").html("(Total:"+result.acCount+")")
            var insertText;
            var len = result.aclist.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.aclist[i];
                document.getElementById("ac").innerHTML+=" <a href='#'>" + insertText + "</a>";
            }
            $("#nac").html("(Total:"+result.nacCount+")")
            len = result.naclist.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.naclist[i];
                document.getElementById("nac").innerHTML+=" <a href='#'>" + insertText + "</a>";
            }
            $("#bb1").html("(Total:"+result.bb1.length+")")
            len = result.bb1.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.bb1[i];
                document.getElementById("bb1").innerHTML+=" <a href='#'>" + insertText + "</a>";
            }
            $("#bb2").html("(Total:"+result.bb2.length+")")
            len = result.bb2.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.bb2[i];
                document.getElementById("bb2").innerHTML+=" <a href='#'>" + insertText + "</a>";
            }
            $("#bb3").html("(Total:"+result.bb3.length+")")
            len = result.bb3.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.bb3[i];
                document.getElementById("bb3").innerHTML+=" <a href='#'>" + insertText + "</a>";
            }
            $("#bb4").html("(Total:"+result.bb4.length+")")
            len = result.bb4.length;
            for(var i=0;i<len;i++)
            {
                insertText = result.bb4[i];
                document.getElementById("bb4").innerHTML+=" <a href='#'>" + insertText + "</a>";
            }
        }
    })
}

function search() {
    $("#dialogTitle").html("用户信息")
    var account = $("#searchid").val();
    $.ajax({
        type: "POST",
        url: "/ranking/getStudent",
        dataType: "json",
        data:{
            "account" : account
        },
        success:function (result){
            if(result.message=="该学生存在")
            {
                $("#name").html(result.name)
                $("#rank").html(result.rank)
                $("#aclv").html(result.aclv+"(AC:"+result.ac+"/Sub:"+result.tot+")")
                $("#Class").html(result.class)
                $("#user_id").html(account)
                $("#ac").html("(Total:"+result.acCount+")")
                var insertText;
                var len = result.aclist.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.aclist[i];
                    document.getElementById("ac").innerHTML+=" <a href='#'>" + insertText + "</a>";
                }
                $("#nac").html("(Total:"+result.nacCount+")")
                len = result.naclist.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.naclist[i];
                    document.getElementById("nac").innerHTML+=" <a href='#'>" + insertText + "</a>";
                }
                $("#bb1").html("(Total:"+result.bb1.length+")")
                len = result.bb1.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.bb1[i];
                    document.getElementById("bb1").innerHTML+=" <a href='#'>" + insertText + "</a>";
                }
                $("#bb2").html("(Total:"+result.bb2.length+")")
                len = result.bb2.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.bb2[i];
                    document.getElementById("bb2").innerHTML+=" <a href='#'>" + insertText + "</a>";
                }
                $("#bb3").html("(Total:"+result.bb3.length+")")
                len = result.bb3.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.bb3[i];
                    document.getElementById("bb3").innerHTML+=" <a href='#'>" + insertText + "</a>";
                }
                $("#bb4").html("(Total:"+result.bb4.length+")")
                len = result.bb4.length;
                for(var i=0;i<len;i++)
                {
                    insertText = result.bb4[i];
                    document.getElementById("bb4").innerHTML+=" <a href='#'>" + insertText + "</a>";
                }
            }
            else if(result.message=="该学生不存在")
            {
                $("#user_id").html("该学生不存在")
            }
        }
    })
}
function getRanking1() {
    var dataTable = $('#RankingInfoTable1');
    if ($.fn.dataTable.isDataTable(dataTable)) {
        dataTable.DataTable().destroy();
    }
    dataTable.DataTable({
        "searching" : false,
        "serverSide": true,
        "autoWidth": false,
        "processing": true,
        "ajax": {
            url: "/ranking/getRankingMaplist1",
            type: "POST",
        },
        "bSort": false,
        "columns": [{
            "data": "rank"
        }, {
            "data": "name"
        }, {
            "data": "ac"
        }, {
            "data": "tot"
        }],
        "columnDefs": [{
            "render" : function(data, type, row) {
                return '<a data-toggle=\'modal\' data-target=\'#myModal5\' onclick="showEdit(\''+row.name+'\',\''+row.account+'\')">'+row.name+'</a>'
            },
            "targets" :1
        }]
    });
}
