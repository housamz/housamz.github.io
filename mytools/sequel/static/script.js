// ===== Preloader ====
// a dirty trick to hide the preloader after D3 finished working
var finishedloading = false;

$(window).on('load', function(){
	var myTimer = setInterval(function(){
		if (finishedloading == true){
			$('#preloader').fadeOut('slow',function(){$(this).remove();});
			clearInterval(myTimer);
		}
	}, 1000);
});

// ===== Scroll to Top ==== 
$(window).scroll(function() {
	if ($(this).scrollTop() >= 50) {
		$('#return-to-top').fadeIn(200);
	} else {
		$('#return-to-top').fadeOut(200);
	}
});
$('#return-to-top').click(function() {
	$('body,html').animate({
		scrollTop : 0
	}, 500);
});


