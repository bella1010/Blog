var YouGouComment = {init: function () {
    YouGouComment.clubMask();
    if (!$(".bgclub")[0]) {
        YouGouComment.uploadPic()
    }
    YouGouComment.bindState();
    $(".rate_comm").each(function () {
        $(this).rate(YouGouComment.starOptions)
    });
    $(".jsProSize a").click(function () {
        var a = $(this);
        a.addClass("choose").siblings().removeClass("choose");
        a.closest(".pblsh_cmmnt_box").find("input[name=commoditySizeSuitable]").val(a.index());
        return false
    });
    $("#commentForm")[0].reset();
    $("input[name=commodityScore]").val("");
    $("input[name=commoditySizeSuitable]").val("");
    $(".clubmask").height($(document).height())
}, starOptions: {max: 5, clickTips: "请对商品样式及质量的满意度进行评分", multip: 2, title_format: function (a) {
    var b = "";
    switch (a) {
        case 1:
            b = "很不满意";
            break;
        case 2:
            b = "不满意";
            break;
        case 3:
            b = "一般";
            break;
        case 4:
            b = "满意";
            break;
        case 5:
            b = "非常满意";
            break;
        default:
            b = a;
            break
    }
    return b
}, info_format: function (a) {
    var b = "";
    switch (a) {
        case 1:
            b = '<div class="info">2分&nbsp;很不满意<div>商品样式和质量都非常差，太令人失望了！</div><i></i></div>';
            break;
        case 2:
            b = '<div class="info">4分&nbsp;不满意<div>商品样式和质量不好，不能满足要求。</div><i></i></div>';
            break;
        case 3:
            b = '<div class="info">6分&nbsp;一般<div>商品样式和质量感觉一般。</div><i></i></div>';
            break;
        case 4:
            b = '<div class="info">8分&nbsp;满意<div>商品样式和质量都比较满意，符合我的期望。</div><i></i></div>';
            break;
        case 5:
            b = '<div class="info">10分&nbsp;非常满意<div>我很喜欢！商品样式和质量都很满意，太棒了！</div><i></i></div>';
            break;
        default:
            b = a;
            break
    }
    return b
}}, uploadPic: function () {
    $(".wysd_btn").each(function () {
        var plupid = [];
        var $id = $(this).attr("id");
        var uploader = new plupload.Uploader({runtimes: "flash,html5,silverlight,html4", browse_button: $id, url: "/my/uploadImage.jhtml?mark=" + $("#mark").val(), multipart: true, unique_names: true, chunk_size: "4MB", urlstream_upload: true, multiple_queues: false, multipart_params: {JSESSID: $("#ysId").val()}, flash_swf_url: "/template/common/js/plupload/Moxie.swf", silverlight_xap_url: "/template/common/js/plupload/Moxie.xap", max_file_size: "4MB", filters: [
            {title: "Image files", extensions: "jpg,jpeg,bmp,png"}
        ], init: {FilesAdded: function (up, files) {
            if (uploader.files.length > 5) {
                alert("对不起！您一次只能上传5张图片");
                plupload.each(files, function (file) {
                    uploader.removeFile(file.id)
                });
                return
            } else {
                uploader.files.splice(5, uploader.files.length)
            }
            plupload.each(files, function (file) {
                var _wysd = $("#" + $id).closest(".wysd");
                if (_wysd.find("li").length > 5) {
                    alert("对不起！您一次只能上传5张图片");
                    uploader.removeFile(file.id);
                    return
                }
                var _wysdImgLst = _wysd.find(".wysd_img_lst");
                var _html = '<li>									  <a class="loadding"  href="javascript:void(0);">										  <img id="' + file.id + '" src="/template/common/images/blank.gif" alt="" />										  <span class="del_mask">删除</span>									  </a>								  </li>';
                _wysdImgLst.append(_html);
                _wysdImgLst.find("li").hover(function () {
                    var _this = $(this);
                    _this.addClass("del_hover");
                    _this.click(function () {
                        uploader.removeFile(file.id);
                        var tt = _this.parent().next(".jsUploaderNum");
                        var num = _this.parent().find("li").length;
                        if ((plupid.length - 1) >= 0 && (plupid.length - 1) == (num - 1)) {
                            if (_this.index() == 0) {
                                plupid.splice(0, 1)
                            } else {
                                plupid.splice(_this.index(), 1)
                            }
                            $("#" + $id).closest(".wysd").find("#plupid").val(plupid);
                            $("#" + $id).closest(".wysd").find("#shineFlag").val(plupid.length)
                        }
                        _this.remove();
                        tt.html(num - 1 + "/5")
                    })
                }, function () {
                    var _this = $(this);
                    _this.removeClass("del_hover")
                })
            });
            uploader.start()
        }, FileUploaded: function (up, file, info) {
            var _uploaderNum = up.total.uploaded;
            var res = eval("(" + info.response + ")");
            if (res.statu == "nologin") {
                window.location.href = "/signin.jhtml"
            } else {
                if (res.statu == "badparam") {
                    alert(res.msg)
                } else {
                    if (res.statu == "exception") {
                        alert(res.msg)
                    } else {
                        if (res.statu == "multioprs") {
                            alert("对不起，由于您的频繁操作的此功能,将禁止使用" + res.time)
                        } else {
                            $("#" + $id).closest(".wysd").find(".jsUploaderNum").html(_uploaderNum + "/5");
                            $("#" + file.id).attr("src", res.url).css({width: 40, height: 40});
                            $("#" + file.id).parent().removeClass("loadding");
                            $("#" + $id).closest(".wysd").find("#shineFlag").val(_uploaderNum);
                            plupid.push(res.plupid);
                            $("#" + $id).closest(".wysd").find("#plupid").val(plupid)
                        }
                    }
                }
            }
        }, Error: function (up, err) {
            if (err.code == "-600") {
                alert("文件大小为" + parseInt(err.file.size / (1024 * 1024)) + "MB，文件太大！")
            }
            if (err.code == "-601") {
                alert('"' + err.file.name + '" 的' + err.message)
            }
        }}});
        uploader.init()
    })
}, clubMask: function () {
    var a = $(".jsWysdBox");
    $(".bgclub .close,.bgclub .ikown").click(function () {
        $.ajax({type: "POST", url: "/my/share/setShowPrompt.jhtml", success: function (b) {
        }});
        $(".clubmask,.bgclub").remove();
        a.removeClass("light");
        YouGouComment.uploadPic()
    })
}, bindState: function () {
    $.ajax({type: "POST", url: "/member/foreign/auth/bindInfo.jhtml", success: function (data) {
        var obj = eval(data);
        $.each(obj, function (i, bindInfo) {
            if (bindInfo.useable == 1) {
                if (!bindInfo.expire) {
                    var $input = $("input[name=" + bindInfo.foreignPlatform + "]");
                    $input.attr("checked", true);
                    var $li = $input.parent();
                    $li.removeClass("bind").unbind("click");
                    var $i = $input.next().find("i");
                    $i.removeClass("ico_share_gray").addClass("ico_share")
                } else {
                }
            }
        })
    }});
    var shareList = {qzone: "/member/foreign/auth/qzoneAuth.jhtml", weibo: "/member/foreign/auth/sinaAuth.jhtml", qqweibo: "/member/foreign/auth/q_tAuth.jhtml", renren: "/member/foreign/auth/renrenAuth.jhtml", kaixin: "http://share.jd.com/kaixin001/login.action", douban: "http://share.jd.com/douban/login.action"};
    var shareArr = {qzone: "QQ空间", weibo: "新浪微博", qqweibo: "腾讯微博", renren: "人人网"};
    $(".share_pt_lst .bind").click(function () {
        if ($(".bgclub")[0]) {
            return
        }
        var _this = $(this);
        var _input = _this.find("input[type=checkbox]");
        var platform_en = _input.val();
        var platform_zh = shareArr[platform_en];
        var url = shareList[platform_en];
        window.open(url);
        var dg;
        var _html = '<div class="bindInfoPop"><div class="hd">前往<span>' + platform_zh + '</span>绑定账号，优购时尚商城会确保您的账号安全，请放心绑定。</div><div class="bd mt25"><a name="' + platform_en + '" class="jsFinishBind" id="jsFinishBind" href="javascript:;">绑定完成</a><a class="ml15 jsGoOnBind" href="' + url + '" target="_blank">继续绑定</a></div></div>';
        dg = ygDialog({skin: 3, title: "", close: function () {
            bindCallBack(platform_en)
        }, content: _html})
    });
    $("#jsFinishBind").live("click", function () {
        var platform = $(this).attr("name");
        ygDialog.close()
    })
}};
function bindCallBack(a) {
    $.ajax({type: "POST", url: "/member/foreign/auth/validate.jhtml", data: "platform=" + a, success: function (b) {
        var e = $("input[name=" + a + "]");
        if (b == "true") {
            e.attr("checked", true);
            var d = e.parent();
            d.removeClass("bind");
            var c = e.next().find("i");
            c.removeClass("ico_share_gray").addClass("ico_share")
        } else {
            e.attr("checked", false);
            alert("绑定失败，请重新绑定！")
        }
    }})
}
$(function () {
    YouGouComment.init()
});
function shoesSizeValidator(b) {
    if (b != null && !YouGou.Util.isEmpty(b)) {
        var a = /^([+]?)\d*\.?\d+$/;
        if (!a.test(b) || b < 14 || b > 50) {
            return false
        }
    }
    return true
}
function footLengthValidator(b) {
    if (b != null && !YouGou.Util.isEmpty(b)) {
        var a = /^([+]?)\d*\.?\d+$/;
        if (!a.test(b) || b < 80 || b > 300) {
            return false
        }
    }
    return true
}
function footWidthValidator(b) {
    if (b != null && !YouGou.Util.isEmpty(b)) {
        var a = /^([+]?)\d*\.?\d+$/;
        if (!a.test(b) || b < 40 || b > 150) {
            return false
        }
    }
    return true
}
function clothesSizeValidator(b) {
    if (b != null && !YouGou.Util.isEmpty(b)) {
        var a = /^[0-9a-zA-Z]+$/;
        if (!a.test(b)) {
            return false
        }
    }
    return true
}
function heightValidator(b) {
    if (b != null && !YouGou.Util.isEmpty(b)) {
        var a = /^([+]?)\d*\.?\d+$/;
        if (!a.test(b) || b < 40 || b > 220) {
            return false
        }
    }
    return true
}
function weightValidator(b) {
    if (b != null && !YouGou.Util.isEmpty(b)) {
        var a = /^([+]?)\d*\.?\d+$/;
        if (!a.test(b) || b < 2 || b > 210) {
            return false
        }
    }
    return true
}
function bustValidator(b) {
    if (b != null && !YouGou.Util.isEmpty(b)) {
        var a = /^([+]?)\d*\.?\d+$/;
        if (!a.test(b)) {
            return false
        }
    }
    return true
}
function waistlineValidator(b) {
    if (b != null && !YouGou.Util.isEmpty(b)) {
        var a = /^([+]?)\d*\.?\d+$/;
        if (!a.test(b)) {
            return false
        }
    }
    return true
}
function commentValidator(a) {
    if (a.length < 5 || a.length > 300) {
        return false
    }
    return true
}
function checkUserWriteProductComment(d, b, c) {
    var a = "";
    $.ajax({type: "POST", async: false, url: "/usercenter/comment/checkUserWriteProductComment.sc?orderNo=" + d + "&productNo=" + b + "&mark=" + c, success: function (e) {
        if (e == "false") {
            a = false
        }
        if (e == "true") {
            a = true
        }
        if (e == "flag") {
            a = "flag"
        }
    }});
    return a
}
function submitComment() {
    var d = $("#commentForm");
    var e = $("input[name=orderMainNo]", d).val();
    var c = [];
    var b = true;
    var a = parseInt(rscount);
    $(".errorHint").hide();
    $("input,textarea", d).removeClass("ipt_txt_error");
    var f = $("input[name=mark]").val() || "";
    $(".pblsh_cmmnt_box", d).each(function () {
        var x = $(this);
        var h = $("input[name=commodityId]", x).val() || "";
        var q = $("input[name=commodityNo]", x).val() || "";
        var j = $("input[name=commodityImage]", x).val() || "";
        var v = $("input[name=commodityType]", x).val() || "";
        var k = $("input[name=prodName]", x).val() || "";
        var p = $("input[name=orderNumber]", x).val() || "";
        var r = $("input[name=productNo]", x).val() || "";
        var w = $("input[name=productSize]", x).val() || "";
        var l = $("input[name=commodityScore]", x).val() || "";
        var z = $("input[name=commoditySizeSuitable]", x).val() || "";
        var i = $("input[name=shoesSize]", x).val() || "";
        var s = $("input[name=footLength]", x).val() || "";
        var n = $("input[name=footWidth]", x).val() || "";
        var B = $("textarea[name=myComment]", x).val() || "";
        var m = $("input[name=clothesSize]", x).val() || "";
        var E = $("input[name=height]", x).val() || "";
        var C = $("input[name=weight]", x).val() || "";
        var t = $("input[name=bust]", x).val() || "";
        var o = $("input[name=waistline]", x).val() || "";
        var u = $("input[name=shineFlag]", x).val() || "";
        var y = $("input[name=plupid]", x).val() || "";
        var g = "";
        if (l != "" || z != "" || B != "" || y != "") {
            if (l == "") {
                $(document).scrollTop($(".rate_comm", x).offset().top);
                $(".scoreTips", x).show().html("请对商品样式及质量的满意度进行评分！");
                alert("请对商品样式及质量的满意度进行评分！");
                b = false;
                return false
            }
            if (z == "") {
                $(document).scrollTop($(".pro_size", x).offset().top);
                $(".sizeSuitableTips", x).show();
                alert("请选择尺码大小！");
                b = false;
                return false
            }
            if (!shoesSizeValidator(i)) {
                $("input[name=shoesSize]", x).focus().addClass("ipt_txt_error");
                $(".sizeTips", x).html("请正确填写尺码！[14-50]").css({display: "inline-block"});
                alert("请正确填写尺码！");
                b = false;
                return false
            }
            if (!footLengthValidator(s)) {
                $("input[name=footLength]", x).focus().addClass("ipt_txt_error");
                $(".sizeTips", x).html("请正确填写脚长！[80-300]").css({display: "inline-block"});
                alert("请正确填写脚长！");
                b = false;
                return false
            }
            if (!footWidthValidator(n)) {
                $(".sizeTips", x).html("请正确填写脚宽！[40-150]").css({display: "inline-block"});
                $("input[name=footWidth]", x).focus().addClass("ipt_txt_error");
                alert("请正确填写脚宽！");
                b = false;
                return false
            }
            if (!clothesSizeValidator(m)) {
                $(".sizeTips", x).html("请正确填写日常穿着尺码！").show();
                $("input[name=clothesSize]", x).focus().addClass("ipt_txt_error");
                alert("请正确填写日常穿着尺码！");
                b = false;
                return false
            }
            if (!heightValidator(E)) {
                $(".sizeTips", x).html("请正确填写身高！[40-220]").show();
                $("input[name=height]", x).focus().addClass("ipt_txt_error");
                alert("请正确填写身高！");
                b = false;
                return false
            }
            if (!weightValidator(C)) {
                $(".sizeTips", x).html("请正确填写体重！[2-210]").show();
                $("input[name=weight]", x).focus().addClass("ipt_txt_error");
                alert("请正确填写体重！");
                b = false;
                return false
            }
            if (!bustValidator(t)) {
                $(".sizeTips", x).html("请正确填写胸围！").show();
                $("input[name=bust]", x).focus().addClass("ipt_txt_error");
                alert("请正确填写胸围！");
                b = false;
                return false
            }
            if (!waistlineValidator(o)) {
                $(".sizeTips", x).html("请正确填写腰围！").show();
                $("input[name=waistline]", x).focus().addClass("ipt_txt_error");
                alert("请正确填写腰围！");
                b = false;
                return false
            }
            if (!commentValidator(B)) {
                $(".commentTips", x).show();
                $("textarea[name=myComment]", x).focus().addClass("ipt_txt_error");
                alert("请输入评论内容！");
                b = false;
                return false
            }
            var A = checkUserWriteProductComment(p, r, f);
            if (A == true) {
                alert("您已经对该商品点评过，同一订单不能重复点评该商品！");
                b = false;
                return false
            }
            if (A == "flag") {
                alert("登陆超时，请重新登陆！");
                window.location.href = "/signin.jhtml"
            }
            $("input[type=checkbox]:checked", x).each(function () {
                g += $(this).val() + ","
            })
        }
        if (l != "") {
            var D = {commodityId: h, commodityNo: q, commodityImage: j, commodityType: v, prodName: k, orderNumber: p, productNo: r, productSize: w, score: l, sizeSuitable: z, shoesSize: i, footLength: s, footWidth: n, clothesSize: m, myComment: B, height: E, weight: C, bust: t, waistline: o, shineFlag: u, multiFlag: u, plupid: y, mark: f, shareds: g};
            c.push(D)
        }
    });
    if (b && c.length <= 0 && a > 1) {
        $(document).scrollTop($(".rate_comm:first").offset().top);
        alert("请至少点评一个商品!")
    } else {
        if (b && c.length <= 0 && a == 1) {
            $(document).scrollTop($(".rate_comm", $(".pblsh_cmmnt_box", d)).offset().top);
            $(".scoreTips", $(".pblsh_cmmnt_box", d)).show().html("请对商品样式及质量的满意度进行评分！");
            alert("请对商品样式及质量的满意度进行评分！");
            b = false;
            return false
        }
    }
    if (c.length > 0 && b) {
        $.ajax({type: "POST", async: false, url: "/my/commentInfo.jhtml?orderMainNo=" + e, data: {commentDataJson: YouGou.Util.toJsonString(c)}, dataType: "json", success: function (l) {
            if (l.status == "nologin") {
                var o = l.redirect;
                window.location.href = o
            } else {
                if (l.status == "fail") {
                    var o = l.redirect;
                    window.location.href = o
                } else {
                    if (l.status == "ok") {
                        var n = l.commentContent;
                        var j = l.coupondiscr;
                        var k = l.myCouponType;
                        var i = l.myGiftType;
                        var g = l.commentCount;
                        var h = l.integral;
                        var m = l.consultings;
                        $("#succommentContent").val(n);
                        $("#succoupondiscr").val(j);
                        $("#sucmyCouponType").val(k);
                        $("#sucmyGiftType").val(i);
                        $("#succommentCount").val(g);
                        $("#sucintegral").val(h);
                        $("#consultings").val(m);
                        $("#succForm").submit()
                    }
                }
            }
        }})
    }
};