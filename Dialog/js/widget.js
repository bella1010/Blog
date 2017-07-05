define(['jquery'], function($){
	function Widget(){
		this.boundingBox = null; //属性:最外层容器
	}
	Widget.prototype = {
		on: function(type, handler){//绑定事件
			if(this.handlers[type] === undefined){
				this.handlers[type] = [];
			}
			this.handlers[type].push(handler);
			return this;
		},
		fire: function(type, data){//触发事件
			if(this.handlers[type] instanceof Array){
				for(var i = 0, len = this.handlers[type].length; i < len; i++){
					this.handlers[type][i](data);
				}
			}
		},
		renderUI: function(){ //接口：添加dom节点

		},
		bindUI: function(){ //接口：监听事件

		},
		syncUI: function(){ //接口：初始化组件属性---width之类

		},
		render: function(containner){ //方法：渲染组件
			this.renderUI();
			this.handlers = {}; //每次新渲染都创建这个属性
			this.bindUI();
			this.syncUI();
			$(containner || document.body).append(this.boundingBox);
		},
		destructor: function(){ //接口：销毁前的处理函数

		},
		destroy: function(){ //方法： 销毁组件
			this.destructor();
			this.boundingBox.off();
			this.boundingBox.remove();
		}
	}
	return {
		Widget: Widget
	}
});