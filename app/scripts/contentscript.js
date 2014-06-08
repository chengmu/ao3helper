'use strict';

console.log('\'Allo \'Allo! Content script');
console.log(location);
//Ajax
function request(type, url, opts, callback) {
　　var xhr = new XMLHttpRequest();
　　if (typeof opts === 'function') {
　　　callback = opts;
　　　　opts = null;
　　　}
　　xhr.open(type, url);
　　　var fd = new FormData();
　　if (type === 'POST' && opts) {
　　　for (var key in opts) {
　　　　　fd.append(key, JSON.stringify(opts[key]));
　　}
　　　}
　　　xhr.onload = function () {
　　　callback(xhr.response);
　　};
　　　xhr.send(opts ? fd : null);
}


var temp = document.createElement('div');


function getDlModule(res) {
    temp.innerHTML = res;

    return temp.querySelector('.download ul');
}


var url = 'http://archiveofourown.org/works/553082';
request('get', url, getDlModule);



//合并所有页面
var pageIndicatorList = Array.prototype.slice.call(document.querySelectorAll('.navigation.pagination'))[0];
if (pageIndicatorList) {
    var pageIndicator = Array.prototype.slice.call(pageIndicatorList.querySelectorAll('li'));
    var container = document.querySelectorAll('.work.group')[0];
    var temp = document.createElement('div');
    for (var i = 2; i < pageIndicator.length - 1; i++ ) {
        request('get', pageIndicator[i].querySelectorAll('a')[0].href, function (res) {
            temp.innerHTML = res;
            var list = Array.prototype.slice.call(temp.querySelectorAll('li.work'));
            list.forEach(function (el) {
                container.appendChild(el);
            });
        });
    }

}



temp.innerHTML = '';


// 获取所有文章
var artcleList = Array.prototype.slice.call(document.querySelectorAll('li.work'));

artcleList.forEach(function (article) {
    var articleId = article.id;
    var url = article.querySelector('h4 a').href;
    request('get', url, function (res) {
        temp.innerHTML = res;
        article.querySelector('h4').appendChild(temp.querySelector('.download ul li'));
    });
});


//触发下载
var mobis = Array.prototype.slice.call(document.querySelectorAll('h4 li a'));

var dlmobis = [];
for (var j = 0; j < mobis.length; j++ ){
    dlmobis.push(mobis[j]);
}
