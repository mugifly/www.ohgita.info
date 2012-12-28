/**
	Loader script for www.ohgita.info
	(C) Masanori Ohgita.
**/

/* Load libraries and stylesheets, all at once. */

var isMSIE = /*@cc_on!@*/false;
if (isMSIE){
	document.write('<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>');
}

document.write('<link rel="stylesheet" href="/stylesheets/normalize.css" />');
document.write('<link rel="stylesheet/less" type="text/css" href="/stylesheets/style.less" />');

document.write('<script type="text/javascript" src="/js/jquery-1.8.3.min.js"></script>');
document.write('<script type="text/javascript" src="/js/less-1.3.1.min.js"></script>');

document.write('<script type="text/javascript" src="/js/script.js"></script>');
