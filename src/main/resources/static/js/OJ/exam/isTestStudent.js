
//是不是正在进行的考试的学生，是则返回true，否则返回false；
// 如果没有正在进行的考试，返回true

function isTestStudent(){
    var a=false;
    $.ajax({
        type: "POST",
        url: "/exam/getTestIps",
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

function isTestIps(){
    var a=false;
    $.ajax({
        type: "POST",
        url: "/exam/getTestIps",
        async:false,
        dataType: "json",
        success: function (result) {
            var testSid = new Array();
            var testIps = new Array();
            var i = 0;
          // alert("length:" + result.length)
            $.each(result,function(index,value){
                testIps[i++] = value.first_ip;
                testSid[i] = value.sid;
                console.log(value.first_ip)
                console.log(value.sid)
            })
            var userSid = testSid[testSid.length - 1];
            var userIp = testIps[testIps.length - 1];
            testIps = testIps.slice(0,testIps.length - 1);
            testSid = testSid.slice(0,testSid.length - 1);
            var ipIndex = testIps.indexOf((userIp))
            console.log(ipIndex)
            console.log("userID:" + userSid)
            console.log("userIP:" + userIp)
            //console.log(testSid[ipIndex] == userSid)
            a=((testIps.length == 0 || ipIndex == -1) ? true : (testSid[ipIndex] == userSid));
        }
    })
    console.log(a)
    return a;
}


function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs

    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //sten for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}