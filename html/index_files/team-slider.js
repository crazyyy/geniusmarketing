var $ = jQuery.noConflict();

$(function(){

    var width = 200;
    var count = 1; 

    var carousel = document.getElementById('carousel');
    var list = carousel.querySelector('ul.images');
    var listElems = carousel.querySelectorAll('li.team-member');

    var position = 0; 

    carousel.querySelector('.prev').onclick = function() {

      position = Math.min(position + width * count, 0)
      list.style.marginLeft = position + 'px';
    };

    carousel.querySelector('.next').onclick = function() {
      position = Math.max(position - width * count, -width * (listElems.length - count));
      list.style.marginLeft = position + 'px';
    };
});