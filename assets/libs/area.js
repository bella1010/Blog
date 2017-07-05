/**
 * Created by Shawon.Xiao on 14-4-21.
 */
(function ($) {

    var _isIE6 = window.VBArray && !window.XMLHttpRequest;
    var opts, defaultCss;
    var pStr, cStr, aStr,address=[];
    var zIndex = 100;
    var oneCss=true;




    $('body').click(function (e) {

        if ($(e.target).hasClass('drop-area-box')) {
            return;
        }

        $('.drop-area-box,.jsAreaBox').hide();
    });

    function addCss(context, target) {
        return $("<style>" + context + "</style>").attr("type", "text/css").appendTo(target ? target : "head");
    }

    function HashMap() {
        /** Map大小* */
        var size = 0;
        /** 对象* */
        var entry = new Object();
        /** Map的存put方法* */
        this.put = function (key, value) {
            if (!this.containsKey(key)) {
                size++;
                entry[key] = value;
            }
        }
        /** Map取get方法* */
        this.get = function (key) {
            return this.containsKey(key) ? entry[key] : null;
        }
        /** Map删除remove方法* */
        this.remove = function (key) {
            if (this.containsKey(key) && (delete entry[key])) {
                size--;
            }
        }
        /** 是否包含Key* */
        this.containsKey = function (key) {
            return (key in entry);
        }
        /** 是否包含Value* */
        this.containsValue = function (value) {
            for (var prop in entry) {
                if (entry[prop] == value) {
                    return true;
                }
            }
            return false;
        }
        /** 所有的Value* */
        this.values = function () {
            var values = new Array();
            for (var prop in entry) {
                values.push(entry[prop]);
            }
            return values;
        }
        /** 所有的 Key* */
        this.keys = function () {
            var keys = new Array();
            for (var prop in entry) {
                keys.push(prop);
            }
            return keys;
        }
        /** Map size* */
        this.size = function () {
            return size;
        }
        /** 清空Map* */
        this.clear = function () {
            size = 0;
            entry = new Object();
        }
    }


    function joinOptions(target, data, type) {

        var opts = $.data(target, 'jqArea').options;
        var _str = "";
        if (type == "province") {
            _str = opts.defaultText.province;
        } else if (type == "city") {
            _str = opts.defaultText.city;
        } else if (type = "area") {
            _str = opts.defaultText.area;
        }

        var options = [];
        if (opts.plain) {
            options.push('<option value="">' + _str + '</option>');
        }

        $.each(data, function (n, v) {
            if (!opts.plain) {
                options.push('<li><a title="' + v.name + '" href="javascript:;" data-value="' + v.code + '">' + v.name + '</a></li>');
            } else {
                options.push('<option value="' + v.code + '">' + v.name + '</option> ');
            }
        });

        return options.join('');
    }


    function getNameByValue(data, val) {
        var name = '';
        $.each(data, function (n, v) {
            if (v.code == val) {
                name = v.name;
                return false;
            }
        });

        return name;

    }

    function getValue(jq) {
        var opts = $.data(jq, 'jqArea').options;
        var data = {};
        var _p = $(jq).find('.sel-province').val();
        var _c = $(jq).find('.sel-city').val();
        var _a = $(jq).find('.sel-area').val();
        if (!opts.plain) {
            _p = $(jq).find('.sel-province').find('.dropdown-option span').attr('data-value');
            _c = $(jq).find('.sel-city').find('.dropdown-option span').attr('data-value');
            _a = $(jq).find('.sel-area').find('.dropdown-option span').attr('data-value');
        }
        data.province = _p || '';
        data.city = _c || '';
        data.area = _a || '';
        return data;
    }

    function getText(jq) {
        var opts = $.data(jq, 'jqArea').options;
        var data = {};
        var _p = $(jq).find('.sel-province option:selected').text();
        var _c = $(jq).find('.sel-city option:selected').text();
        var _a = $(jq).find('.sel-area option:selected').text();
        if (!opts.plain) {
            _p = $(jq).find('.sel-province').find('.dropdown-option span').text();
            _c = $(jq).find('.sel-city').find('.dropdown-option span').text();
            _a = $(jq).find('.sel-area').find('.dropdown-option span').text();
        }
        data.province = _p || '';
        data.city = _c || '';
        data.area = _a || '';
        return data;
    }

    var areaMap = new HashMap();

    function getIndex(data, val) {
        var _idx = -1;
        // console.log(data);
        $.each(data, function (n, v) {
            if (v.code == val) {
                _idx = n;
                return false;
            }
        });
        return _idx;
    }

    function getProvinceData(target, callback) {
        var provinceData = $.data($('body')[0], 'province');
        var opts = $.data(target, 'jqArea').options;

        if (provinceData&&opts.provinceAllow) {
            var pLimits = opts.provinceAllow;
            var data11 = $.data($('body')[0], 'province');
            var result = new Array();
            var len = pLimits.length;
            for(var i = 0; i< len; i++){
                for(var m = 0; m < data11.length; m ++){
                    if (data11[m].code == pLimits[i]) {
                        result.push(data11[m]);
                    }
                }
            }
            provinceData = result;
        }


        if (!provinceData) {
            $.ajax({
                url: opts.url,
                dataType: "jsonp",
                jsonp: "jsoncallback",
                success: function (data) {
                    if (opts.provinceLimit) {
                        var pLimits = opts.provinceLimit;
                        for (var i = 0, j = pLimits.length; i < j; i++) {
                            $.each(data, function (n, v) {
                                if (v.code == pLimits[i]) {
                                    var _idx = getIndex(data, v.code);
                                    data.splice(_idx,1);
                                    return false;
                                }
                            });
                        }
                    }
                    if (opts.provinceAllow) {

                        var newArr=[];
                        var pLimits = opts.provinceAllow;
                        for (var i = 0, j = pLimits.length; i < j; i++) {
                            $.each(data, function (n, v) {

                                if (v.code == pLimits[i]) {
                                    newArr.push(v);

                                }
                            });
                        }
                        data=newArr;

                    }

                    if (data) {
                        $.data($('body')[0], 'province', data);
                    }
                    callback($.data($('body')[0], 'province'));
                },
                error: function () {
                    //alert('调用API错误');
                }
            });
        } else {
            callback(provinceData);
        }

    }


    function getAreaData(target, code, callback) {
        var opts = $.data(target, 'jqArea').options;
        var areaData = areaMap.get(code);
        if (areaData == null) {
            $.ajax({
                url: opts.url + '?pcode=' + code,
                dataType: "jsonp",
                jsonp: "jsoncallback",
                success: function (data) {
                    areaMap.put(code, data);
                    callback(data);
                }
            });
        } else {
            callback(areaData);
        }
    }


    function init(target) {
        //440000  445300  445381

        var opts = $.data(target, 'jqArea').options;
        var _defaultVal = opts.defaultValue;
        var pStr = _defaultVal.province ? '' : '请选择省份';
        var cStr = _defaultVal.city ? '' : '请选择城市';
        var aStr = _defaultVal.area ? '' : '请选择区域';
        _url = opts.url;
        var defaultCss=opts.newCss||'.sel-province,.sel-city,.sel-area{margin-right:5px;}.drop-area-box{position:absolute;left:-1px;top:22px;border:1px solid #d4d4d4;background:#fff;width:240px;padding:5px 0 5px 10px;display:none;z-index:201;}.drop-area-box li{float:left;z-index:200;width:55px;overflow:hidden;height:20px;line-height:20px;margin-right:5px;}.area-select{min-width:60px;background:#fff;position:relative;z-index:1;float:left;border:1px solid #ddd;padding:0 20px 4px 10px;height:18px;}.area-select .arrow{width:0;height:0;font-size:0;border:4px dashed transparent;border-top:4px solid #545555;position:absolute;right:5px;top:10px;}.sel-province{z-index:3;}.sel-city{z-index:2}';
        if(oneCss){
            addCss(defaultCss);
            oneCss=false;
        }

        var _that = $(target);
        _that.empty().height(24);
        var _provinceSel = $('<select class="sel-province"><option value="">' + opts.defaultText.province + '</option></select>');
        var _citySel = $('<select  class="sel-city"><option value="">' + opts.defaultText.city + '</option></select>');
        var _areaSel = $('<select class="sel-area"><option value="">' + opts.defaultText.area + '</option></select>');
        if(!opts.pos){
            var address=[],addressCode=[];
            addressCode[0] =_defaultVal.province;
            addressCode[1] =_defaultVal.city;
            addressCode[2] =_defaultVal.area;

        }

        zIndex -= 1;
        _that.addClass('clearfix').css({"z-index": zIndex});

        if (opts.width) {
            addCss('.area-box select,.area-box .area-select{width:' + opts.width + 'px;overflow: hidden;word-break: break-all;white-space: nowrap;text-overflow: ellipsis;}');
        }

        //渲染省份
        getProvinceData(target, function (data) {
            if (!opts.plain) {
                if(!opts.pos){

                    _provinceSel = $('<div class="sel-province area-select area-select-selected"><a data-value="" class="dropdown-option" href="javascript:;"><span>' + pStr + '</span><i class="arrow"></i></a></div>');
                    _citySel = $('<div class="sel-city area-select" ><a data-value="" class="dropdown-option" href="javascript:;"><span>' + cStr + '</span><i class="arrow"></i></a></div>');
                    _areaSel = $('<div class="sel-area area-select" ><a data-value="" class="dropdown-option" href="javascript:;"><span>' + aStr + '</span><i class="arrow"></i></a></div>');
                }else{
                    _provinceSel = $('<div class="sel-province area-select"><a data-value="" class="dropdown-option" href="javascript:;"><span>' + pStr + '</span><i class="arrow"></i></a></div><ul class="drop-area-box jsDropProvinceBox"></ul>');
                    _citySel = $('<div class="sel-city area-select"><a data-value="" class="dropdown-option" href="javascript:;"><span>' + cStr + '</span><i class="arrow"></i></a></div><ul class="drop-area-box jsDropCityBox"></ul>');
                    _areaSel = $('<div class="sel-area area-select"><a data-value="" class="dropdown-option" href="javascript:;"><span>' + aStr + '</span><i class="arrow"></i></a></div><ul class="drop-area-box jsDropAreaBox"></ul>');
                }


            }

            if (opts.plain) {

                _provinceSel.empty().append(joinOptions(target, data, 'province')).appendTo(_that);
                _provinceSel.val(_defaultVal.province);
                if (typeof  _defaultVal.city != "undefined") {
                    _citySel.appendTo(_that);
                    getAreaData(target, _defaultVal.province, function (data) {
                        _citySel.empty().append(joinOptions(target, data, 'city'));
                        if (_defaultVal.city != "") {
                            _citySel.val(_defaultVal.city);
                        }
                    });
                    _provinceSel.bind('change', function () {
                        var _this = $(this);
                        var _selOpt = $('option:selected', _this);
                        getAreaData(target, _selOpt.val(), function (data) {
                            _citySel.empty().append(joinOptions(target, data, 'city'));
                            _areaSel.empty().append('<option value="">' + opts.defaultText.area + '</option> ');
                        });

                    });

                }

                if (typeof  _defaultVal.area != "undefined") {
                    _areaSel.appendTo(_that);
                    getAreaData(target, _defaultVal.city, function (data) {
                        _areaSel.empty().append(joinOptions(target, data, 'area'));
                        if (_defaultVal.area != "") {
                            _areaSel.val(_defaultVal.area);
                        }
                    });
                    _citySel.bind('change', function () {
                        var _this = $(this);
                        var _selOpt = $('option:selected', _this);
                        getAreaData(target, _selOpt.val(), function (data) {
                            _areaSel.empty().append(joinOptions(target, data));
                        });

                    });
                }


            } else {

                if(!opts.pos){
                    _that.height('auto');
                    var _header=$('<div class="dorp-box-header"><a href="javascript:void(0)" id="J-PopupClose" class="address-all-close"></a></div>');
                    var _dropList=$('<div class="drop-list-con"><ul class="drop-area-box clearfix jsDropProvinceBox" ></ul>');
                    _provinceSel.appendTo(_header);
                    _header.appendTo(_that);
                    if (typeof  _defaultVal.city != "undefined") {
                        if(_defaultVal.city==""){
                            _citySel.css("display","none").removeClass("area-select-selected");

                        }
                        _citySel.appendTo(_header);
                        _header.appendTo(_that);

                    }
                    if (typeof  _defaultVal.area != "undefined") {
                        if(_defaultVal.area==""){
                            _areaSel.css("display","none").removeClass("area-select-selected");

                        }
                        _areaSel.appendTo(_header);
                        _header.appendTo(_that);
                    }
                    _dropList.appendTo(_that);
                    var _ul = _that.find('.jsDropProvinceBox');
                    _ul.append(joinOptions(target, data));
                    $('.drop-area-box li', _that).die('click.xy').live('click.xy', function (e) {
                        e.stopPropagation();
                        var _this = $(this).find('a');
                        var _ul = _this.closest('.drop-area-box');
                        var areaSelect = _ul.parents(".drop-list-con").prev('.dorp-box-header').find(".area-select-selected");
                        areaSelect.find('.dropdown-option span').text(_this.text()).attr('data-value', _this.attr('data-value'));
                        if(areaSelect.hasClass('sel-province' )){
                            addressCode[0]=_this.attr('data-value');
                            address[0]   =$(_this).text();
                        }  else if(areaSelect.hasClass('sel-city' )){
                            addressCode[1]=_this.attr('data-value');
                            address[1]   =$(_this).text();
                        } else if(areaSelect.hasClass('sel-area' )){
                            addressCode[2]=_this.attr('data-value');
                            address[2]   =$(_this).text();
                        }

                        if(_areaSel.find('.dropdown-option span').attr('data-value')!=""&&_areaSel.hasClass("area-select-selected")){
                            _areaSel.removeClass('area-select-selected');
                            _that.hide();
                            if(address[0]==address[1]&&address[1]==address[2]&&address[2]==address[0]){
                                address[1]=address[2]="";
                            }else if(address[0]==address[1]){
                            	address[1]="";
                            }
                            $("#jsAddressInfo").html(address.join("")+"<s></s>").attr("data-value",addressCode[0]+"-"+addressCode[1]+"-"+addressCode[2]);
                            var obj={'provinceCode':addressCode[0],'cityCode':addressCode[1],'areacode':addressCode[2]}
                            typeof opts.callback=='function'?opts.callback(obj):'';
                        }

                        //加载城市
                        if (typeof  _defaultVal.city != "undefined" && areaSelect.hasClass('sel-province')) {
                            _this.closest('.sel-province').removeClass('.area-select-selected');
                            getAreaData(target, _this.attr('data-value'), function (data) {
                                _citySel.show().addClass("area-select-selected").siblings().removeClass("area-select-selected");
                                _citySel.find('.dropdown-option span').text(opts.defaultText.city).attr('data-value', '');
                                _areaSel.find('.dropdown-option span').text(opts.defaultText.area).attr('data-value', '');
                                //_areaSel.next('.drop-area-box').empty();
                                _ul.empty().append(joinOptions(target, data));
                                //showSelPop(_that.find('.sel-city'));
                            });
                            return false;
                        }
                        //加载地区
                        if (typeof  _defaultVal.area != "undefined" && areaSelect.hasClass('sel-city')) {
                            _this.closest('.sel-city').removeClass('Validform_error');
                            getAreaData(target, _this.attr('data-value'), function (data) {
                                _areaSel.show().addClass("area-select-selected").siblings().removeClass("area-select-selected");
                                _ul.empty().append(joinOptions(target, data));

                            });
                        }

                        if (_this.closest('.area-select').hasClass('sel-area')) {
                            _this.closest('.sel-area').removeClass('Validform_error');
                        }

                        return false;

                    });
                    $('.area-select', _that).die('click.xy').live('click.xy', function (e) {

                        e.stopPropagation();

                        var _this = $(this);
                        if(_this.hasClass("area-select-selected")){
                            return;
                        }else{

                            _this.addClass("area-select-selected").siblings().removeClass("area-select-selected");
                            _this.nextAll().hide();


                            var datavalue=_this.prev().find('.dropdown-option span').attr('data-value');
                            var _ul = _that.find('.jsDropProvinceBox');
                            if(datavalue!=undefined){

                                getAreaData(target, datavalue, function (data) {
                                    _citySel.show().addClass("area-select-selected").siblings().removeClass("area-select-selected");
                                    _ul.empty().append(joinOptions(target, data));

                                });

                            }else{
                                getProvinceData(target, function (data) {
                                    _provinceSel.show().addClass("area-select-selected").siblings().removeClass("area-select-selected");
                                    _ul.empty().append(joinOptions(target, data));

                                });
                            };

                        };

                    });



                }else{
                    _provinceSel.appendTo(_that);
                    var _ul = _that.find('.jsDropProvinceBox');
                    _ul.append(joinOptions(target, data));
                    if (typeof  _defaultVal.city != "undefined") {
                        _citySel.appendTo(_that);
                    }
                    if (typeof  _defaultVal.area != "undefined") {
                        _areaSel.appendTo(_that);
                    }
                    var timer = null;
                    $('.area-select', _that).die('xy1').live('mouseover.xy1', function (e) {

                        //debugger;

                        var _this = $(this);
                       // if (opts.hkLimit && _this.hasClass('sel-province')) {
                      //      return;
                      //  }
                        showSelPop(_this);
                    });
                    $('.area-select', _that).die('xy').live('mouseleave.xy', function () {
                        var _this = $(this);
                        timer = setTimeout(function () {
                            _this.next('.drop-area-box').hide();
                        }, 100);

                    });
                    $('.drop-area-box').die('xy').live('mouseover.xy', function () {
                        clearTimeout(timer);
                    });

                    $('.drop-area-box').die('xy').live('mouseleave.xy', function () {

                        $(this).hide();
                    });
                    $('.drop-area-box li', _that).die('xy').live('click.xy', function () {

                        var _this = $(this).find('a');
                        var _ul = _this.closest('.drop-area-box');
                        var areaSelect = _ul.prev('.area-select');
                        areaSelect.find('.dropdown-option span').text(_this.text()).attr('data-value', _this.attr('data-value'));
                        _ul.hide();

                        //加载城市
                        if (typeof  _defaultVal.city != "undefined" && areaSelect.hasClass('sel-province')) {
                            _this.closest('.sel-province').removeClass('Validform_error');
                            getAreaData(target, _this.attr('data-value'), function (data) {
                                var _ul = _citySel.next('.drop-area-box');
                                _citySel.find('.dropdown-option span').text(opts.defaultText.city).attr('data-value', '');
                                _areaSel.find('.dropdown-option span').text(opts.defaultText.area).attr('data-value', '');
                                _areaSel.next('.drop-area-box').empty();
                                _ul.empty().append(joinOptions(target, data));
                                showSelPop(_that.find('.sel-city'));
                            });
                            return false;
                        }

                        //加载地区
                        if (typeof  _defaultVal.area != "undefined" && areaSelect.hasClass('sel-city')) {
                            _this.closest('.sel-city').removeClass('Validform_error');
                            getAreaData(target, _this.attr('data-value'), function (data) {
                                var _ul = _areaSel.next('.drop-area-box');
                                _areaSel.find('.dropdown-option span').text(opts.defaultText.area).attr('data-value', '');
                                _areaSel.find('.drop-area-box').empty();
                                _ul.empty().append(joinOptions(target, data));
                                showSelPop(_that.find('.sel-area'));
                            });
                        }

                        if (_this.closest('.area-select').hasClass('sel-area')) {
                            _this.closest('.sel-area').removeClass('Validform_error');
                        }

                        return false;

                    });
                }






                $('.drop-area-box').die('xy').live('click.xy', function () {

                    return false;
                });

            }

            //plain为false时 初始化数据
            if (_defaultVal.province != "" && !opts.plain) {


                var name = getNameByValue(data, _defaultVal.province);

                _provinceSel.find('.dropdown-option span').text(name).attr('data-value', _defaultVal.province);
                if(!opts.pos){
                    address[0]=name;
                    if (typeof  _defaultVal.city != "undefined") {
                        getAreaData(target, _defaultVal.province, function (data) {

                            _citySel.find('.dropdown-option span').text(cStr).attr('data-value', '');
                            _areaSel.find('.dropdown-option span').text(aStr).attr('data-value', '');
                            _areaSel.next('.drop-area-box').empty();
                            if (_defaultVal.city != "") {
                                var _name = getNameByValue(data, _defaultVal.city);
                                address[1]=_name;
                                _citySel.find('.dropdown-option').find('span').text(_name).attr('data-value', _defaultVal.city);

                            }

                            if (typeof  _defaultVal.area != "undefined") {
                                getAreaData(target, _defaultVal.city, function (data) {
                                    if (typeof  _defaultVal.area != "undefined") {
                                        var _ul = _that.find('.jsDropProvinceBox');
                                        _ul.empty().append(joinOptions(target, data));
                                        //初始化地区
                                        if (_defaultVal.area != "") {
                                            address[2]=getNameByValue(data, _defaultVal.area);
                                            _areaSel.find('.dropdown-option span').text(getNameByValue(data, _defaultVal.area)).attr('data-value', _defaultVal.area);
                                            _areaSel.addClass("area-select-selected").siblings().removeClass("area-select-selected");

                                            _ul.find("li").each(function(i){
                                                var dataValue=$(this).find("a").attr("data-value");
                                                if(_defaultVal.area==dataValue){
                                                    $(this).addClass("active")
                                                }


                                            })
                                        }

                                    }
                                });
                            }

                        });
                    }


                }else{
                    if (typeof  _defaultVal.city != "undefined") {
                        getAreaData(target, _defaultVal.province, function (data) {
                            var _ul = _citySel.next('.drop-area-box');
                            _citySel.find('.dropdown-option span').text(cStr).attr('data-value', '');
                            _areaSel.find('.dropdown-option span').text(aStr).attr('data-value', '');
                            _areaSel.next('.drop-area-box').empty();
                            _ul.empty().append(joinOptions(target, data));
                            if (_defaultVal.city != "") {
                                var _name = getNameByValue(data, _defaultVal.city);
                                _citySel.find('.dropdown-option').find('span').text(_name).attr('data-value', _defaultVal.city);

                            }

                            if (typeof  _defaultVal.area != "undefined") {
                                getAreaData(target, _defaultVal.city, function (data) {
                                    if (typeof  _defaultVal.area != "undefined") {
                                        var _aUl = _areaSel.next('.drop-area-box');
                                        _aUl.empty().append(joinOptions(target, data));
                                        //初始化地区
                                        if (_defaultVal.area != "") {
                                            _areaSel.find('.dropdown-option span').text(getNameByValue(data, _defaultVal.area)).attr('data-value', _defaultVal.area);
                                        }

                                    }
                                });
                            }

                        });
                    }
                }



            }

        });

    }

    function showSelPop(sel) {

        var _l = sel.position().left;
        var _t = sel.position().top + 23;
        sel.next().find('li').size() > 0 && sel.next().css({left: _l, top: _t}).show();
    }



    $.fn.jqArea = function (options, param) {
        if (typeof options === 'string') {
            return $.fn.jqArea.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var _this = this;
            var state = $.data(_this, "jqArea");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(_this, "jqArea", {
                    options: $.extend({},
                        $.fn.jqArea.defaults, options)
                });

            }
            init(_this);
        });
    };

    $.fn.jqArea.methods = {
        getValue: function (jq) {
            return getValue(jq[0]);
        },
        getText: function (jq) {
            return getText(jq[0]);
        },
        showProvince: function (jq) {
            showSelPop(jq.find('.sel-province'));
        },
        showCity: function (jq) {
            showSelPop(jq.find('.sel-city'));
        },
        showArea: function (jq) {
            showSelPop(jq.find('.sel-area'));
        }
    };

    $.fn.jqArea.defaults = {
        plain: true, //普通
        hkLimit: false,//限制境外
        provinceLimit: null,
        provinceAllow:null,
        url: 'http://www.cecport.com/area/getAreaChildren.jhtml', //数据请求网址
        defaultText: {"province": "请选择省份", "city": "请选择城市", "area": "请选择区域"},
        defaultValue: {"province": "", "city": "", "area": ""}, //初始化数据
        newCss:defaultCss,//新样式
        pos:true,    //新样式时使用
        callback:null
    };

})(jQuery);