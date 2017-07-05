/**
 * Created by Shawon.Xiao on 14-4-14.
 */
(function ($) {
    $.fn.lazyload = function (options) {
        var settings = {
            threshold: 0,
            effect:'',
            errorimg: ''
        };
        settings = $.extend(settings, options || {});
        var defHeight = settings.threshold;
        var defObj = $(this);
        var pageTop = function () {
            return document.documentElement.clientHeight + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - settings.threshold;
        };
        var imgLoad = function () {
            defObj.each(function () {
                var self = $(this);
                //self.addClass('lazy_loading');
                if (self.offset().top <= pageTop()) {
                    var orgSrc = self.attr("original");
                    if (orgSrc) {
                    	if(typeof ftpHost !="undefined" && orgSrc==ftpHost){
                    		self.addClass('img-onerror');
                    	}else{
	                        if(settings.effect=="fade"){
	                        		 self.hide().attr("src", orgSrc).fadeIn(500);
	                        }else{
	                        	self.attr("src", orgSrc);
	                        }
                    	}
                    }
                    self.error(function () {
                        self.attr('src','/assets/images/blank.gif').addClass('img-onerror');
                        if (settings.errorimg) {
                            self.attr("src", settings.errorimg);
                        }
                    });
                    self.removeAttr("original").removeClass('lazy-loading lazyloadimg');
                }
            });
        };
        imgLoad();
        var timer = null;
        $(window).bind("scroll", function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                imgLoad();
            }, 200)
        });
    }
})(jQuery);