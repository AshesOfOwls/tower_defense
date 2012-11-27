(function($) {
    $.extend({ _SpriteWrapper: {
        SpriteAnimationDirection: { ltr: 'ltr', rtl: 'rtl' },
        SpriteAnimationState: { running: 1, pause: 2 },
        SpriteAnimation: function(jq) {
            this.jq = jq;
        }
    }
    });
    $._SpriteWrapper.SpriteAnimation.prototype = {
        frameWidth: 0,  // the frameWidth is used to define the offset that we apply on each tick to create the movement feeling.
        jq: null,
        _loop: true,
        startFrame: 0,
        endFrame: 0,
        direction: $._SpriteWrapper.SpriteAnimationDirection.ltr,
        _currentFrame: -1,
        interval: 50,   // 20 Hertz
        _timerId: null,
        _tickDelegate: null,
        numberOfLoops: 1,
        _loopsCount: 0,
        state: $._SpriteWrapper.SpriteAnimationState.running,
        //
        // start the animation by creating an interval call to the tick function using setTimeout
        //
        start: function() {
            this._loopsCount = 1;
            this._loop = this.numberOfLoops < 0;
            this._currentFrame = this.startFrame;
            this.state = $._SpriteWrapper.SpriteAnimationState.running;
            this._tickDelegate = Function.CreateDelegate(this, this._tick);
            clearTimeout(this._timerId);
            this._timerId = setTimeout(this._tickDelegate, this.interval);
        },
        //
        // - Sets the background position according to the currentFrame where the left position is: -(this._currentFrame * this.frameWidth)
        // - When we reach the final frame if it is loop animation we start over from the begning (currentFrame=startFrame),
        // - otherwise if it is not loop we stop the animation
        //
        _tick: function() {

            if (this.state == $._SpriteWrapper.SpriteAnimationState.running) {
                this.jq.css("background-position", (-(this._currentFrame * this.frameWidth) + "px 0px"));

                this._timerId = setTimeout(this._tickDelegate, this.interval);
                if (this._currentFrame == this.endFrame) {
                    if (this._loop || this._loopsCount < this.numberOfLoops) {

                        this._loopsCount++;
                        this._currentFrame = this.startFrame;
                    }
                    else {
                        this.stop();
                    }
                }
                this._currentFrame = this.direction == $._SpriteWrapper.SpriteAnimationDirection.ltr ? this._currentFrame + 1 : this._currentFrame - 1;

            }
        },
        stop: function() {
            clearTimeout(this._timerId);
        }
    };
    $._SpriteWrapper.SpriteAnimation.apply = function(data) {
        var sa = new $._SpriteWrapper.SpriteAnimation(data.jq);
        sa.frameWidth = data.frameWidth;
        sa.startFrame = data.startFrame;
        sa.endFrame = data.endFrame;
        sa.direction = data.direction;
        sa.numberOfLoops = data.numberOfLoops;
        sa.interval = data.interval;
        // when not loop, the animation will be executed once. Set timeout to allow proper view of the animation
        sa.start();
        return sa;
    };
})(jQuery);
//
// plugin definition
//
(function($) {
    //
    // create closure
    //
    $.fn.spriteAnimation = function(options) {

        var opts = $.extend({}, $.fn.spriteAnimation.defaults, options);

        return this.each(function() {
            $this = $(this);

            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

            if (typeof o.frameWidth == 'undefined')
                o.frameWidth = $this.width();
            o.jq = $this;
            
            // the element already has a background
            if (typeof o.imageSrc == 'undefined') {
                
                $._SpriteWrapper.SpriteAnimation.apply(o);
            }

            else {
                // the element does not have a background
                // we create the image object and assign the background-image attribute
                var newImg = new Image();
                newImg.src = o.imageSrc;
                newImg.onload = function() {
                o.jq.css('background-repeat', "repeat-x");
                o.jq.css('background-image', "url('" + o.imageSrc + "')");
                $._SpriteWrapper.SpriteAnimation.apply(o);
                };
            }
        });
    };

    //
    // function for creating delegate
    //
    if (!Function.CreateDelegate) {
        Function.CreateDelegate = function(instance, method) {
            return function() {
                method.apply(instance, arguments);
            }
        }
    }
    //
    // plugin defaults
    //
    $.fn.spriteAnimation.defaults = {
    //
    // - By defining the 'imageSrc' the plugin will automatically set all the matched elements' background image to the specified url.
    // - The endFrame value is set to -1 as default, this value is expected to be set always and not to be left to default. 
    // - If the direction is rtl instead of ltr the endFrame value should be less than the startFrame to create the correct animation.
    // - When numberOfLoops is reached the animation will stop, for specifiyng infinite loop this number should be less than zero.
    //
        numberOfLoops:-1,
        startFrame: 0,
        endFrame:-1,
        direction: 'ltr',
        interval: 50  // 20 Hertz
    };
    //
    // end of closure
    //
})(jQuery);