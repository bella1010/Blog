define(['jquery', 'widget'], function($, widget){
	function Window(){
		this.config = {
			title: '系统信息',
			content: '',
			width: 500,
			height: 300,
			hasCloseBtn: false,
			hasMark: false,
			isDraggable: true,
			skinClassName: null,
			handlerAlertBtn: null,
			handlerCloseBtn: null,
			hasConfirmBtn: '确认', //comfirm组件
			hasCancelBtn: '取消',
			handlerConfirmBtn: null,
			handlerCancelBtn: null,
			hasPromptBtn: '确定', //prompt组件
			hasPromptCancelBtn: '取消',
			isPromptInputPassword: false,
			defaultValuePromptInput: '张三',
			maxLengthPromptInput: 10,
			handlerPromptBtn: null
		} //默认参数
	}
	//$.extend()之后，handlers属性将出现在prototype上，这里就要小心了，假如组件1绑定了自定义事件，那么组件2也有该事件，
	//所以每次实例化组件都需要清空prototype对象上的属性，如handlers属性
	Window.prototype = $.extend({}, new widget.Widget(), {
		renderUI: function(){  //什么跟节点操作有关的东西放在这里
			var footerBtn = ""
			switch(this.config.winType){
				case 'alert':
					footerBtn = '<input type="button" value="确定" class="window_alertBtn">';
					break;
				case 'confirm':
					footerBtn = '<input type="button" value="' + this.config.hasConfirmBtn + '" class="window_confirmBtn"><input type="button" value="' + this.config.hasCancelBtn + '" class="window_cancelBtn">';
					break;
				case 'prompt':
					this.config.content += '<p><input value="'+ this.config.defaultValuePromptInput +'" maxlength="'+ this.config.maxLengthPromptInput +'" type="'+ (this.isPromptInputPassword === true ? "password" : "text")  +'" class="window_promptInput"></p>'
					footerBtn = '<input type="button" value="'+ this.config.hasPromptBtn +'" class="window_promptBtn"><input type="button" value="' + this.config.hasPromptCancelBtn +'" class="window_cancelBtn">'
					break;		
			}
			//创建盒子
			this.boundingBox = $('<div class="window_box">'
				+ '<div class="window_body">' + this.config.content + '</div>'
				+ '</div>');
			//判断是否来common框
			if(this.config.winType !== 'common'){
				this.boundingBox.prepend('<div class="window_header">' + this.config.title + '</div>');
				this.boundingBox.append('<div class="window_footer">' + footerBtn + '</div>');
			}
			//获取prompt组件的inputObject
			if(this.config.winType === 'prompt'){
				this.promptInput =  this.boundingBox.find('.window_promptInput');
			}
			// $box.appendTo('body');
			//添加遮照层，防止用户不操作而直接操作页面的内容
			if(this.config.hasMark === true){
				this.mark = $('<div class="window_mark"></div>');
				this.mark.appendTo('body');
				//mark下面摧毁函数要用到，所以用this创建出去
			}  
			//添加关闭按钮
			if(this.config.hasCloseBtn === true){
				var $colseBtn = $('<span class="window_closeBtn">X<span>');
				$colseBtn.appendTo(this.boundingBox);
			}
		},
		bindUI: function(){ //所有跟绑定事件有关的
			var that = this;
			//事件委托
			this.boundingBox.delegate('.window_closeBtn', 'click', function(){
				that.fire('close');
				that.destroy();
			}).delegate('.window_alertBtn', 'click', function(){
				that.fire('alert');
				that.destroy();
			}).delegate('.window_confirmBtn', 'click', function(){
				that.fire('confirm');
				that.destroy();
			}).delegate('.window_cancelBtn', 'click', function(){ //取消按钮由confirm和prompt共享
				that.fire('cancel');
				that.destroy();
			}).delegate('.window_promptBtn', 'click', function(){ //触发promt事件的时候传入input里面的值
				that.fire('prompt', that.promptInput.val());
				that.destroy();
			});
			//给按钮做事件监听
			if(typeof this.config.handlerAlertBtn === 'function'){
				that.on('alert', this.config.handlerAlertBtn);
			}
			if(typeof this.config.handlerCloseBtn === 'function'){
				that.on('close', this.config.handlerCloseBtn);
			}
			if(typeof this.config.handlerConfirmBtn === 'function'){
				that.on('confirm', this.config.handlerConfirmBtn);
			}
			if(typeof this.config.handlerCancelBtn === 'function'){
				that.on('cancel', this.config.handlerCancelBtn);
			}
			if(typeof this.config.handlerPromptBtn=== 'function'){
				that.on('prompt', this.config.handlerPromptBtn);
			}
		},
		syncUI: function(){ //所有跟初始化样式有关的
			//为盒子设置宽高和位置
			this.boundingBox.css({
				width: this.config.width,
				height: this.config.height,
				top: this.config.y || (window.innerHeight - this.config.height)/2,
				left: this.config.x || (window.innerWidth - this.config.width)/2
			});
			//添加皮肤class
			if(this.config.skinClassName){
				this.boundingBox.addClass(this.config.skinClassName);
			}
			//添加拖动
			if(this.config.isDraggable === true){
				//拖动的把手默认是.window_header
				var $box = this.boundingBox;
				$box.find('.window_header').on('mousedown', function(e){
					var x = e.pageX - $box.offset().left;
					var y = e.pageY - $box.offset().top
					$(document).on('mousemove', function(e){
						$box.css({
							top: e.pageY - $(document).scrollTop() - y,
							left: e.pageX - $(document).scrollLeft() - x
						});
					});
					$(document).mouseup(function(){
						$box.off('mousedown');
						$(document).off('mousemove mouseup');
					});
					return false;
				});
			}
		},
		destructor: function(){  //摧毁前的处理函数
			this.mark && this.mark.remove();
		},
		alert: function(cfg){ 
			$.extend(this.config, cfg, {winType: 'alert'});//相当于this.config = $.extend(this.config, cfg);
			this.render(); //开始渲染组件
			return this;//连缀语法
		},
		confirm: function(cfg){
			$.extend(this.config, cfg, {winType: 'confirm'});
			this.render();
			return this;
		},
		prompt: function(cfg){
			$.extend(this.config, cfg, {winType: 'prompt'});
			this.render();
			this.promptInput.focus();
			return this;
		},
		common: function(cfg){ //只有基础功能的弹窗，没有title和body
			$.extend(this.config, cfg, {winType: 'common'});
			this.render();
			return this;
		}
	});
	return {
		Window: Window
	}
});