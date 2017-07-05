/**
 * Created by Shawon.Xiao on 14-4-14.
 */
(function () {
    var _skin = "1";
    var _expando = 'icDialog' + +new Date;
    var _count = 0;
    var _isIE6 = window.VBArray && !window.XMLHttpRequest;
    var _zIndex = 500;

    var icDialog = function (config, ok, cancel) {
        var defaults = icDialog.defaults;
        config = config || defaults || {};
        for (var i in defaults) {
            if (config[i] === undefined) config[i] = defaults[i];
        }
        config.id = config.id || _expando + _count;
        _count++;
        return icDialog.list[config.id] = new icDialog.fn.init(config);
    };

    icDialog.fn = icDialog.prototype = {
        init: function (config) {
            if ($(document).find("#" + config.id).length > 0) {
                return;
            }
            var that = this, $wrap;
            var lock, width, height, url, iframed, title, fixed, closable;
            that.wrap = $wrap = $("<div class='ic-dialog'>");
            _skin = config.skin;
            _zIndex += 1;
            that.borderWidth = 0;
            $wrap.html(that._templates).css({zIndex: _zIndex});
            $("body").prepend($wrap);
            $title = $wrap.find(".ui-title");
            $content = $wrap.find(".dg-content");
            $close = $wrap.find(".ui-close");
            $skinWrap = $wrap.children(":first-child");
            that.config = config;
            that.tt = $title;
            that.skinWrap = $skinWrap;
            that.con = $content;
            that.conBgTimer = null;
            that.skin()
                .lock()
                .title(config.title)
                .content(config.content);
            if (config.url) {
                that.loading();
            }
            that.size(parseInt(config.width), parseInt(config.height));
            that.position(config.left, config.top);
            if (config.drag) {
                that.drag();
            }

            $(window).resize(function () {
                that.position(config.left, config.top);
            });
            $(window).scroll(function () {
                that.ie6SelectFix();
            });

            if (config.closable) {
                $wrap.find(".ui-close").bind('click', function () {
                    that.close();
                    if(typeof config.closeCallback=="function"){
                    	config.closeCallback();
                    }
                });
            }

            icDialog.close = function () {
                that.close();
            }
            config.init && config.init.call(that, window);

            return that;
        },
        skin: function () {
            var that = this, config = that.config;
            if (config.id) {
                that.skinWrap.parent().attr("id", config.id);
            }
            that.wrap.addClass("dialog-skin-" + _skin);
            return this;

        },
        loading: function () {
            var that = this, wrap = that.wrap, config = that.config;
            var loadDiv = $("<div>").addClass("dg-loading");
            loadDiv.html('处理中，请稍候...');
            that.loadDiv = loadDiv;
            $("body").append(loadDiv);
            if (_isIE6) {
                loadDiv.css({'top': loadDiv.offset().top + $(window).scrollTop()});
            }
            return that;
        },
        lock: function () {
            var that = this, config = that.config;
            if (!config.lock || $("#dialogMask").length > 0) return that;
            var mask = $("<div>").addClass("dialog-mask");
            if (_isIE6) {
                mask.html('<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>');
            }
            $("body").append(mask);
            that.mask = mask;
			if((/android/gi).test(navigator.appVersion)|| (/iphone|ipad/gi).test(navigator.appVersion)) {
				mask.css("background","rgba(0, 0, 0, 0)");
			}
            mask.height($(document).height());
            $(window).scroll(function () {
                mask.height($(document).height());
            });
            $(window).resize(function () {
                mask.height($(document).height());
            })
            return that;
        },
        // 强制覆盖IE6下拉控件
        ie6SelectFix: function () {
            var that = this, config = that.config;
            if (_isIE6 && !config.iframed) {
                var wrap = that.wrap,
                    expando = _expando + 'iframeMask',
                    w = wrap.width(),
                    h = wrap.height();

                if ($("body").find("iframe").attr("id") == expando) {
                    iframe.width(w);
                    iframe.height(h);
                } else {
                    iframe = $("<iframe>");
                    iframe.attr({"id": expando, "src": "about:blank"});
                    iframe.addClass('hackiframe').css({'position': 'absolute', 'z-index': '-1', 'left': '0', 'top': '0', 'background': '#fff'});
                    iframe.width(w);
                    iframe.height(h);
                    wrap.append(iframe);
                }
                ;
            }
        },
        title: function (text) {
            var that = this, wrap = that.wrap, config = that.config;
            var tt = that.tt;
            if (_skin == "2" && !config.title) {
                tt.remove();
            }
            if (!config.closable) {
                wrap.find(".ui-close").remove();
            }
            if (_skin == "1") {
                // wrap.find(".ui-close").html("关闭");
            }
            if (config.title) {
                tt.html(text || config.title);
            }
            return that;
        },
        iframeLoaded: function () {
            var that = this,
                iframe = that.iframe,
                config = that.config,
                w, h,
                wrap = that.wrap;
            iframe.prev('p').remove();
            try {
                w = iframe.contents().width();
                h = iframe.contents().height();
            } catch (e) {
                w = 582;
                h = 380;
            }
            if (config.width) {
                w = config.width;
            }
            if (config.height) {
                h = config.height;
            }
            iframe.width(parseInt(w)).height(parseInt(h));
            !config.height ? that.size(parseInt(w), parseInt(h)) : '';
            that.position(config.left, config.top);
            wrap.css({"visibility": "visible"});
            that.loadDiv.remove();
            if (typeof(config.loaded) == "function") {
                config.loaded();
            }
            return that;
        },
        content: function (text) {
            var that = this,
                wrap = that.wrap,
                config = that.config,
                con = that.con;

            if (text) {
                con.html(text);
                wrap.css({"visibility": "visible"});
            }

            //ajax load
            if (config.url && !config.iframed) {
                con.css({"visibility": "hidden"});
                $.ajax({
                    url: config.url,
                    success: function (data) {
                        var inner = $('<div class="dg-content-inner"></div>').appendTo(con);
                        inner.html(data);
                        setTimeout(function () {
                            var w = con.width();
                            var h = con.find('.dg-content-inner').height();
                            if (config.width) {
                                w = config.width;
                            }
                            if (config.height) {
                                h = config.height;
                            }

                            that.size(parseInt(w), parseInt(h)).position();
                            con.css({"visibility": "visible"});
                            wrap.css({"visibility": "visible"});
                            that.loadDiv.remove();

                        }, 20);
                        if (typeof(config.loaded) == "function") {
                            config.loaded();
                        }
                    }
                });
            }

            //iframe load
            if (config.url && config.iframed) {
                var iframe = $("<iframe>");
                iframe.attr("src", config.url);
                iframe.attr("id", "dialog-iframe" + _count).attr("frameborder", "0").attr("name", "dialog-iframe" + _count);
                config.scrolling ? iframe.attr("scrolling", "auto") : iframe.attr("scrolling", "no");
                iframe.css({"width": "100%", "height": "100%"});
                if (iframe[0].attachEvent) {
                    iframe[0].attachEvent("onload", function () {
                        that.iframeLoaded();
                    });
                } else {
                    iframe[0].onload = function () {
                        that.iframeLoaded();

                    };
                }
            }
            con.append(iframe);
            that.iframe = iframe;
            that.ie6SelectFix();
            return that;

        },
        close: function () {
            var that = this;
            var wrap = that.wrap, config = that.config;
            var fn = config.close;
            if (typeof fn === 'function')
                config.close();
            wrap.remove();
            if (config.lock) that.unlock();
            if ($.browser.version == "6.0" && $.browser.msie) {
                $("#hackdialog-iframe").remove();
            }
            if (that.iframe) {
                that.iframe.attr('src', 'about:blank');
                that.iframe.remove();
            }
            clearInterval(that.conBgTimer);
           
            return that;
        },
        callback: function () {
        	
            var that = this,
                config = that.config;
            "function" === typeof config.callback ? config.callback.apply() : '';
            return that;
        },
        unlock: function () {
            var that = this;
            that.mask.remove();
            return that;
        },
        size: function (w, h) {
            var that = this,
                con = that.con,
                config = that.config,
                wrap = that.wrap,
                wrapW = wrap.width(),
                minW = config.minWidth,
                minH = config.minHeight,
                bg = wrap.find('.dialog-skin-bg');
            var _w = con.width();
            var _h = con.height();
            var _titH = wrap.find('.dg-title').height();
            if (w) {
                _w = w;
            }
            if (h) {
                _h = h;
            }
            if (_w < minW) {
                _w = minW;
            }
            if (_h < minH - _titH) {
                _h = minH - _titH;
            }
            if (!config.url || w) {
                con.width(_w);
            }
            if (!config.url || h) {
                con.height(_h);
            }
            //chrome iframe hack
            if (config.url && h) {
                con.css({'overflow': 'hidden'});
            }
            var borderW = Math.abs(parseInt(bg.css('top')))*2;
            wrap.width(_w +borderW);
            wrap.height(parseInt(_h - _titH - borderW/2));
            that.skinWrap.width(_w);
            if (that.conBgTimer) {
                clearInterval(that.conBgTimer);
            }
            that.conBgTimer = setInterval(function () {
                bg.width(con.width() + borderW);
                bg.height(con.height() + _titH +borderW);
            }, 50);
            return that;
        },
        position: function (left, top) {
            var that = this,
                wrap = that.wrap,
                config = that.config,
                con = that.con,
                _sw = $(window).width(),
                _sh = $(window).height(),
                _w = con.width(),
                _h = con.height(),
                _titH = wrap.find('.dg-title').height();
            if (config.width) {
                _w = config.width;
            }
            if (config.height) {
                _h = config.height;
            }
            var posL = left || (_sw - _w) / 2;
            var posT = top || (_sh - con.height() - _titH) / 2;
            if (_isIE6 || !config.fixed) {
                posT += $(window).scrollTop();
                wrap.css({position: 'absolute'});
            }
            if((/android/gi).test(navigator.appVersion)||(/iphone|ipad/gi).test(navigator.appVersion)) {
                wrap.css({left: 0, top: 0, 'margin-left': '0', 'margin-top': '0'});
            }else{
                wrap.css({left: posL, top: posT, 'margin-left': '0', 'margin-top': '0'});
            }
            return that;
        },
        drag: function () {
            var that = this,
                wrap = that.wrap,
                drg = wrap.find('.dg-title'),
                bool = false,
                offsetX = 0,
                offsetY = 0;
            drg.bind('mousedown', function (event) {
                bool = true;
                var _this = $(this);
                var ev = window.event || event;
                offsetX = ev.clientX - wrap.offset().left;
                offsetY = ev.clientY - wrap.offset().top;
                _this.addClass('dg_drag_handle');
            });
            drg.bind('mouseup', function () {
                bool = false;
                $(this).removeClass('dg_drag_handle');
            });
            $(document).mousemove(function (event) {
                if (!bool)return;
                var ev = window.event || event;
                var x = ev.clientX - offsetX;
                var y = ev.clientY - offsetY;
                if (!_isIE6) {
                    x = x - $(window).scrollLeft();
                    y = y - $(window).scrollTop();
                }
                var maxY = $(window).height() - wrap.height() - 30;
                var maxX = $(window).width() - wrap.width();
                if (x <= 0 || x >= maxX) {
                    return;
                }
                if (y <= 0 || y >= maxY) {
                    return;
                }
                wrap.css({"left": x});
                wrap.css({"top": y});
            });
        }
    };

    icDialog.fn.init.prototype = icDialog.fn;
    icDialog.list = {};


    /**
     ** 样式类型
     ?skin=1
     **/
    var _thisScript = "";
    (function (script, i, me) {
        for (i in script) {
            if (script[i].src && script[i].src.indexOf('icDialog') !== -1) me = script[i];
        }
        ;
        _thisScript = me || script[script.length - 1];
    }(document.getElementsByTagName('script')));
//_skin = _thisScript.src.split('skin=')[1];
    if (typeof(_skin) == "undefined") _skin = "1";


    /**
     ** 对话框模板
     **/
    icDialog.fn._templates =
        '<div class="dialog-skin">' +
            '<div class="dg-title"><h2 class="ui-title"></h2><a class="ui-close" href="javascript:;"></a></div>' +
            '<div class="dg-content"></div>' +
            '<div class="dialog-skin-bg"></div></div>';


    /**
     ** 默认配置
     **/
    icDialog.defaults = {
        close: null,// 对话框关闭前执行的函数
        loaded: null,//url加载完成回调
        lock: true,	// 是否锁屏
        closable: true, //是否允许关闭
        fixed: true,
        minHeight: 100,
        minWidth: 200,
        skin: 1,
        drag: false,
        callback: null,
        closeCallback:null,
        scrolling: false,
        time: null
    };

    icDialog.close = function () {
    };

    window.icDialog = icDialog;
})();