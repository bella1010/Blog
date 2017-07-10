
(function ($) {
    $.fn.timebutton = function () {
        function getTime(target, callback) {
            var _timerSpan = $(target);
            var _time = 60;
            var timmer = setInterval(function () {
                _time -= 1;
                _timerSpan.val(_time + "秒");
                if (_time <= 0) {
                    clearInterval(timmer);
                    typeof callback === "function" ? callback.apply() : "";
                }
            }, 1000);
        };
        //获取动态码
        $(".jscodebtn ").attr("disabled","true");
        $("#Code").bind('input propertychange', function() {

            if($("#Code").val().length == 0){
                $(".jscodebtn ").removeClass("btnblue").attr("disabled","true");
            }else{
                $(".jscodebtn ").addClass("btnblue").removeAttr("disabled");
            }
        });

        $('.jscodebtn').click( function () {
            var _this = $('.jscodebtn');
            _this.addClass("dis").removeClass("btnblue").attr("disabled","true");
            $('.jsmessageifo').hide();

            if (!_this.hasClass("dis")) {
                return ;
            }


            getTime(_this, function() {
                $(".jstel").html ="";
                var tel = $('.jsBuyNumber').val();
                var mtel = tel.substr(0, 3) + '****' + tel.substr(7);
                _this.removeClass("dis").addClass("btnblue").removeAttr("disabled");

                _this.val("重新获取验证码");
                $('.jsmessageifo').show();

                $(".jstel").html(mtel)
            });
        });
    };
})(jQuery);