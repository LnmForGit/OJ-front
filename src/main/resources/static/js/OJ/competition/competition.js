
$(document).ready(function () {
    getCompList();
    getAComp();
});
function getCompList() {
    $.ajax({
        type:"POST",
        url: "/competition/getComp",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function (result) {

         }
    })
}
function getAComp(){
    $.ajax({
        type:"POST",
        url: "/competition/getAComp",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        success:function (result) {

        }
    })
}