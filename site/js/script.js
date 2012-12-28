/**
	Script for www.ohgita.info
	(C) Masanori Ohgita.
**/

/* On load */
$(function(){
	var Site = new function(){

		blockHeight = 0;
		blockWidth = 0;
		blocksNumY = 0;
		blocksNumX = 0;

		/**
			Initialize
		**/
		this.init = function () {
			console.log("init()");
			blockHeight = 0;
			blockWidth = 0;
			blocksNumY = 0;
			blocksNumX = 0;

			var $parent =  $("body");
			var $header = $parent.children("header");

			/* Cleanup lines */
			$parent.children("section").children(".auto").each(function(i){
				$(this).remove();
			});

			/* Cleanup rows */
			$parent.children("section").children('article').children('.auto').each(function(i){
				$(this).remove();
			});
			$header.children().children('article').children('.auto').each(function(i){
				$(this).remove();
			});

			/* Draw */
			this.draw();

			console.log('Complete init()');
		};

		/**
			Draw
		**/
		this.draw = function () {
			console.log("init()");

			var $parent =  $("body");

			$parent.css('opacity', '0.5');

			/* Process for Nav blocks ---------- */
			
			var $nav_items = $parent.children("nav").children("ul").children("li");//TODO! Refactor

			/* Count a number of blocks (Lines) */
			if(blocksNumY <= $nav_items.length){
				blocksNumY = $nav_items.length + 1;
			}

			/* Process for Content blocks ---------- */

			var $content_articles = $parent.children("section").children("article");//TODO! Refactor
			
			/* Count a number of blocks (Lines) */
			if(blocksNumY <= $content_articles.length){
				blocksNumY += 1;
			}
			blocksNumY += 1;

			/* Count a number of blocks (Rows), and Set class to blocks */
			$content_articles.each(
				function (i){
					var $blocks = $(this).children("div");
					$blocks.addClass("cell");
					if(blocksNumX < $blocks.length){
						blocksNumX = $blocks.length;
					}
				}
			);
			blocksNumX += 4;

			/* Insert a margin cells (Lines)  */
			while($parent.children("section").children("article").length < blocksNumY){
				var $article = $("<article />");
				$article.addClass('auto');
				$parent.children("section").append($article);
			}

			/* Insert a margin cells (Rows)  */
			$content_articles = $parent.children("section").children("article");//TODO! Refactor
			$content_articles.each(
				function (i){
					var $article = $(this); 
					var $blocks = $article.children("div");

					if($blocks.length < blocksNumX){
						Site.insertMarginBlockToLine($article, $blocks.length, blocksNumX);
					}
				}
			);

			/* Process for Header blocks ---------- */

			var $header = $parent.children("header");
			var $header_h1 = $header.children("h1");
			console.log($header_h1);
			if($header_h1.length == 1){
				var $header_h1_container = $('<div class="sitename cell"></div>');
				$header_h1_container.append($header_h1);
				$header.append($header_h1_container);
			}
			Site.insertMarginBlockToLine($header, $header.children().length, blocksNumX, "left");

			/* Set size to blocks ---------- */

			blockHeight = Math.floor($(document).innerHeight() / blocksNumY);
			$(".cell").css('height',blockHeight);

			blockWidth = Math.floor($("header").innerWidth() / blocksNumX);
			$(".cell").css('width',blockWidth);

			/* Adjust header ---------- */

			/* Set font size */
			$header_h1.css('top', '0px');
			for(var size=0;size<100;size+=3){
				$header_h1.css('fontSize', size+'pt');
				if(blockHeight / 2 <= $header_h1.height() ){
					break;
				}
			}
			/* Set top */
			$header_h1.css('top', Math.floor((blockHeight - $header_h1.height()) / 4) - 5 + 'px');

			/* Complete*/
			$parent.css('opacity', '1.0');
		};

		/**
			Insert margin-block(Row) to line 
		**/
		this.insertMarginBlockToLine = function($line_obj, inner_blocks_num, block_num_x, opt_force_align){

			/* Insert block*/
			var left_margin_num = Math.floor((block_num_x - inner_blocks_num) / 2);
			var right_margin_num = Math.ceil((block_num_x - inner_blocks_num) / 2);/* right side, give priority. */

			if(opt_force_align != null && opt_force_align == "left"){
				right_margin_num += left_margin_num;
				left_margin_num = 0;
			} else if(opt_force_align != null && opt_force_align == "right") {
				left_margin_num += right_margin_num;
				right_margin_num = 0;
			}

			for(var i=0;i<left_margin_num;i++){
				$line_obj.prepend('<div class="cell blank auto">&nbsp;</div>');
			}

			for(var i=0;i<right_margin_num;i++){
				$line_obj.append('<div class="cell blank auto">&nbsp;</div>');
			}
		};

	};
	Site.init();

	/* Set event handler */
	$(window).resize(function(){
		Site.init();
	});

});