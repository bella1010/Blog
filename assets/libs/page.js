/**
 * 页面分页
 * create 2014-06-14 Aaron.Qiu
 */
define("page",function (require, exports, module) {
    
	var pagination = {
		// template
		T : {
			first : "<a href='javascript:;' class='prev dis' id='p1'><i></i></a>",
			prev :  "<a href='javascript:;' class='prev' id='p2'><i></i>上一页</a>",
			current : "<a href='javascript:;' class='current' id='p3'>1</a>",
			currentNext : "<a href='javascript:;' class='currentNext' id='p4'>2</a>",
			omit : "<span class='s' id='p5'>...</span>",
			lastPrev : "<a href='javascript:;' class='nextPrev' id='p6'>4</a>",
			next : "<a href='javascript:;' class='next' id='p7'>下一页<i></i></a>",
			last : "<a href='javascript:;' class='next dis' id='p8'><i></i></a>",
			jumppage:"<span id='p9' class='s'>到第<input type='text' class='jumpto'>页</span><a href='javascript:;' class='jumpgo'>确定</a>"
		}
	        
    	,defaults : {    		
    		total: 1,
    		current: 1,
    		size: 20,
    		currentNext : true,
    		prev: true,
    		lastPrev: true,
    		next: true,
    		first: true,
    		last: true,
    		omit : true,
    		jump : false,
    		callback: function() {}
    	},
    	//总页数
    	totalSize : function(pageSize,total) {
    		if(!pageSize) pageSize = pagination.defaults.size;
    		
    		var size = (total%pageSize==0) ? total/pageSize : total/pageSize + 1;
    		return parseInt(size);
    	},
    	//分页功能处理
    	/**
    	 * {
    	 * 	page : 1, //当前页
    	 * 	total : 15, //总记录数
    	 *  pageSize : 20, //每页显示的数量
    	 *  callback : fun//回调函数
    	 * }
    	 */
    	paging : function(paramObj){
    		if(!paramObj || !$.isFunction(paramObj.callback) || !paramObj.total ) return;
    		
    		pagination.setPagin(paramObj);
    		//$("#pagin a").on("click",paramObj.callback);
    		$("#pagin a").not($(".dis")).on("click",paramObj.callback);
    	},
    	//根据页数显示分页组件
    	setPagin : function(paramObj) {
    		var firstPage = 1; //第一页 
    		var prevPage = 1; //前一页
    		var currentPage = parseInt(paramObj.page || 1) || 1; //当前页
    		var currentNext = 1; //当前页的下一页
    		var lastPrev = 1; //最后一页的前一页
    		var next = 1; //下一页
    		var last = 1; //最后一页
    		
    		//总页数
    		var totalSize = pagination.totalSize(paramObj.pageSize, paramObj.total);
    		
    		//总页数大于1
    		if(totalSize>1) {
    			prevPage = (currentPage-1 <=0) ? 1 : currentPage-1; 
    			currentNext = (prevPage+1) > totalSize ? prevPage : prevPage+1;
    			next = (currentPage>=totalSize) ? totalSize : currentPage+1;
    			last = totalSize;
    			lastPrev = last;
    		}
    		
    		//控制显示
    		pagination.defaults.prev = (currentPage<=1) ? false : true;
    		pagination.defaults.next = (next==1 || currentPage>=totalSize) ? false : true;
    		pagination.defaults.currentNext = (currentNext==1) ? false : true;
    		pagination.defaults.lastPrev = (lastPrev==1||totalSize==2) ? false : true;
    		pagination.defaults.omit = (last<4) ? false : true;
    		pagination.defaults.jump = paramObj.jump;
    		
    		//构建页面组件    		
    		var pageHtml = pagination.buildPagin();
    		$("#pagin").html(pageHtml);
    		
    		//修改样式
    		var $first = $("#p1");
    		var $last = $("#p8");
    		var $current = $("#pagin .current");
    		
    		//首页
    		if(currentPage>firstPage) {
    			if($first.hasClass("dis")) {
    				$first.removeClass("dis");
    			}
    		} else {
    			if(!$first.hasClass("dis")) {
    				$first.addClass("dis");
    			}
    		}
    		
    		if(pagination.defaults.prev) {
    			$("#p2").data("page",prevPage);
    		}
    		
    		if(pagination.defaults.current) {
    			
    			$("#p3").data("page",prevPage);
    		}
    		
    		if(pagination.defaults.currentNext) {
    			$("#p4").data("page",currentNext);
    			
    			if(2==currentPage && 2==totalSize) {
    				$current.removeClass("current");
    				$("#p4").addClass("current");
    			}
    		}
    		
    		if(pagination.defaults.lastPrev) {
    			$("#p6").html(totalSize);
    			$("#p6").data("page",lastPrev);
    			if(currentPage==totalSize) {
    				$current.removeClass("current");
    				$("#p6").addClass("current");
    				$("#p3").data("page",1);
    				$("#p4").data("page",2);
    			}
    		}
    		
    		if(pagination.defaults.next) {
    			$("#p7").data("page",next);
    			
    			if(currentPage>=2) {
    				$("#p3").html(prevPage);
    				$("#p4").html(currentPage);
    				$("#p3").data("page",prevPage);
    				$("#p4").data("page",currentPage);
    				$current.removeClass("current");
    				$("#p4").addClass("current");
    				
    			
    				if(next==totalSize) {
    					$("#p2").after($("#p5"));
    				}
    			}
    		}
    		
    		//最后一页
    		if(currentPage<last) {
    			if($last.hasClass("dis")) {
    				$last.removeClass("dis");
    			}
    		} else {
    			if(!$last.hasClass("dis")) {
    				$last.addClass("dis");
    			}
			}
    		
    		//改为页数
    		$first.data("page",firstPage);
    		$("#pagin .current").data("page",currentPage);
			$last.data("page",last);
    		

    	},
    	//构建页面组件
    	buildPagin : function() {
    		var pageHtml = [];
    		if(pagination.defaults.first) pageHtml.push(pagination.T.first); 
    		if(pagination.defaults.prev) pageHtml.push(pagination.T.prev);
    		pageHtml.push(pagination.T.current);
    		if(pagination.defaults.currentNext) pageHtml.push(pagination.T.currentNext);
    		if(pagination.defaults.omit) pageHtml.push(pagination.T.omit);
    		if(pagination.defaults.lastPrev) pageHtml.push(pagination.T.lastPrev);
    		if(pagination.defaults.next) pageHtml.push(pagination.T.next);
    		if(pagination.defaults.last) pageHtml.push(pagination.T.last);
    		if(pagination.defaults.jump) pageHtml.push(pagination.T.jumppage);
    		return pageHtml.join("");
    		
    	}
    };
    //暴露给页面调用的接口
    var out = {
		paging : pagination.paging
    };
    
    module.exports = out;
});
