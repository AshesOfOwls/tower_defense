/*
* jQuery.fn._hittest();
*
* The ActionScript 2 function as jQuery function.
*
* See if [jQuery Object] hits another [jQuery Object]
* $('.element')._hittest( $('.hit') );
*
* Version 0.9.1
* www.labs.skengdon.com/_hittest
* www.labs.skengdon.com/_hittest/js/_hittest.min.js
*/
;(function($){$.fn._hittest=function(hit,longReturn){object=this;if(!object.length)return false;if(!hit.length)return false;if(longReturn){var ret=[];var retCount=0;};for(var i=0;i<object.length;i++){var o={};h={};o.x=[];o.y=[];h.x=[];h.y=[];o.x[0]=$(object.get(i)).offset().left;o.x[1]=o.x[0]+$(object.get(i)).width();o.y[0]=$(object.get(i)).offset().top;o.y[1]=o.y[0]+$(object.get(i)).height();for(var y=0;y<hit.length;y++){h.x[0]=$(hit.get(y)).offset().left;h.x[1]=h.x[0]+$(hit.get(y)).width();h.y[0]=$(hit.get(y)).offset().top;h.y[1]=h.y[0]+$(hit.get(y)).height();if(object.get(i)!=hit.get(y)){if((_hittest_between(h.x[0],o.x[0],o.x[1]))&&(_hittest_between(h.y[0],o.y[0],o.y[1]))){if(longReturn){ret[retCount]={};ret[retCount].o=object.get(i);ret[retCount].h=hit.get(y);retCount++;}else{return true;}};if((_hittest_between(h.x[0],o.x[0],o.x[1]))&&(_hittest_between(h.y[1],o.y[0],o.y[1]))){if(longReturn){ret[retCount]={};ret[retCount].o=object.get(i);ret[retCount].h=hit.get(y);retCount++;}else{return true;}};if((_hittest_between(h.x[1],o.x[0],o.x[1]))&&(_hittest_between(h.y[0],o.y[0],o.y[1]))){if(longReturn){ret[retCount]={};ret[retCount].o=object.get(i);ret[retCount].h=hit.get(y);retCount++;}else{return true;}};if((_hittest_between(h.x[1],o.x[0],o.x[1]))&&(_hittest_between(h.y[1],o.y[0],o.y[1]))){if(longReturn){ret[retCount]={};ret[retCount].o=object.get(i);ret[retCount].h=hit.get(y);retCount++;}else{return true;}};}}};if((longReturn)&&(ret.length>0)){return ret;}else{return false;}};_hittest_between=function(n,b1,b2){if(typeof n!=='number')return false;if(typeof b1!=='number')return false;if(typeof b2!=='number')return false;if((b1<=n)&&(b2>=n))return true;return false;};})(jQuery);