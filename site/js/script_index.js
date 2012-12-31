$(function(){
	$(".segm").css('opacity','0.0');
	setTimeout(function(){
		$(".segm").each(function(){
			$(this).css('opacity','1.0');
		});
    },1000);
});