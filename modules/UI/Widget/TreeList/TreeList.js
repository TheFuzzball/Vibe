/**
 * TreeList
 * @description Generates a tree list view that displays a list based on an array of objects.
 */
define(['require','util','dependencies/EventEmitter'],function(require,util, EventEmitter){

	// include stylesheet.
	util.registerStylesheet(require.toUrl('./TreeList.css'));

	/**
	 * TreeList
	 * @param list (array) - List of objects that will specify an item.
	 * @param options (object) - options for generating the list.
	 */
	function TreeList(list,options){
	
		// make sure there is a list to work with.
		if ( ! list || ! ( list instanceof Array ) )
		{
			consnodee.error("TreeList was instantiated without a list array. This obviously won't work.");
			
			return false;
		} 
	
		// usual lark.
		var self = this;
	
		// make sure options exists to prevent an exception.
		var options = options || {};
	
		// specify a node to append the list to.
		var appendTo = options.appendTo || document.body;
	
		// create the list.
		var node = this.node = document.createElement('ol');
	
		// list of classes to be set for the node.
		var nodeClasses = [];
	
		// set treelist class for root node.
		if ( options.isRootNode ) nodeClasses.push('treeList');
	
		// check for custom classes.
		if ( typeof options.customClass == "string" ) nodeClasses.push(options.customClass);
	
		// iterate the list.
		list.forEach(function(itemObj,index){
		
			var item = document.createElement('li');
			
			var itemClasses = [];
			
			var itemInner = util.htmlEntities(itemObj.name || itemObj.title || 'Item ' + index)
			
			if ( options.wrapItemsIn )
			{
				if ( options.wrapItemsIn[0] && options.wrapItemsIn[1] )
				{
					itemInner = options.wrapItemsIn[0] + itemInner + options.wrapItemsIn[1];
				}
			}
			
			// give the item a title.
			item.innerHTML = itemInner;
		
			// if there are attributes apply them.
			if ( itemObj.attributes )
			{
			
				if ( itemObj.attributes.customClass )
				{
					itemClasses.push(itemObj.attributes.customClass);
					delete itemObj.attributes.customClass;
				} 
			
				item.setAttributes(itemObj.attributes);
			}
		
			if ( itemObj.id ) item.setAttribute('data-id',itemObj.id);
			
			if ( options.setAttributes ) item.setAttributes(options.setAttributes);

			// if there is a drag start method specified bind it to the dragstart event.
			if ( typeof options.dragStartMethod == 'function' && options.isRootNode ) 
			{
				util.addListener(item,'dragstart',options.dragStartMethod);
			}
			
			// insert item classes.
			if ( itemClasses.length !== 0 ) item.setAttribute('class',itemClasses.join(' '));
			
			// append the item to the list.
			node.appendChild(item);
		
		});
		
		if ( options.isRootNode )
		{
			util.doubleClick(node,function(target){
			
				if ( target instanceof HTMLLIElement )
				{
					var isPopulated = !! target.getAttribute('data-populated');

					target.toggleClass('expanded');

					// emit the clicked event and send the target element.
					self.emit('itemClicked', target, isPopulated);

				}
			
			},function(target){
			
				self.emit('itemDoubleClicked',target);
			
			});
		}
	
		if ( ! options.isRootNode )
		{
			
			appendTo.setAttribute('data-populated','yes');
			
		}
	
		// set the node classes.
		if ( nodeClasses.length !== 0 ) node.setAttribute('class', nodeClasses.join(' '));
	
		// append the list.
		appendTo.appendChild(node);
	
	}
	
	EventEmitter.augment(TreeList.prototype);
	
	return TreeList;

});