$(function(){
	$('.swapImage').hover(
		function(){
			$(this).find('img').addClass('invert');
		}
		, function(){
			$(this).find('img').removeClass('invert');
		}
	);
});