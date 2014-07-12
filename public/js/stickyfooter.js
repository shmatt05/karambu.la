;(function ($) {

    $.fn.stickyfooter = function (options) {

        // Settings
        var settings = $.extend(
                {
                    // Height in pixels of drawer in "closed" state
                    visible: 60,
                    // ID of toggle element that opens/closes drawer
                    toggleCSSSelector: '#Toggle',
                    // Class added to toggle to indicate it it open/closed
                    drawerOpenCSSClass: 'open',
                    // Callback to set toggle state to inactive
                    inactiveToggle_Callback: function() {
                        $(settings.toggleCSSSelector).animate({'opacity':'0.2'});
                    },
                    // Callback to set toggle state to active
                    activeToggle_Callback: function() {
                        $(settings.toggleCSSSelector).animate({'opacity':'1.0'});
                    },
                    // Callback to add class to toggle to indicate open state
                    drawerOpen_Callback: function() {
                        $(settings.toggleCSSSelector).addClass(settings.drawerOpenCSSClass);
                    },
                    // Callback to add class to toggle to indicate closed state
                    drawerClosed_Callback: function() {
                        $(settings.toggleCSSSelector).removeClass(settings.drawerOpenCSSClass);
                    }
                }, options ),

        // Global vars
            $window = $(window),
            $footer = $(this),
            _drawerOpen = false,

        // Functions
            setFooterPos = function(firstRun) {

                var footerTopPos = ($footer.height()) * -1,
                    availableHeight = $(document).height() - $window.height(),
                    kickInPos = $window.scrollTop() + $footer.height() - settings.visible;

                // Set to pos fixed bottom if content less than window height
                if ((availableHeight <= 0)) {
                    $footer.stop().css({position: 'fixed', left: '0px', bottom: 0});
                    settings.inactiveToggle_Callback();
                } else {
                    // Set to pos relative if footer visible
                    if ((availableHeight <= kickInPos) && ($footer.css('position') != 'relative' || firstRun)) {
                        $footer.stop().css({position: 'relative', bottom: 'auto'});
                        settings.inactiveToggle_Callback();
                        // Set to pos fixed if footer NOT visible
                    } else if ((availableHeight > kickInPos) && ($footer.css('position') != 'fixed' || firstRun)) {
                        if (firstRun) {
                            $footer.stop().css({position: 'fixed', left: '0px', bottom: footerTopPos}).animate({'bottom': footerTopPos + settings.visible})
                        } else {
                            $footer.stop().css({position: 'fixed', left: '0px', bottom: footerTopPos + settings.visible});
                        }
                        settings.activeToggle_Callback();
                    }
                }

            };

        return this.each(function() {

            if (($.browser.msie && $.browser.version <= 6) || navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod') {

                // Not supported

            } else {

                $footer.wrap('<div></div>').parent().css({'width': '100%', 'height':$footer.height()});
                $window.bind('scroll.stickyfooter resize.stickyfooter', function () {
                    if (!_drawerOpen) setFooterPos(false);
                });
                $(settings.toggleCSSSelector).bind('click', function(e) {
                    e.preventDefault();
                    if ($footer.css('position') != 'relative') {
                        if (_drawerOpen) {
                            $footer.stop().animate({ bottom:
                                Math.min(
                                    $footer.height() - settings.visible,
                                    $(document).height() - $window.height() - $window.scrollTop()
                                ) * -1 });

                            settings.drawerClosed_Callback();
                            _drawerOpen = false;
                        } else {
                            $footer.stop().animate({bottom: $footer.height() - $footer.height()});
                            settings.drawerOpen_Callback();
                            _drawerOpen = true;
                        }
                    }
                });
                setFooterPos(true);

            }

        });


    };

})(jQuery);

$( document ).ready(function(){

    $('#Footer').stickyfooter();

});