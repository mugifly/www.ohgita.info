/**
	Script for www.ohgita.info
	(C) Masanori Ohgita.
**/
/* On load */
$(function(){
	var Site = new function(){

		IS_ENABLE_AJAX = false;

		blocksNumX_MIN = 6;
		blocksNumY_MIN = 6;

		isSingleBlock = false;
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
			isSingleBlock = false;
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

			if(blocksNumY <= 2 && contentBlocksNumX == 1){	/* Single block mode */
				isSingleBlock = true;
				blocksNumX += contentBlocksNumX;

			} else {	/* Normal mode */
				contentBlocksNumX += 2;
				blocksNumX += contentBlocksNumX;

				/* Minimum size check */
				if(blocksNumX < blocksNumX_MIN){
					contentBlocksNumX += blocksNumX_MIN - blocksNumX;
					blocksNumX = blocksNumX_MIN;
				}

				if(blocksNumY < blocksNumY_MIN){
					blocksNumY = blocksNumY_MIN;
				}
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
					$blocks.addClass("flicker");
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

			if(isSingleBlock == false){/* Normal mode */

				/* Insert a margin cells (Lines)  */
				while(headerBlocksNumY + $parent.children("section").children("article").length < blocksNumY){
					var $article = $("<article />");
					$article.addClass('auto');
					$parent.children("section").append($article);
				}

				/* Insert a margin cells (Rows) , and Set class to content blocks */
				$content_articles = $parent.children("section").children("article");//TODO! Refactor
				$content_articles.each(
					function (i){
						var $article = $(this); 
						var $blocks = $article.children("div");
						$blocks.addClass("flicker");

						if($blocks.length < contentBlocksNumX){
							Site.insertMarginBlockToLine($article, $blocks.length, contentBlocksNumX);
						}
					}
				);

			}

			/* Process for Footer -------------------- */
			var $footer = $parent.children("footer");
			footer_height = $footer.outerHeight();

			/* Process for Header blocks -------------------- */

			var $header = $parent.children("header");
			var $header_h1 = $header.children("h1");
			if($header_h1.length == 1){
				/* Head in to container */
				var $header_h1_container = $('<div class="tophead cell flicker"></div>');
				$header_h1_container.append($header_h1);
				$header.append($header_h1_container);
				$header_h1 = $header.children("div").children("h1");
			}else{ /* If already Head in container... */
				$header_h1 = $header.children("div").children("h1");
			}

			var $header_h2 = $header.children("h2");
			var is_header_cover = false;
			if($header_h2.length == 1){ /* If Sub-head is exist... */
				var $header_h2_container = $('<div class="subhead cell"></div>');
				$header_h2_container.append($header_h2);
				$header.append($header_h2_container);
				$header_h2 = $header.children("div").children("h2");
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

			/* Calculate block border & padding size */

			var blocks_padding_y =  ($(".cell:first").outerHeight() - $(".cell:first").innerHeight()) * blocksNumY;
			var blocks_padding_x =  ($(".cell:first").outerWidth() - $(".cell:first").innerWidth()) * blocksNumX;

			/*  Calculate block size, and set to blocks */

			blockHeight = Math.floor(($(window).innerHeight() - blocks_padding_y - footer_height) / blocksNumY);
			$(".cell").css('height',blockHeight);

			if(isSingleBlock){/* Single block mode */

				/* Reset height to content block */
				$content_articles.children('div').css('height', 'auto');

				/* Calculate width & Set to ALL block */

				blockWidth += Math.floor($("header").innerWidth() / 10);
				$(".cell").css('width',$("header").innerWidth() - blockWidth);

				/* Set width to Header block */
				$header_h1.parent().css('width', blockWidth);

				/* Set width to Nav blocks */
				$nav_items.each(
					function (i){
						$(this).css('width', blockWidth);
					}
				);
				/* Set to Nav bar */
				$nav.css('width', blockWidth);

			}else{/* Normal Mode */

				/* Calculate width & Set to ALL blocks */
				blockWidth = Math.floor(($("header").innerWidth() - blocks_padding_x) / blocksNumX);
				$(".cell").css('width',blockWidth + 'px');

				/* Calculate width with include surplus */
				blockwidth_surplus = blockWidth + $("header").innerWidth() - (blockWidth * blocksNumX);

				/* Set width to Header Sitename */
				$header_h1.parent().css('width', blockwidth_surplus + 'px');

				/* Set width to Nav bar */
				$nav.css('width', blockwidth_surplus + 'px');

				/* Set width to Nav blocks */
				$nav_items.each(
					function (i){
						$(this).css('width', blockwidth_surplus + 'px');
					}
				);

			}

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

			/* Link -------------------- */

			/* Set event handler to link */
			if(IS_ENABLE_AJAX){
				$parent.find('a').click(function(){
					var href = ($(this).attr('href'));
					if(href != null & href.match(/\http:\/\/.*/i) != false){ /* Internal link */
						Site.loadPage(href);
						return false;
					}
					return true;
				});
			}

			/* Complete*/
			$parent.css('opacity', '1.0');
			console.log("Complete draw()");
		};

		/**
			Load page
		**/
		this.loadPage = function(a_url){
			$.ajax({
				type: 'GET',
				url: a_url,
				timeout: 5000,
				success: function(data){
					/* Remove header */
					$('body').children('header').remove();
					/* Remove nav */
					$('body').children('nav').remove();
					/* Remove section(content) */
					$('body').children('section').remove();
					/* Remove footer */
					$('body').children('footer').remove();

					/* Load a receive data to dummy */
					var $dummy = $('<div />');
					$('body').append($dummy);
					$dummy.html(data);

					/* Append HTML head */
					var head = $dummy.find("head");
					console.log(head);
					$('head').append(head);

					/* Append Header */
					var header = $dummy.find("header");
					$('body').append(header);

					/* Append Nav */
					var nav = $dummy.find("nav");
					$('body').append(nav);

					/* Append section(content) */
					var section = $dummy.find("section");

					section.each(function(){
						$('body').append($(this));
					});

					/* Append Footer */
					var footer = $dummy.find("footer");
					$('body').append(footer);

					$dummy.remove();

					Site.init();
				 },
				 error: function(XMLHttpRequest, textStatus, errorThrown){
				 	location.href = a_url;
				 }
			});
			return false;
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