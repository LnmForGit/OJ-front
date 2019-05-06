$(document).ready(function ()
{
    showFile();
});
function resetForm() {
    $(".form-horizontal input").val("");
    $(".form-horizontal select").val("");
    showFile();
}
function showFile()
{
    $.ajax({
        type:'POST',
        url:'/resource/getFileListByFlag',
        contentType: "application/json;charset=UTF-8",
        data:JSON.stringify({
            "flag": $("#fileFlag").val(),
            "name" : $('#fileName').val(),
            "uploader_id" : $('#fileUploader').val(),
        }),

        success:function(result)
        {
            for(var i = 0; i < result.length; i++)
            {
                var date = new Date(result[i].upload_time*1000);
                result[i].upload_time = date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' + date.getDate();
                var fileSize = getSize(result[i].size);
                result[i].size = fileSize;
                if(result[i].flag==0)result[i].flag = "教师文件";
                else result[i].flag = "公共文件";
            }
            var dataTable = $('#fileInfoTable');
            if ($.fn.dataTable.isDataTable(dataTable)) {
                dataTable.DataTable().destroy();
            }

            dataTable.DataTable({
                "serverSide": false,
                "autoWidth" : false,
                "bSort": false,
                "data" : result,
                "columns" : [{
                    "data" : "id"
                },{
                    "data" : "name"
                },{
                    "data" : "uploader_name"
                },{
                    "data" : "upload_time"
                },{
                    "data" : "size"
                },{
                    "data" : "flag"
                }],
                "columnDefs": [{
                    "render" : function(data, type, row) {
                        var a = "";
                        a += "<button type='button' class='btn btn-primary' onclick='downloadFile(\""+row.id+"\")' data-toggle='modal' title='下载' data-toggle='dropdown' style='margin-right:15px; margin-bottom: -1px;'><i class='fa fa-list'></i>&nbsp;下载</button>"
                        return a;
                    },
                    "targets" :6
                }]
            });

        }
    })
}

function downloadFile(id)
{
    window.location.href="/resource/downloadFile?id="+id;
}
function getSize(size) {
    var fileSize = '0KB';
    if (size > 1024 * 1024) {
        fileSize = (Math.round(size / (1024 * 1024))).toString() + 'MB';
    } else {
        fileSize = (Math.round(size / 1024)).toString() + 'KB';
    }
    return fileSize;
}