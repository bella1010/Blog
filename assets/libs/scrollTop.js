/********
 *飘窗控制
 $.jqScrollTop({
	startPos:10, //滚动条滚动多高开始显示
	fixedBottom:false,//是否永远在底部
	show:false //初始化是否显示
	})
 ********/
(function($){
    $.fn.jqScrollTop=function(options){
        options = $.extend({
            startPos:0,
            bottom:150,
            fixedBottom:false,
            fixedRight:true,
            show:false,
            callback:function(){}
        }, options || {});

        var ie6=!-[1,]&&!window.XMLHttpRequest;
        var _this=$(this);
        var _bottom=options.bottom;
        // var _start=_this.parent().offset().top;
        _this.css({"bottom":_bottom,"top":"auto"});
        !options.fixedRight?_this.css({left:'50%','margin-left':$('body .wrap').width()/2+10}):'';
        ie6? _this.css({"top":$(window).height()-_this.height()}):'';
        options.show?_this.show():_this.hide();
        $(window).scroll(function(){
            $(document).scrollTop()>options.startPos?_this.fadeIn(200):_this.fadeOut(200);
            //!options.show&&$(document).scrollTop()<options.startPos?_this.hide():'';
            if(!options.fixedBottom)
            {
                var f=$(document).scrollTop()+$(window).height();
                var footer=$(".footer");
                if(footer[0]){
                    f=f-footer.offset().top;
                }
                if(f>0)
                {
                    _this.css({
                        bottom:function(){
                            _bottom=f+options.bottom;
                            _this.css({bottom:_bottom});
                        }
                    })
                }
                else
                {
                    _this.css({"bottom":options.bottom,"top":"auto"});
                    if(ie6){
                        _this.css({"top":$(document).scrollTop()-_this.height()-options.bottom+$(window).height()});
                    }
                }
            }
            options.callback();
        });

        $(window).resize(function(){
            _this.css({"bottom":_bottom});
        });

/*        _this.find('.gotop_lnk').click(function(){
            $('html,body').animate({scrollTop:0},0);
            _this.css({"bottom":options.bottom});
            return false;
        });*/
        return $(this);
    };

})(jQuery);