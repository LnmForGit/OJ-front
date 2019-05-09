
//是不是正在进行的考试的学生，是则返回true，否则返回false；
// 如果没有正在进行的考试，返回true

function isTestClass(){
    var a=false;
    //alert("hhhhh")
    $.ajax({
        type: "POST",
        url: "/exam/getTestClass",
        async:false,
        dataType: "json",
        // data:JSON.stringify({
        //     "username" : $("#username").val(),
        //     "passwords" : $("#passwords").val(),
        // }),
        success: function (result) {
            var testClass = new Array();
            var i = 0;
            $.each(result,function(index,value){
                testClass[i++] = value.class_id;
                console.log(value.class_id)
            })
            var userClass = testClass[testClass.length - 1];
            testClass = testClass.slice(0,testClass.length - 1);
            a=(testClass.length == 0 ? true : testClass.indexOf(parseInt(userClass)) != -1);
        }
    })
    if(!a)
        hint()
    return a;
}

function hint(){
    swal({
        title: "非考试成员不能登陆",
        text: "现在有一场正在进行的考试，非该场考试的考生不能登陆。"
    });
}