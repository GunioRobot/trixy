     

( function( $ ) {
	
	$.scrollFollow = function ( box, options )
	{
		function ani( box, iTop )
		{		
			$( box ).dequeue();
							
			var pageScroll = $( document ).scrollTop();
			var parentTop = $( cont ).offset().top;
			var parentHeight = $( cont ).height();
			var boxTop = $( box ).offset().top;
			var boxHeight = box.offsetHeight;
			var aniTop;
			
			if ( isActive )
			{
				aniTop = Math.min( ( Math.max( ( parentTop + iTop ), ( pageScroll + options.offset ) ) - parentTop ), ( parentHeight - boxHeight ) );
	
				$( box ).animate(
					{
						top: aniTop
					}, options.speed, options.easing
				);
			}
		};
		
		// For user-initiated stopping of the slide
		var isActive = true;
		
		if( $.cookie( 'scrollFollowSetting' + $( box ).attr( 'id' ) ) == 'false' )
		{
			var isActive = false;
			
			$( '#' + options.killSwitch ).text( options.offText )
				.toggle( 
					function ()
					{
						isActive = true;
						
						$( this ).text( options.onText );
						
						$.cookie( 'scrollFollowSetting' + $( box ).attr( 'id' ), true, { expires: 365, path: '/'} );
					},
					function ()
					{
						isActive = false;
						
						$( this ).text( options.offText );
						
						$( box ).animate(
							{
								top: initialTop
							}, 0
						);	
						
						$.cookie( 'scrollFollowSetting' + $( box ).attr( 'id' ), false, { expires: 365, path: '/'} );
					}
				);
		}
		else
		{
			$( '#' + options.killSwitch ).text( options.onText )
				.toggle( 
					function ()
					{
						isActive = false;
						
						$( this ).text( options.offText );
						
						$( box ).animate(
							{
								top: initialTop
							}, 0
						);	
						
						$.cookie( 'scrollFollowSetting' + $( box ).attr( 'id' ), false, { expires: 365, path: '/'} );
					},
					function ()
					{
						isActive = true;
						
						$( this ).text( options.onText );
						
						$.cookie( 'scrollFollowSetting' + $( box ).attr( 'id' ), true, { expires: 365, path: '/'} );
					}
				);
		}
		
		// If no parent ID was specified, and the immediate parent does not have an ID
		// options.container will be undefined. So we need to figure out the parent element.
		var cont;
		
		if ( options.container == '')
		{
			cont = $( box ).parent();
		}
		else
		{
			cont = document.getElementById( options.container );
		}
		
		// Finds the defaul positioning of the box.
		var initialTop = $( box ).css( 'top' );
		
		if( initialTop == 'auto' )
		{
			initialTop = 0;
		}
		else
		{
			initialTop = parseInt( initialTop.substr( 0, initialTop.indexOf( 'p' ) ) );
		}
		
		// Animated the box when the page is scrolled.
		$( window ).scroll( function ()
			{
				ani( box, initialTop );
			}
		);
	};
	
	$.fn.scrollFollow = function ( options )
	{
		options = options || {};
		options.speed = options.speed || 500;
		options.offset = options.offset || 0;
		options.easing = options.easing || 'easeOutBack';
		options.container = options.container || this.parent().attr( 'id' );
		options.killSwitch = options.killSwitch || 'killSwitch';
		options.onText = options.onText || 'Turn Slide Off';
		options.offText = options.offText || 'Turn Slide On';
		
		this.each( function() 
			{
				new $.scrollFollow( this, options );
			}
		);
		
		return this;
	};
})( jQuery );