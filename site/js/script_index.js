$(function(){
	$(".segm").css('opacity','0.0');
	$(".segm").each(function(){
		$(this).addClass('segm2')
	});
	anim0_flg = 0;
	anim0_i = 0;
	timer0 = setInterval(function(){
		if(anim0_flg == 0){
			if(anim0_i < $(".segm2").length){
				var obj = $(".segm2")[anim0_i];
				$(obj).css('opacity',1.0);
				if(anim0_i == 25){
					$(obj).removeClass('segm');
				}
				anim0_i++;
				return;
			}
			anim0_i = 0;
			anim0_flg = 1;
		}else if(anim0_flg == 1){
			while(anim0_i < 20){
				anim0_i++;
				return;
			}
			anim0_i = 0;
			anim0_flg = 2;
		}else if(anim0_flg == 2){
			if(anim0_i < $(".segm2").length){
				var obj = $(".segm2")[anim0_i];
				$(obj).css('opacity',1.0);
				if(anim0_i == 24){
					$(obj).removeClass('segm');
				}else if(anim0_i == 25){
					$(obj).addClass('segm');
				}
				anim0_i++;
				return;
			}
			anim0_i = 0;
			anim0_flg = 3;
		}else if(anim0_flg == 3){
			if(anim0_i < $(".segm2").length){
				var obj = $(".segm2")[anim0_i];
				if(anim0_i != 24){
					$(obj).removeClass('segm');
					$(obj).addClass('segm_new');
				}
				anim0_i++;
				return;
			}
			anim0_i = 0;
			anim0_flg = 4;
		}
    },10);
});