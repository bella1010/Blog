/**
 * 添加产品下拉自动完成
 * type:'cn'||'hk'||'1'
 * Created by Shawon.Xiao on 14-6-13.
 */

(function ($) {
    //var _isIE6 = window.VBArray && !window.XMLHttpRequest;
    css = ' .drop-down-box{background:#fff;position:absolute;left:0;top:35px;border:1px solid #d4d4d4;width:460px;display:none;}.drop-down-box .inner{margin:10px;}.drop-pro-list li{padding:5px 0;}.drop-pro-list li span{display:inline-block;margin-left:5px;vertical-align:middle;}.drop-down-box .col-1{width:150px;}.drop-down-box li em{color:#ff0000;}.drop-down-box .col-2{width:180px;}.drop-down-box .col-3{width:170px;}.drop-down-box .col-4{width:70px;}.drop-down-box .col-5{width:70px;}.drop-down-box .col-6{width:70px;}.drop-down-box .hd{height:30px;background:#f1efef;line-height:30px;}.drop-down-box .hd span{float:left;margin-left:5px;}.drop-pro-list li.even{background:#f6f6f6;}.drop-pro-list li.hover{background:#d0e3fa;}';
    addCss(css);

    $('body').click(function (e) {
    	if($('.jsTitle').size()<=0){
    		$('#dropDownBox').hide();
    	}
        
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
        var opts = $.data(target, 'proAutoComplete').options;
        var el = $(target);
        var _boxH = opts.height;
        var deliveryPlace=opts.type || "";
        var ths='<span class="col-2">制造商型号</span><span class="col-3">品牌</span>';
        
        if(opts.showWareName){
        	ths+='<span class="col-6">仓库</span> ';
        }
        
        if(opts.showSku){
            ths+='<span class="col-4">库存</span> ';
        }

        if(opts.showPlace){
            ths += '<span class="col-5">交货地</span>';
        }
        
        var _dropBox = $('#dropDownBox');
        var _ul = _dropBox.find('ul');
        if (!_dropBox[0]) {
            if (_boxH && !isNaN(_boxH)) {
                addCss('.drop-down-box{height:' + _boxH + 'px;overflow:auto;}');
            }
            _dropBox = $('<div id="dropDownBox" class="drop-down-box"><div class="inner"><div class="hd clearfix">' + ths + '</div></div></div>');
            _ul = $('<ul class="drop-pro-list"><img class="mt10" src="/assets/images/loading-yellow-16.gif" width="16" height="16"/></ul>');
            _ul.appendTo($('.inner', _dropBox));

            var isPage = opts.isPage;
            if (isPage == true) {
            	var _page=$('<div id="paginProAuto" class="page fr mt20"><a id="p1" class="prev dis" href="javascript:;"><i></i></a><a id="p2" class="next" href="javascript:;"><i></i></a></div>');
            	_page.appendTo($('.inner', _dropBox));
            }
            
            
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
        
        function productslice(products){
            var html = [];
          $.each(products, function (n, v) {
          	
          	 
              var _cls = '';
              var 
              	_sku=v.sku || '',
              	_icNo=v.icNo || '',
              	_wareName=v.wareName || '',
              	_partNo=v.partNo || '',
              	_brand=v.brand || '',
              	_productId=v.productId || '',
              	_brandId=v.brandId || '',
              	_brandType=v.brandType || '',
              	_thirdCategoryId=v.thirdCategoryId || '',
              	_unpacking=v.unpacking || '',
              	_moq=v.moq || '',
              	_mpq=v.mpq || '',
              	_deliveryPlace=v.deliveryPlace ||'';
              var _data='{"sku":"'+_sku+'","icNo":"'+_icNo+'","partNo":"'+_partNo+'","brand":"'+_brand+'","productId":"'+_productId+'","brandId":"'+_brandId+'","brandType":"'+_brandType+'","moq":"'+_moq+'","mpq":"'+_mpq+'","thirdCategoryId":"'+_thirdCategoryId+'"}';
              
              if ((n + 1) % 2 == 0) {
                  _cls = "even";
              }
              var cols='<span class="col-2">' + _partNo + '</span><span class="col-3">' + _brand + '</span>';
              
              if (opts.showWareName) {
              	cols += '<span class="col-6">' + _wareName + '</span>';
              }
              if (opts.showSku) {
              	var _stock = v.stock;
              	var _stockText='';
              	if(_stock>0){
              		_stockText='现货';
              	}else{
              		_stockText='订货';
              	}
                  cols += '<span class="col-4">' + _stockText + '</span>';
              }
              if (opts.showPlace) {
                  var place = _deliveryPlace == "CN" ? "境内" : "境外";
                  cols += '<span class="col-5">' + place + '</span>';
              }
              
              html.push('<li  data-index=\'' + n + '\' data-value=\''+_data+'\' unpacking=\''+_unpacking+'\' mpq=\''+_mpq+'\' data-id=\''+_sku+'\' data-place=\''+_deliveryPlace+'\' class=\'' + _cls + '\'>'+cols+'</li>');
          });
          
          
          _ul.empty().append(html.join(''));

          $('.col-1',_ul).each(function(){
              var str=$(this).html();
              var regexp = new RegExp("("+el.val()+")", "gi");
              $(this).html( str.replace(regexp,"<em>$1</em>"));
          });
          
          $('.col-2',_ul).each(function(){
              var str=$(this).html();
              var regexp = new RegExp("("+el.val()+")", "gi");
              $(this).html( str.replace(regexp,"<em>$1</em>"));
          });
          
          $('.col-3', _ul).each(function () {
              var str = $(this).html();
              var regexp = new RegExp("(" + el.val()+ ")", "gi");
              $(this).html(str.replace(regexp, "<em>$1</em>"));
          });

          $('li', _ul).hover(function () {
              $(this).addClass('hover');
          }, function () {
              $(this).removeClass('hover');
          });
          
          $('li', _ul).click(function () {
          	var _this = $(this);
              var _val = $.trim(_this.find('.col-2').text());
              el.val(_val);
              el.attr('data-id',_this.attr('data-id'));
              el.attr('data-place',_this.attr('data-place'));
              
              var numberText=el.next().find('.jsUpdateCartNumber');
              
              var mpq=_this.attr('mpq');
              if(_this.attr('unpacking')==0 && checkNull(mpq) && mpq>0){//0：不支持拆包
              	el.next().find('b').text(mpq);
              	el.next().find('em').show();
              	numberText.width(50);
              }else{
              	el.next().find('b').text('1');
              	el.next().find('em').hide();
              	numberText.width(85);
              }
              var returnData=$.parseJSON(_this.attr('data-value'));
              if (typeof opts.callback == "function") {
                  opts.callback(returnData,el);
              }
              numberText.focus();
              _dropBox.hide();
          });
          
          _dropBox.bind('mouseleave',function(){
          	if($('.jsTitle').size()<=0){
          		$(this).hide();
          	}
          });
    		
    	};
        function keyupEvent(){
        	
        	//清空原来搜索的数据
        	_ul.empty().append('<img class="mt10" src="/assets/images/loading-yellow-16.gif" width="16" height="16"/>');
        	
        	var offset = el.offset();
            var _left = opts.left || offset.left;
            var _top = opts.top || offset.top + el.outerHeight();
            var _winW = $(window).width();
            var _dW = _dropBox.width();

            if ((_left + _dW) > _winW) {
                _left -= _dW - el.width() - 10;
            }

            _dropBox.css({left: _left, top: _top}).show();
            
            if(opts.showSku){
                _dropBox.width(540);
            }
            if(opts.showPlace){
                _dropBox.width(630);
            }
            
            el.removeClass('error').removeAttr('data-id');
            $('#dropDownBox').find('.drop-pro-list').html('<img class="mt10" src="/assets/images/loading-yellow-16.gif" width="16" height="16"/>');
            $.ajax({
                url: opts.href,
                type: 'post',
                data:{"keyword":el.val(),"deliveryPlace":deliveryPlace},
                dataType:'json',
                success: function (data) {
                	// 获取商品信息
                	//获取商品信息失败
                	if (data.responseCode == 0){
                		$('#dropDownBox').find('.drop-pro-list').html('<p class="pt10 cgray">'+data.responseMsg+'</p>');
                		$('.next').addClass('dis');
                		return;
                	}
                	//获取商品信息成功
                	if (data.responseCode == 1){
                		products=data.returnMsgList;
                	}
                	productslice(products.slice(0,10));
                	if (opts.isPage == true) {
                		totalcount = products.length;
	                	pageindexcount=0;
	                	$('.next').removeClass('dis');
	                	$('.prev').addClass('dis');
	                	if(totalcount<=10){
	            			productslice(products);
	            			$('.next').addClass('dis');
	            		}
	                	
	                    	$('.next').off("click").click(function(){
	                    		if($(this).hasClass("dis")){
	                    			return;
	                    		}else{
	                    			_ul.empty(); 
	                        			pageindexcount = pageindexcount+10;
	                        			if(pageindexcount+10>totalcount){//最后一页
	                        				productslice(products.slice(pageindexcount,totalcount));
	                        				$('.next').addClass('dis'); 
	                        			}else{//中间页
	                            			productslice(products.slice(pageindexcount,pageindexcount+10));
	                            			$('.prev').removeClass('dis');
	                        			}
	                        		}
	                		});
	                    	
	                    	$('.prev').off("click").click(function(){
	                    		if($(this).hasClass("dis")){
	                    			return;
	                    		}else{
		                    		_ul.empty(); 
		                    			pageindexcount = pageindexcount-10;
		                    			if(pageindexcount<=0){
		                    				productslice(products.slice(pageindexcount,pageindexcount+10));
		                    				$('.prev').addClass('dis');
		                    			}else{
		                    				productslice(products.slice(pageindexcount,pageindexcount+10));
		                    				$('.next').removeClass('dis');
		                    			}
		                    		}
	                		}); 
                    	
                	} 
//                    var html = [];
//                    $.each(products, function (n, v) {
//                    	
//                    	 
//                        var _cls = '';
//                        var 
//                        	_sku=v.sku || '',
//                        	_icNo=v.icNo || '',
//                        	_wareName=v.wareName || '',
//                        	_partNo=v.partNo || '',
//                        	_brand=v.brand || '',
//                        	_productId=v.productId || '',
//                        	_brandId=v.brandId || '',
//                        	_brandType=v.brandType || '',
//                        	_thirdCategoryId=v.thirdCategoryId || '',
//                        	_unpacking=v.unpacking || '',
//                        	_moq=v.moq || '',
//                        	_mpq=v.mpq || '',
//                        	_deliveryPlace=v.deliveryPlace ||'';
//                        var _data='{"sku":"'+_sku+'","icNo":"'+_icNo+'","partNo":"'+_partNo+'","brand":"'+_brand+'","productId":"'+_productId+'","brandId":"'+_brandId+'","brandType":"'+_brandType+'","moq":"'+_moq+'","mpq":"'+_mpq+'","thirdCategoryId":"'+_thirdCategoryId+'"}';
//                        
//                        if ((n + 1) % 2 == 0) {
//                            _cls = "even";
//                        }
//                        var cols='<span class="col-2">' + _partNo + '</span><span class="col-3">' + _brand + '</span>';
//                        
//                        if (opts.showWareName) {
//                        	cols += '<span class="col-6">' + _wareName + '</span>';
//                        }
//                        if (opts.showSku) {
//                        	var _stock = v.stock;
//                        	var _stockText='';
//                        	if(_stock>0){
//                        		_stockText='现货';
//                        	}else{
//                        		_stockText='订货';
//                        	}
//                            cols += '<span class="col-4">' + _stockText + '</span>';
//                        }
//                        if (opts.showPlace) {
//                            var place = _deliveryPlace == "CN" ? "境内" : "境外";
//                            cols += '<span class="col-5">' + place + '</span>';
//                        }
//                        
//                        html.push('<li  data-index=\'' + n + '\' data-value=\''+_data+'\' unpacking=\''+_unpacking+'\' mpq=\''+_mpq+'\' data-id=\''+_sku+'\' data-place=\''+_deliveryPlace+'\' class=\'' + _cls + '\'>'+cols+'</li>');
//                    });
//                    
//                    
//                    _ul.empty().append(html.join(''));
//
//                    $('.col-1',_ul).each(function(){
//                        var str=$(this).html();
//                        var regexp = new RegExp("("+el.val()+")", "gi");
//                        $(this).html( str.replace(regexp,"<em>$1</em>"));
//                    });
//                    
//                    $('.col-2',_ul).each(function(){
//                        var str=$(this).html();
//                        var regexp = new RegExp("("+el.val()+")", "gi");
//                        $(this).html( str.replace(regexp,"<em>$1</em>"));
//                    });
//                    
//                    $('.col-3', _ul).each(function () {
//                        var str = $(this).html();
//                        var regexp = new RegExp("(" + el.val()+ ")", "gi");
//                        $(this).html(str.replace(regexp, "<em>$1</em>"));
//                    });
//
//                    $('li', _ul).hover(function () {
//                        $(this).addClass('hover');
//                    }, function () {
//                        $(this).removeClass('hover');
//                    });
//                    
//                    $('li', _ul).click(function () {
//                    	var _this = $(this);
//                        var _val = $.trim(_this.find('.col-2').text());
//                        el.val(_val);
//                        el.attr('data-id',_this.attr('data-id'));
//                        el.attr('data-place',_this.attr('data-place'));
//                        
//                        var numberText=el.next().find('.jsUpdateCartNumber');
//                        
//                        var mpq=_this.attr('mpq');
//                        if(_this.attr('unpacking')==0 && checkNull(mpq) && mpq>0){//0：不支持拆包
//                        	el.next().find('b').text(mpq);
//                        	el.next().find('em').show();
//                        	numberText.width(50);
//                        }else{
//                        	el.next().find('b').text('1');
//                        	el.next().find('em').hide();
//                        	numberText.width(85);
//                        }
//                        var returnData=$.parseJSON(_this.attr('data-value'));
//                        if (typeof opts.callback == "function") {
//                            opts.callback(returnData,el);
//                        }
//                        numberText.focus();
//                        _dropBox.hide();
//                    });
//                    
//                    _dropBox.bind('mouseleave',function(){
//                    	if($('.jsTitle').size()<=0){
//                    		$(this).hide();
//                    	}
//                    });

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


    $.fn.proAutoComplete = function (options, param) {
        if (typeof options === 'string') {
            return $.fn.proAutoComplete.methods[options](this, param);
        }
        
        options = options || {};

        return this.each(function () {
            var _this = this;
            var state = $.data(_this, "proAutoComplete");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(_this, "proAutoComplete", {
                    options: $.extend({},
                        $.fn.proAutoComplete.defaults, options)
                });

            }
            init(_this);
        });
    };

    $.fn.proAutoComplete.methods = {

    };

    $.fn.proAutoComplete.defaults = {
        height:null,
        left:null,
        top:null,
        showSku:true,
        showPlace:false,
        showWareName:false,
        isPage:false,
        pageSize:10,
        href:basePath + '/buycart/my/getProducts.jhtml',
        callback: null
    };
})(jQuery);