var window_size = getViewportOffset();
var w = window_size.width*0.3864;

var count = 0;
var oPicUL = document.getElementsByClassName('pic-ul')[0];
var oImg = oPicUL.getElementsByTagName('img'),
    oImgLen = oImg.length;
var oCirUL = document.getElementsByClassName('cir-ul')[0];
var oI = oCirUL.getElementsByTagName('i'),
    oILen = oI.length;
var oBtnleft = document.getElementsByClassName('btn-left')[0],
    oBtnright = document.getElementsByClassName('btn-right')[0],
    oBox = document.getElementsByClassName('box')[0];

var oBtn = document.getElementsByClassName('btn');
for(var i=0; i<2; i++)
{
    oBtn[i].style.top = w*0.5+'px';
}
for(var i=0; i<oImgLen; i++)
{
    oImg[i].style.width = window_size.width+'px';
    oImg[i].style.height = w+'px';
}
oBox.style.width = window_size.width+'px';
oPicUL.style.width = oImgLen*window_size.width+'px';
oBox.style.height = (w*0.75)+'px';
oPicUL.style.height = w+'px';

var moveWidth = oPicUL.children[0].offsetWidth;
var boolen = true;
var realPicNum = oPicUL.children.length - 1;
var timer = window.setInterval(autoMove,3000);
oBtnleft.onclick = function () {
    autoMove(-1);
}
oBtnright.onclick = function () {
    autoMove(1);
}
oBox.onmouseover = function () {
    clearInterval(timer);
}
oBox.onmouseout = function () {
    timer = window.setInterval(autoMove,3000)
}
for (var i = 0; i < oILen; i ++) {
    oI[i].onclick = (function (i) {
        return function () {
            count = i;
            changeCir(count);
            move(oPicUL,{left: -moveWidth * i},function () {
                boolen = true;
            });
        }
    })(i)
}
function autoMove(demo){
    if (boolen) {
        boolen = false;
        if (demo == 1 || !demo) {
            count ++;
            if (count == 6) {
                count = 0;
            }
            changeCir(count);
            move(oPicUL,{left: oPicUL.offsetLeft - moveWidth},function () {
                if (count == 0) {
                    oPicUL.style.left = '0px';
                }
                boolen = true;
            });
        }else if (demo == -1) {
            if (oPicUL.offsetLeft == 0) {
                oPicUL.style.left = -moveWidth * realPicNum + 'px';
                count = realPicNum;
            }
            count --;
            changeCir(count);
            move(oPicUL,{left: oPicUL.offsetLeft + moveWidth},function () {
                boolen = true;
            });
        }
    }
}
function changeCir(demo) {
    for (var i = 0; i < oILen; i ++) {
        oI[i].className = '';
    }
    oI[demo].className = 'cir-change';
}




