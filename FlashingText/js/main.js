(function ($) {
    $.fn.typewriter = function () {
        var $ele = $(this), str = $ele.html(), progress = 0;
        $ele.html('');
        var timer = setInterval(function () {
            var current = str.substr(progress, 1);
            if (current == '<') {
                progress = str.indexOf('>', progress) + 1;
            } else {
                progress++;
            }
            $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
            if (progress >= str.length) {
                clearInterval(timer);
            }
        }, 75);
    };
})(jQuery);


/*function typewriter(id){
    var $ele = document.getElementById(id);
    var str = $ele.innerHTML, progress = 0;
    $ele.innerHTML = '';
    var timer = setInterval(function() {
        var current = str.substr(progress, 1);
        if (current == '<') {
            progress = str.indexOf('>', progress) + 1;
        } else {
            progress++;
        }
        $ele.innerHTML =str.substring(0, progress) + (progress & 1 ? '_' : '');
        if (progress >= str.length) {
            clearInterval(timer);
        }
    }, 75);
}
$(function () {
    typewriter("code");
});*/
