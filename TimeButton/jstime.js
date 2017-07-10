var myOpinion = myOpinion || {};
myOpinion.prototype={
    init:function(obj,i){
        alert('hello');
    },
    closeWindow:function(obj,d){
        obj.click(function(){
            d.hide();
        });
    }
}
$(function(){
    var my = myOpinion.prototype;
    my.init($(".z-sidebar li em"),$("#contact"));
    $("#contact").add(my.closeWindow($(".z-sidebar li em"),$("#contact")));

});