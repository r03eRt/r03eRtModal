// Modal features
// -----------------------------------------------
// -Launch different modals based upon option sets
// -Allow users to define custom transitions
// -Be responsive
// -Have max/min width points
// -Anchor to the top of the page if too tall
// -Be centered otherwise
// -Accept a HTML string for content OR a domNode
// -Have no dependencies
	(function()
	{
		/**
		 * [Modal description]
		 */
		this.Modal = function()
		{
			this.closeButton = null;
			this.modal = null;
			this.overlay = null;
			//this.close = this._close.bind(this);
			// Determine proper prefix
    		this.transitionEnd = transitionSelect();

			var defaults =  {
				className: 'fade-and-drop',
				closeButton: true,
				content: 'aa',
				maxWidth: 600,
				maxHeight: 280,
				overlay: true
			}

			if(arguments[0] && typeof arguments === 'object')
				this.options = extendDefaults(defaults, arguments[0]);
		}

		/**
		 * [buildOut description]
		 * @return {[type]} [description]
		 */
		function buildOut()
		{
		    var content, contentHolder, docFrag;

			/*
		     * If content is an HTML string, append the HTML string.
		     * If content is a domNode, append its content.
		     */
		    
		    if(typeof this.options.content === 'string')
		    	content = this.options.content;
		    else
		    	content = this.options.content.innerHTML;

		    // Create a DocumentFragment to build with
		    docFrag = document.createDocumentFragment();

		    this.modal = document.createElement('div');
		    this.modal.className = 'scotch-modal ' + this.options.className;
		    this.modal.style.minWidth = this.options.minWidth+'px';
		    this.modal.style.maxWidth = this.options.maxWidth+'px';

		    // If closeButton option is true, add a closebutton
		    if(this.options.closeButton)
		    {
		    	this.closeButton = document.createElement('button');
		    	this.closeButton.className = 'scotch-close close-button';
		    	this.closeButton.innerHTML = 'x';
		    	this.modal.appendChild(this.closeButton);
		    }

		    //  If overlay is true, add one in the docFrag
		    if(this.options.overlay)
		    {
		    	this.overlay = document.createElement('div');
		    	this.overlay.className = 'scotch-overlay '+ this.options.className;
		    	docFrag.appendChild(this.overlay);
		    }

		    // Create content area and append to modal
		    contentHolder = document.createElement('div');
		    contentHolder.className = 'scotch-content';
		    contentHolder.innerHTML = content;
		    this.modal.appendChild(contentHolder);

		    // Append modal to the documentFragment
		    docFrag.appendChild(this.modal);

		    // Apend docyment fragment to body
		    document.body.appendChild(docFrag);

		}

		/**
		 * [initializeEvents description]
		 * @return {[type]} [description]
		 */
		function initializeEvents()
		{
			if(this.closeButton)
				this.closeButton.addEventListener('click', this.close.bind(this));
		
			if(this.overlay)
				this.overlay.addEventListener('click', this.close.bind(this));
		}

		/**
		 * [open description]
		 * @return {[type]} [description]
		 */
		Modal.prototype.open = function()
		{
			//Build with this context
			buildOut.call(this);

			// Initialize our event listener
			initializeEvents.call(this);

			/*
		     * After adding elements to the DOM, use getComputedStyle
		     * to force the browser to recalc and recognize the elements
		     * that we just added. This is so that CSS animation has a start point
		     */
		    window.getComputedStyle(this.modal).height;

		    /*
		     * Add our open class and check if the modal is taller than the window
		     * If so, our anchored class is also applied
		     */
		    this.modal.className = this.modal.className +
		      (this.modal.offsetHeight > window.innerHeight ?
		        " scotch-open scotch-anchored" : " scotch-open");
		    this.overlay.className = this.overlay.className + " scotch-open";

		}

		/**
		 * [close description]
		 * @return {[type]} [description]
		 */
		Modal.prototype.close = function()
		{
			// Store value of this
			var _ = this;

			// remove open classes
			this.modal.className = this.modal.className.replace(" scotch-open", "");
    		this.overlay.className = this.overlay.className.replace(" scotch-open","");

			/*
		     * Listen for CSS transitionend event and then
		     * Remove the nodes from the DOM
		     */
		    this.modal.addEventListener(this.transitionEnd, function() {
		      _.modal.parentNode.removeChild(_.modal);
		    });
		    this.overlay.addEventListener(this.transitionEnd, function() {
		      if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
		    });
		}

		/**
		 * [extendDefaults description]
		 * @param  {[type]} source     [description]
		 * @param  {[type]} properties [description]
		 * @return {[type]}            [description]
		 */
		function extendDefaults(source, properties)
		{
			var property;
			for(property in properties)
			{
				if(properties.hasOwnProperty(property))
					source[property] = properties[property];
			}
			return source;
		}

		/**
		 * Utility method to determine which transistionend event is supported
		 * @return {[type]} [description]
		 */
		function transitionSelect() {
		    var el = document.createElement("div");
		    if (el.style.WebkitTransition) return "webkitTransitionEnd";
		    if (el.style.OTransition) return "oTransitionEnd";
		    return 'transitionend';
		}

	})();
