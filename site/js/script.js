/**
	Script for www.ohgita.info
	(C) Masanori Ohgita.
**/

/* On load */
$(function(){

	/**
		Initialize
	**/
	function init() {
		console.log("init()");
		var $parent =  $("body");

		/* Process for Content blocks ---------- */
		
		var $content_articles = $parent.children("article");
		
		/* Counting number of blocks (Lines) */
		var block_num_y = $content_articles.length;

		/* Counting number of blocks (Rows) */
		var block_num_x = 0;
		$content_articles.each(
			function (i){
				var $blocks = $(this).children("div");
				if(block_num_x < $blocks.length){
					block_num_x = $blocks.length;
				}
			}
		);



	};

	init();
});