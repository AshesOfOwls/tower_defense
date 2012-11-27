(function($){

    $.fn.extend({ 

        spriteStart: function(options) {
 
            var defaults = {
                width: 25,
                speed: 150,
				totalFrames: 6,
				frame: 1,
				state: 'stop'
            };
             
            var options = $.extend(defaults, options);
         
            return this.each(function() {
                var obj = $(this);
				var o = options;
               
				var animate = setInterval(function() {
						if(o.frame == o.totalFrames) {
							o.frame = 0;
						}
						var position = o.width * o.frame;
						obj.css({backgroundPosition: '-'+position+'px 0px'});
						o.frame++;
				}, o.speed);
            });
        }
		
    });
    
})(jQuery);