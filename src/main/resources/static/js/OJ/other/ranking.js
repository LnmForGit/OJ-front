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
                return '<a data-toggle=\'modal\' data-target=\'#myModal5\' onclick="showEdit(row)">'+row.name+'</a>'
            },
            "targets" :1
        }]
    });
}

function showEdit(name,id) {
    $("#dialogTitle").html("用户信息")
    $("#name").html(name)
    $.ajax({
        type: "POST",
        url: "/ranking/getStudent",
        dataType: "json",
        data:{
             "id" : id
        },
        success:function (result){
            $("#user_id").html(result.account)
            $("#rank").html(result.rank)
            $("#aclv").html(result.aclv+"(AC:"+result.ac+"/Sub:"+result.tot+")")
            $("#Class").html(result.class)
        }
    })
}

function search() {
    var id = $("#searchname").val();
    $("#name").html(id)
    $.ajax({
        type: "POST",
        url: "/ranking/getStudent",
        dataType: "json",
        data:{
            "id" : id
        },
        success:function (result){
            $("#user_id").html(result.account)
            $("#rank").html(result.rank)
            $("#aclv").html(result.aclv+"(AC:"+result.ac+"/Sub:"+result.tot+")")
            $("#Class").html(result.class)
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
                return '<a data-toggle=\'modal\' data-target=\'#myModal5\' onclick="showEdit(\''+row.name+'\',\''+row.user_id+'\')">'+row.name+'</a>'
            },
            "targets" :1
        }]
    });
}
