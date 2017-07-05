
define("bdshare",function (require, exports, module) {
	"require:nomunge,exports:nomunge,module:nomunge";
	var bdShare={};

bdShare={
        	init:function(params){
        		var siteName = params.siteName; // 网站名 
    			var title = params.title; // 标题
    			var description = params.description; // 描述
    			if(description){
	    			var description_40 = description.substring(0,110);
	    			var description_60 = description.substring(0,130);
	    			var description_80 = description.substring(0,150);
	    			var description_300 = description.substring(0,360);
    			}
    			var siteUrl = params.siteUrl; // 链接	
    			var bdSize = params.bdSize || 24;
    			var flag = params.flag || "product"; // 标识：产品或样片(product/sample)
    			var url = siteUrl;
    			var type = "";
    			window._bd_share_config = {
    		        "common": {
    		            "bdSnsKey": {},
    		            "bdText": "",
    		            "bdDesc":"",
    		            "bdUrl":url,
    		            "bdMini": "2",
    		            "bdMiniList" : [ "tqq", "baidu", "renren", "t163", "tieba", "tsohu" ],
    		            "bdPic": "",
    		            "bdStyle": "0",
    		            "bdSize": bdSize,
    		            "onBeforeClick":function(cmd,config){
    		            	var text = "";
    		            	var desc = "";
    		            	if (flag === "sample") {
    		            		if(cmd=="tsina" || cmd=="tqq"){
    		            			text = "我刚在#" + siteName + "#" + type + "" + title + ":" + description_60 + "(分享自 @"+siteName+")";
    		            		}else if(cmd=="qzone"){
    		            			text = "我刚在#" +siteName + "#" + type + "" + title + "，与您分享！";
    		            			desc = description_80;
    		            		}else if(cmd=="sqq"){
    		            			text = "【"+title+"】"+description_40+"我在#"+siteName+"#看到"+type+"【"+title+"】，与您分享！ (分享自  @"+siteName+")";
    		            		}else if(cmd=="baidu"){
    		            			text = "我刚在#" + siteName + "#" + type + "" + title + "，与您分享！";
    		            			desc = description_80;
    		            		}else if(cmd=="renren"){
    		            			text = url+"(分享自 @"+siteName+")";
    		            			desc = "我刚在#" + siteName + "#" + type + "" + title + ":" + description_300;
    		            		}else if(cmd=="t163"){
    		            			text = "我刚在#" + siteName + "#" + type + "" + title + ":" + description_60 + "(分享自 @"+siteName+")";
    		            		}else if(cmd=="tieba"){//
    		            			text = title;
    		            			desc = "我刚在#" + siteName + "#" + type + "" + title + ":" + description_60 + "(分享自 @"+siteName+")";
    		            		}else if(cmd=="tsohu"){
    		            			text = "我刚在#" + siteName + "#" + type + "" + title + ":" + description_60 + "(分享自 @"+siteName+")";
    		            		}else{
    		            			text = "我刚在" + siteName + "看到" + type + "【"+title+"】，与您分享！";
    		            		}
    		            	} else {
    		            		
    		            		if(cmd=="tsina" || cmd=="tqq"){
    		            			text = "我在#"+siteName+"#里看到"+type+"【"+title+"】:"+description_60+"... 与您分享！ (分享自 @"+siteName+")";
    		            		}else if(cmd=="qzone"){//
    		            			text = "我在#"+siteName+"#里看到"+type+"【"+title+"】，与您分享！";
    		            			desc = "#"+title+"#"+description_80+"...";
    		            		}else if(cmd=="sqq"){
    		            			text = "【"+title+"】"+description_40+"我在#"+siteName+"#看到"+type+"【"+title+"】，与您分享！ (分享自  @"+siteName+")";
    		            		}else if(cmd=="baidu"){
    		            			text = "我在"+siteName+"看到"+type+"【"+title+"】，与您分享！";
    		            			desc = description_80+"...";//
    		            		}else if(cmd=="renren"){//
    		            			text = url+"(分享自 @"+siteName+")";
    		            			desc = "我在#"+siteName+"#看到"+type+"【"+title+"】:"+description_300+"... 与您分享！";
    		            		}else if(cmd=="t163"){
    		            			text = "我在#"+siteName+"#看到"+type+"【"+title+"】:"+description_60+"... 与您分享！(分享自 @"+siteName+")";
    		            		}else if(cmd=="tieba"){//
    		            			text = title;
    		            			desc = "我在#"+siteName+"#看到"+type+"【"+title+"】:"+description_60+"... 与您分享！(分享自 @"+siteName+")";
    		            		}else if(cmd=="tsohu"){
    		            			text = "我在#"+siteName+"#看到"+type+"【"+title+"】:"+description_60+"... 与您分享！(分享自 @"+siteName+")#";
    		            		}else{
    		            			text = "我在"+siteName+"看到"+type+"【"+title+"】，与您分享！";
    		            		}
    		            	}
    		            	config.bdText = text;
    		            	config.bdDesc = desc;
    		            	return config;
    		            },
    		            "onAfterClick":function(cmd){
    		            	//
    		            }
    		        },
    		        "share": {}
    		    };
    		    with (document)0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
        	}
        };
module.exports = bdShare;
});