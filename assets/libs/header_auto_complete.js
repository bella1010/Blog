/**
 * 添加产品下拉自动完成
 * type:'cn'||'hk'||'1'
 * Created by Shawon.Xiao on 14-6-13.
 */

(function ($) {
    //var _isIE6 = window.VBArray && !window.XMLHttpRequest;
    css = ' .header-drop-down-box{background:#fff;position:absolute;left:0;top:35px;border:1px solid #d4d4d4;width:407px;display:none;}.header-drop-down-box .inner{margin:0; }.header-drop-pro-list li{padding:5px 0 5px 5px; cursor:pointer;}.header-drop-pro-list li span{display:inline-block;margin-left:5px;vertical-align:middle;}.header-drop-down-box .col-1{width:150px;}.header-drop-down-box li em{color:#ff0000;}.header-drop-down-box .col-2{width:200px;}.header-drop-down-box .col-3{width:200px;}.header-drop-down-box .col-4{width:80px;}.header-drop-down-box .col-5{width:80px;}.header-drop-down-box .hd{height:30px;background:#f1efef;line-height:30px;}.header-drop-down-box .hd span{float:left;margin-left:5px;}.header-drop-pro-list li.even{background:#f6f6f6;}.header-drop-pro-list li.hover{background:#d0e3fa;}.auto-last-more{cursor:pointer; text-align:center;background:#f6f6f6; }.auto-last-more:hover{color:#f70}';
    addCss(css);

    $('body').click(function (e) {
        $('#headerDropDownBox').hide();
    });
    
    $('#jsMorePros').live('click', function(){
    	$("#jsSearchButton").trigger('click');
    });
    
    function addCss(context, target) {
        return $("<style>" + context + "</style>").attr("type", "text/css").appendTo(target ? target : "head");
    };

    //判断空值
    function checkNull(str){
    	if(undefined != str && null!=str && ''!=str && 'null'!=str){
    		return true;
    	}else{
    		return false;
    	}
    };
    
    function init(target) {
        var opts = $.data(target, 'headerAutoComplete').options;
        var el = $(target);
        var _boxH = opts.height;
        var deliveryPlace=opts.type || "";
        
        if(opts.href.indexOf('datatype=0') == -1){
        	return;
        }
        var _dropBox = $('#headerDropDownBox');
        var _ul = _dropBox.find('ul');
        if (!_dropBox[0]) {
            if (_boxH && !isNaN(_boxH)) {
                addCss('.header-drop-down-box{height:' + _boxH + 'px;overflow:auto;}');
            }
            _dropBox = $('<div id="headerDropDownBox" class="header-drop-down-box"><div class="inner"></div></div>');
            _ul = $('<ul class="header-drop-pro-list"></ul>');
            _ul.appendTo($('.inner', _dropBox));
            _dropBox.css({zIndex:500}).appendTo('body');
        }
        
        //判断空值
        function checkNull(str){
        	if(undefined != str && 'undefined' != str && null!=str && ''!=str && 'null'!=str){
        		return true;
        	}else{
        		return false;
        	}
        };
        
        function keyupEvent(){
        	if(el.val()=="" || el.val().length <=1){
        		return;
        	}
        	//清空原来搜索的数据
        	_ul.empty().append('');
        	
        	var offset = el.offset();
            var _left = opts.left || offset.left;
            var _top = opts.top || offset.top + el.outerHeight();
            var _winW = $(window).width();
            var _dW = _dropBox.width();

            if ((_left + _dW) > _winW) {
                _left -= _dW - el.width() - 10;
            }

            _dropBox.css({left: (_left-2), top: (_top+2)}).show();
            
            if(opts.showSku){
                _dropBox.width(540);
            }
            if(opts.showPlace){
                _dropBox.width(630);
            }
            
            el.removeClass('error').removeAttr('data-id');
            $('#headerDropDownBox').find('.header-drop-pro-list').html('');
            $.ajax({
                url: opts.href,
                type: 'POST',
                data:{"keyword":el.val(),"deliveryPlace":deliveryPlace},
                dataType:'json',
                async:true,
                success: function (data) {
                	// 获取商品信息
                	//获取商品信息失败
                	if (data.responseCode == 0){
                		$('#headerDropDownBox').find('.header-drop-pro-list').html('<p class="cgray pl5 mg5">'+data.responseMsg+'</p>');
                		return;
                	}
                	//获取商品信息成功
                	if (data.responseCode == 1){
                		products=data.returnMsgList;
                	}
                    var html = [];
                    $.each(products, function (n, v) {
                        var _cls = '';
                        var _icNo=v.icNo || '',
                    	_partNo=v.partNo || '',
                    	_brand=v.brand || '';
                        
                        var cols='<span class="col-2">' + _partNo + '</span>';
                        if ((n + 1) % 2 == 1) {
                            _cls = "even";
                        }
                        
                        html.push('<li  class=\'' + _cls + '\'>'+cols+'</li>');
                    });
                    if(data.returnMsgList.length==10){
                        html.push('<li data-value=\''+1+'\' id="jsMorePros" class="auto-last-more" >查看更多</li>');
                    }

                    _ul.empty().append(html.join(''));

                    $('li', _ul).hover(function () {
                        $(this).addClass('hover');
                    }, function () {
                        $(this).removeClass('hover');
                    });
                    
                    $('.col-2',_ul).each(function(){
                        var str=$(this).html();
                        var regexp = new RegExp("("+el.val()+")", "gi");
                        $(this).html( str.replace(regexp,"<em>$1</em>"));
                    });
                    
                    $('li', _ul).click(function () {
                    	var _this = $(this);
                        var _val = $.trim(_this.find('.col-2').text());
                        if(!_val == ''){
                        	el.val(_val);
                            $("#jsSearchButton").trigger('click');
                        }
                        _dropBox.hide();
                    });
                    
                    _dropBox.bind('mouseleave',function(){
                    	$(this).hide();
                    });
                }
            });
        }
        
        var _timer=null;
        el.keyup(function () {
        	clearTimeout(_timer);
            _timer=setTimeout(function(){
            	keyupEvent();
            },500);
        });
        return "true";
    }


    $.fn.headerAutoComplete = function (options, param) {
        if (typeof options === 'string') {
            return $.fn.headerAutoComplete.methods[options](this, param);
        }
        options = options || {};

        return this.each(function () {
            var _this = this;
            var state = $.data(_this, "headerAutoComplete");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(_this, "headerAutoComplete", {
                    options: $.extend({},
                        $.fn.headerAutoComplete.defaults, options)
                });

            }
            init(_this);
        });
    };

    $.fn.headerAutoComplete.methods = {

    };

    $.fn.headerAutoComplete.defaults = {
        height:null,
        left:null,
        top:null,
        showSku:true,
        showPlace:false,
        href:basePath + '/buycart/my/getProducts.jhtml',
        callback: null
    };
})(jQuery);