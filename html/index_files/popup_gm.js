var $ = jQuery.noConflict();

$(function() {


	function popup_gm(popupid, overlay_id , onexit) {

		$(".step1, .step2, .step3").css({
			'-moz-user-select': 'none'
			,'-o-user-select': 'none'
			,'-khtml-user-select': 'none'
			,'-webkit-user-select': 'none'
			,'-ms-user-select': 'none'
			,'user-select': 'none'
		});



		$(".popupclose").click(function() {

			$(overlay_id).fadeOut( "normal" );

			$(popupid).fadeOut( "normal" );

			$("body").removeClass("noscroll");

		});


		$(".yes").click(function() {
			$(".step1").fadeOut( "fast" );
			$(".step2").fadeIn( "fast" );
		});

		$(".no").click(function() {
			$(".step1").fadeOut( "fast" );
			$(".step3").fadeIn( "fast" );
		});


		if (onexit == 1) {

			if ($.cookie('first') == undefined) $.cookie('first', new Date().getTime(),{expires: 31});

            if ($.cookie('popup') != "no") {
				var now = new Date().getTime();

				var y_old = 99999; var x_old = 99999;

				var y_curr = 99999; var x_curr = 99999;

				var w1 = $( window ).width();

				$(document).mousemove(function(e){

					if ($.cookie('popup') != "no") {

						y_curr = e.pageY - window.pageYOffset;

						x_curr = e.pageX;

						var x_small = 0;

						if (y_curr < 30 && x_curr > x_small && y_old > y_curr && x_old < x_curr) { 

$("body").addClass("noscroll");

						$(popupid).css({top:window.pageYOffset + ($(window).height() / 2) + 'px',left:'50%',margin:'-'+($(popupid).height() / 2)+'px 0 0 -'+($(popupid).width() / 2)+'px'});

							$(popupid).fadeIn( "slow" );

							$(overlay_id).fadeIn( "fast" );

							$.cookie('popup', 'no',{expires: 31});


							yaCounter21768574.reachGoal('show_popup1');
						}

						y_old = y_curr;

						x_old = x_curr;

						w1 = $( window ).width();
					}
				});

		}

		}

		if (onexit == 0) {
			if ($.cookie('first') == undefined) $.cookie('first', new Date().getTime(),{expires: 31});
			if ($.cookie('popup') != "no") {
				var now = new Date().getTime();
				setTimeout(function(){
					$(popupid).fadeIn( "normal" );
					$(overlay_id).fadeIn( "fast" );
					$.cookie('popup', 'no',{expires: 31});
				}, 8000 - (now - $.cookie('first'))/1000 + 2000);
				yaCounter21768574.reachGoal('show_popup1');
			}
		}
	}


var variant = 0;

 var variant1 = $.ajax({
                    url: "https://geniusmarketing.me/ab.txt",
                    async: false
                 }).responseText;


 
 if (variant == "0") {
 		popup_gm("#pp_gm", "#overlay", "1");
 		try { yaCounter21768574.reachGoal('show_popup');} catch(e) {}

$.ajax({
    url : "https://geniusmarketing.me/set.php",
    type: "POST",
    data : "znach=0"
});

 }


 if (variant == "1") {
 		popup_gm("#pp_gm1", "#overlay", "1");
 		try { yaCounter21768574.reachGoal('show_popup2');} catch(e) {}

$.ajax({
    url : "https://geniusmarketing.me/set.php",
    type: "POST",
    data : "znach=0"
});

 }


 if (variant == "2") {
 		popup_gm("#pp_gm2", "#overlay", "1");
 		try {yaCounter21768574.reachGoal('show_popup3');} catch(e) {}
 
$.ajax({
    url : "https://geniusmarketing.me/set.php",
    type: "POST",
    data : "znach=0"
});

 }



});