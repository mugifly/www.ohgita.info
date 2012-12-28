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
		contentBlocksNumX = 0;
		navBlocksNumX = 1;
		headerBlocksNumY = 1;

		/**
			Initialize
		**/
		this.init = function () {
			console.log("init()");
			blockHeight = 0;
			blockWidth = 0;
			blocksNumY = 0;
			blocksNumX = 0;
			contentBlocksNumX = 0;

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

			/* Cleanup rows in Header */
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
			console.log("draw()");

			var $parent =  $("body");

			$parent.css('opacity', '0.5');

			blocksNumY = headerBlocksNumY;

			/* Pre-Process for Content blocks  -------------------- */
			
			var $content_articles = $parent.children("section").children("article");//TODO! Refactor

			/* Count a number of Content blocks (Lines) */
			blocksNumY += $content_articles.length;

			/* Count a number of Content blocks (Rows), and Set class to Content blocks */
			$content_articles.each(
				function (i){
					var $blocks = $(this).children("div");
					$blocks.addClass("cell");
					if(contentBlocksNumX < $blocks.length){
						contentBlocksNumX = $blocks.length;
					}
				}
			);

			contentBlocksNumX += 2;
			blocksNumX += contentBlocksNumX;

			/* Minimum size check */
			if(blocksNumX < 5){
				contentBlocksNumX += 5 - blocksNumX;
				blocksNumX = 5;
			}

			if(blocksNumY < 5){
				blocksNumY = 5;
			}

			/* Process for Nav blocks -------------------- */

			var $nav =  $parent.children("nav");
			var $nav_items =$nav.children("ul").children("li");//TODO! Refactor

			/* Count a number of Nav blocks (Lines), and Set class to Nav blocks */
			if(blocksNumY <= ($nav_items.length + headerBlocksNumY)){
				blocksNumY = ($nav_items.length + headerBlocksNumY);
			}
			$nav_items.each(
				function (i){
					var $blocks = $(this);
					$blocks.addClass("cell");
				}
			);
			blocksNumX += navBlocksNumX;

			/* Insert a margin cells (Lines)  */
			while(headerBlocksNumY + $nav_items.length < blocksNumY){
				var $article = $("<li />");
				$article.addClass('cell');
				$article.addClass('blank');
				$article.addClass('auto');
				$nav.children("ul").append($article);
				$nav_items =$nav.children("ul").children("li");//TODO! Refactor
			}

			/* Process for Content blocks -------------------- */

			/* Insert a margin cells (Lines)  */
			while(headerBlocksNumY + $parent.children("section").children("article").length < blocksNumY){
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

					if($blocks.length < contentBlocksNumX){
						Site.insertMarginBlockToLine($article, $blocks.length, contentBlocksNumX);
					}
				}
			);

			/* Process for Header blocks -------------------- */

			var $header = $parent.children("header");
			var $header_h1 = $header.children("h1");
			if($header_h1.length == 1){
				/* Head in to container */
				var $header_h1_container = $('<div class="tophead cell"></div>');
				$header_h1_container.append($header_h1);
				$header.append($header_h1_container);
			}else{ /* If already Head in container... */
				$header_h1 = $header.children("div").children("h1");
			}

			var $header_h2 = $header.children("h2");
			var is_header_cover = false;
			if($header_h2.length == 1){ /* If Sub-head is exist... */
				var $header_h2_container = $('<div class="subhead cell"></div>');
				$header_h2_container.append($header_h2);
				$header.append($header_h2_container);
				is_header_cover = true;
			}else{
				$header_h2 = $header.children("div").children("h2");
				if($header_h2.length == 1){/* If exist & already Head in container... */
					is_header_cover = true;
				}
			}

			if(is_header_cover){
				Site.insertMarginBlockToLine($header, $header.children().length, blocksNumX, "left", "cover");
			}else{
				Site.insertMarginBlockToLine($header, $header.children().length, blocksNumX, "left");
			}

			/* Process for ALL blocks  -------------------- */

			/*  Calculate block size, and set to blocks */

			blockHeight = Math.floor($(window).innerHeight() / blocksNumY);
			$(".cell").css('height',blockHeight);

			blockWidth = Math.floor($("header").innerWidth() / blocksNumX);

			$(".cell").css('width',blockWidth);

			$nav.css('width', blockWidth);

			/* Adjust header -------------------- */

			/* Set font size */
			$header_h1.css('top', '0px');
			for(var size=1;size<100;size+=3){
				$header_h1.css('fontSize', size+'pt');
				if(blockHeight / 2 <= $header_h1.height() ){
					break;
				}
			}
			/* Set top */
			$header_h1.css('top', Math.floor((blockHeight - $header_h1.height()) / 4) - 5 + 'px');

			/* Complete*/
			$parent.css('opacity', '1.0');
			console.log("Complete draw()");
		};

		/**
			Insert margin-block(Row) to line 
		**/
		this.insertMarginBlockToLine = function($line_obj, inner_blocks_num, block_num_x, opt_force_align, opt_classname){

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
				var $item = $('<div class="cell blank auto">&nbsp;</div>');
				if(opt_classname != null){
					$item.addClass(opt_classname);
				}
				$line_obj.prepend($item);
			}

			for(var i=0;i<right_margin_num;i++){
				var $item = $('<div class="cell blank auto">&nbsp;</div>');
				if(opt_classname != null){
					$item.addClass(opt_classname);
				}
				$line_obj.append($item);
			}
		};

	};
	Site.init();

	/* Set event handler */
	$(window).resize(function(){
		Site.init();
	});

});