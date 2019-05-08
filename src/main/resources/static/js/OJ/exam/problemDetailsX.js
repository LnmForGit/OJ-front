
$(function(){

    testFun();

})


function testFun(){

    var result = {
        'proName':"周游加拿大",
        'proId':"849",
        'problemDescription':"你赢得了一场航空公司举办的比赛，奖品是一张加拿大环游机票。旅行在这家航空公司开放的最西边的城市开始，然后一直自西向东旅行，直到你到达最东边的城市，再由东向西返回，直到你回到开始的城市。每个城市只能访问一次，除了旅行开始的城市之外，这个城市必定要被访问两次（在旅行的开始和结束）。你不允许使用其他公司的航线或者用其他的交通工具。 给出这个航空公司开放的城市的列表，和两两城市之间的直达航线列表。找出能够访问尽可能多的城市的路线，这条路线必须满足上述条件，也就是从列表中的第一个城市开始旅行，访问到列表中最后一个城市之后再返回第一个城市。",
        'inputDescription':"Line 1: 航空公司开放的城市数 N 和将要列出的直达航线的数量 V。N 是一个不大于 100 的正整数。V 是任意的正整数。 Lines 2..N+1: 每行包括一个航空公司开放的城市名称。城市名称按照自西向东排列。不会出现两个城市在同一条经线上的情况。每个城市的名称都是一个字符串，最多15字节，由拉丁字母表上的字母组成；城市名称中没有空格。 Lines N+2..N+2+V-1: 每行包括两个城市名称（由上面列表中的城市名称组成），用一个空格分开。这样就表示两个城市之间的直达双程航线。",
        'outputDescription':"Line 1: 按照最佳路线访问的不同城市的数量 M。如果无法找到路线，输出 1。",
        'inputSample':"8 9\t\n" +
            "Vancouver\t\t\n" +
            "Yellowknife\t\n" +
            "Edmonton\n" +
            "Calgary\n" +
            "Winnipeg\n" +
            "Toronto\t\n" +
            "Montreal\n" +
            "Halifax\t\n" +
            "Vancouver Edmonton\n" +
            "Vancouver Calgary\t\n" +
            "Calgary Winnipeg\n" +
            "Winnipeg Toronto\n" +
            "Toronto Halifax\n" +
            "Montreal Halifax\n" +
            "Edmonton Montreal\n" +
            "Edmonton Yellowknife\n" +
            "Edmonton Calgary",
        'outputSample':"7\n" +
            "也就是: Vancouver, Edmonton, Montreal, Halifax, Toronto, Winnipeg, Calgary, 和 Vancouver （回到开始城市，但是不算在不同城市之内）。 "
    }
    result['testPro']='testMessage';
    loadProblemData(result);
}
function loadProblemData(t){
    console.log(t)
    $('#problemName').text(t.proName);
    $('#problemId').text(t.proId);
    $('#problemDescription').text(t.problemDescription);
    $('#inputDescription').text(t.inputDescription);
    $('#outputDescription').text(t.outputDescription);
    $('#inputSample').text(t.inputSample);
    $('#outputSample').text(t.outputSample);

    var textarea=document.getElementById('inputDescription');
    textarea.style.height = textarea.scrollHeight + 10+  'px';
    textarea=document.getElementById('outputDescription');
    textarea.style.height = textarea.scrollHeight + 10+ 'px';
    textarea=document.getElementById('inputSample');
    textarea.style.height = textarea.scrollHeight + 10+  'px';
    textarea=document.getElementById('outputSample');
    textarea.style.height = textarea.scrollHeight + 10+  'px';
}
