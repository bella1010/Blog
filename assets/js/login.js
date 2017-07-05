/**
 * Created by bella.chen on 16-9-8.
 */
$(function() {
    if (document.addEventListener) {
        //如果是Firefox
        document.addEventListener("keypress", enterEvent, true);
    } else {
        //如果是IE
        document.attachEvent("onkeypress", enterEvent);
    }

    // Enter键触发“登录”登记事件
    function enterEvent(evt) {
        if (evt.keyCode == 13) {
            $('#loginSubmit').click();
        }
    }

    // “登录”点击事件
    $('#loginSubmit').click(function() {
        // 用户名
        var username = $("#username").val();
        if (common.utils.isEmpty(username)) {
            errorMsg("用户名不能为空！");
            return ;
        }

        if (username.length < 4) {
            errorMsg("用户名必须为四位以上！");
        }

        // 密码
        var password = $("#password").val();
        if (common.utils.isEmpty(password)) {
            errorMsg("密码不能为空！");
            return ;
        }

        if (password.length < 4) {
            errorMsg("密码必须大于四位以上！");
        }

        //验证码
        var jsverifyCode = $("#jsverifyCode").val();
        if (common.utils.isEmpty(jsverifyCode)) {
            errorMsg("验证码不能为空！");
            return ;
        }

        // 清除登录错误信息
        errorMsg("");

        // 登录
        $("#myForm").submit();
    });

    function errorMsg(msg) {
        $("#loginMsg").text(msg);
    }

    /*function changeVerifyCode(){
     $('#verifyCodeImg').attr("src",basePath + '/verifyCode.do?t='+Math.random());
     }*/

    $("#verifyCodeImg").click(function(){
        var src = $(this).attr("src");
        if(src.indexOf("?t=")>0) {
            src = src.substring(0,src.indexOf("=")+1);
            src = src + Math.random();
        } else {
            src = src + "?t=" + Math.random();
        }
        $(this).attr("src",src);
    });


    //changeVerifyCode();


    //$(".di-register-body li").chick(function(){
    //    $(this).addClass("actived").siblings("li").removeClass("actived");
    //});

    $(".di-register-body input").focus(function(){
        $(this).parent().parent().addClass("actived").siblings("li").removeClass("actived");
    });

});



