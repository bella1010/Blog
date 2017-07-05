//requirejs的配置
require.config({
	paths: {
		'jquery': 'jquery.min'
	}
});
//入口
require(['jquery', 'window'], function($, w){
	$('#alert').click(function(){
		var win = new w.Window();
		win.alert({
			title: '提示',
			content: 'hello world!',
			width: 300,
			height: 200,
			hasCloseBtn: true, //关闭按钮
			hasMark: true,//遮造层
			skinClassName: 'window_skin_a',//定制皮肤-传入一个class。通过css层面来改
			isDraggable: true, //拖拽
			handlerCloseBtn: function(){ //当点击关闭按钮时触发 也可以使用自定义事件
				alert('closeBtn');
			},
			handlerAlertBtn: function(){ //当点击alert按钮时触发 也可以使用自定义事件
				alert('alertBtn');
			}
		});
		//绑定自定义事件 代码一旦有规模后 这种方式就起很大作用
		win.on('alert', function(){
			alert('alertBtn2');
		});
		win.on('close', function(){
			alert('closeBtn2');
		});
	});
	$('#confirm').click(function(){
		var win = new w.Window();
		win.confirm({
			title: '提示',
			content: '请问你是 hello world？',
			width: 300,
			height: 200,
			isDraggable: true, //拖拽
			hasConfirmBtn: '是',
			hasCancelBtn: '否',
			handlerConfirmBtn: function(){ //当点击关闭按钮时触发 也可以使用自定义事件
				alert('confirmBtn');
			},
			handlerCancelBtn: function(){ //当点击alert按钮时触发 也可以使用自定义事件
				alert('cancelBtn');
			}
		}).on('confirm', function(){
			alert('i am comfirm');
		}).on('cancel', function(){
			alert('i am cancel');
		});
	});
	$('#prompt').click(function(){
		var win = new w.Window();
		win.prompt({
			title: '请输入您的名字',
			content: '我们会保证你的信息安全。',
			width: 300,
			height: 200,
			isDraggable: true, //拖拽
			hasConfirmBtn: '是',
			hasPromptBtn: '确定', //prompt组件
			hasPromptCancelBtn: '取消',
			isPromptInputPassword: true,
			defaultValuePromptInput: '林烁圭',
			maxLengthPromptInput: 10,
			handlerPromptBtn: function(val){
				alert('您输入的是 ' + val);
			}
		}).on('prompt', function(){
			alert('我是自定义事件触发的');
		}).on('cancel', function(){
			alert('i am cancel');
		});
	});
	$('#common').click(function(){
		var win = new w.Window();
		win.common({
			title: '请输入您的名字',
			content: '我们会保证你的信息安全。',
			width: 300,
			height: 200,
			hasCloseBtn: true,
			hasMark: true
		})
	});
});