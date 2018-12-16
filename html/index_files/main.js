var $ = jQuery.noConflict();

$(function(){
    $(".m_frm .subm1").click(function(e) {
            var is_phone = false;
            if ($(".m_frm .phone1").val() != '') {
                is_phone = true;
            }
            if ($(".m_frm .phone2").val() != '') {
                is_phone = true;
            }
            if ($(".m_frm .phone3").val() != '') {
                is_phone = true;
            }
            if (is_phone == true) {
                if ($(".m_frm .phone1").val() == '') {
                    alert('Вы ввели телефон не полностью!');
                    e.preventDefault();
                    return false;
                }
                if ($(".m_frm .phone1").val() == '') {
                    $(".m_frm .phone1").val('+38');
                }
                if ($(".m_frm .phone2").val() == '') {
                    $(".m_frm .phone2").val('123');
                }

                var part1 = $(".m_frm .phone1").val();
                var part2 = $(".m_frm .phone2").val();
                var part3 = $(".m_frm .phone3").val();
                var last = part1 + part2 + part3;
                $(".last1").val(last);
            }
            ;


        });

        /*$('.NumGroup').groupinputs();*/

        $('.NumGroup').on('input propertychange', function(e) {
            var elem = $(e.target),
                    value = elem.val(),
                    caret = elem.caret(),
                    newValue = value.replace(/[^0-9+]/g, ''),
                    valueDiff = value.length - newValue.length;

            if (valueDiff) {
                elem
                        .val(newValue)
                        .caret(caret.start - valueDiff, caret.end - valueDiff);
            }
        });


    // navigation bar collapse
    $('.nav-md').on('click', function(){
        $('.menu').toggle(300);
        $('.collapse-btn').toggleClass('collapse-btn-active');
        $('.collapse-btn-sm').toggleClass('collapse-btn-sm-active');
    });

    // masonry init
    /*$('.success-grid').masonry({
        itemSelector: '.success-grid-item'
    });*/

    //vacancies show button
    $('.required-show').on('click', function(){
        $(this).prev('.required-hidden').toggle(400);
        $(this).text(function(i, text){
            return text === "Читать полностью ▼" ? "Закрыть ▲" : "Читать полностью ▼";
        })
    });

    //popups
    $('#button-start').on('click', function(){
        $("#modal-start").show(200);
    });
    $('#button-scale').on('click', function(){
        $("#modal-scale").show(200);
    });
    $('#button-about-us').on('click', function(){
        $("#modal-about-us").show(200);
    });
    $('#button-about-us-2').on('click', function(){
        $("#modal-about-us").show(200);
    });

    $(".popup-close").click(function(){
        $(".modal-overlay").fadeOut();
    });
    /*$(".modal-content").click(function(e){
        e.stopPropagation();
    });*/

    $('#modal-about-us form').on('submit', function( e ) {
            e.preventDefault();
            var form = $('#modal-about-us');
            form.find('#thank-text').html('Спасибо!');
			form.find('#thank-text-2').html('Наша команда свяжется с вами в ближайшее время!');
            form.find('.frm').css("display","none");
			form.find('span.skr').css("display","none");
			form.find('.modal-content div').css("display","none");
			form.find('div.modal-content').animate({height: 170}, 500);
			setTimeout(function(){
                $('.modal-overlay').css("display","none");
            }, 2000);
			});
    //review forms
    $('#tog').click(function(){
        $('#toggler').toggle('slow');
    });
    $('#tog2').click(function(){
        $('#toggler2').toggle('slow');
    });

    //scroll to top
    $(window).scroll(function() {
        if($(this).scrollTop() > 1000 ) {

            $('#Go_Top').fadeIn();
        } else {

            $('#Go_Top').fadeOut();

        }

    });

    $('#Go_Top').click(function() {

        $('body,html').animate({scrollTop:0},800);

    });

    

});

