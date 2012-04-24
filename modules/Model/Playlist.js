/**
 * PlaylistModel
 * @description contains the playlist data and performs Api interactions.
 */
define(['util','Model/UndoManager'],function(util,UndoManager){

	// constructor.
	var PlaylistModel = function(options) {
	
		if ( typeof options !== 'object' )
		{
			throw util.error("PlaylistModel was called without an options parameter.");
			
			return;
		}
		
		if ( typeof options.withApi == 'undefined' )
		{
			throw util.error("PlaylistModel was called without an Api instance.");
			
			return;
		}
	
		if ( typeof options.withUI == 'undefined' )
		{
			throw util.error("PlaylistModel was called without a UI instance.");
			
			return;
		}
	
		// model stores the complete playlist items that construct a PlaylistItem.
		var model = this.model = new UndoManager('PlaylistModel');
	
		// set the Api instance.
		var api = this.api = options.withApi;
	
		// set the UI instance.
		var ui = this.ui = options.withUI;

		// redraw the UI with the persistent storage.
		ui.redraw(model.value());

	}
	
	/**
	 * add
	 * @description add an item to the Playlist model.
	 * @param type (string) - the type of item to be added. (e.g. genre, artist, album, etc.)
	 * @param id (string) - the unique identifier for the item. (Usually an MD5 hash.)
	 */
	PlaylistModel.prototype.add = function(type, id) {
	
		var self = this;
	
		getItems.call(this,type,id,function(items){
		
			self.model.push.apply(this,items);
			
			self.ui.redraw(self.model.value());
			
		});
	
	}
	
	/**
	 * undo
	 * @description reverse the last addition to the playlist.
	 */
	PlaylistModel.prototype.undo = function(n) {
	
		this.model.undo(n);
		
		this.ui.redraw(this.model.value());
	
	}
	
	/**
	 * redo
	 * @description redo an undone change to the playlist.
	 */
	PlaylistModel.prototype.redo = function(n) {
	
		this.model.redo(n);
		
		this.ui.redraw(this.model.value());
	
	}
	
	/**
	 * removeItem
	 * @description removes an item from the playlist.
	 * @param n - item to remove. (from 0.)
	 */
	PlaylistModel.prototype.removeItem = function(n) {
	
		this.model.removeItemAtIndex(n);
		
		this.ui.redraw(this.model.value());
	
	}
	
	/**
	 * removeLastItem
	 * @description removes the last item from the playlist.
	 */
	PlaylistModel.prototype.removeLastItem = function() {
		
		this.model.pop();
		
		this.ui.redraw(this.model.value());
		
	}
	
	/**
	 * removeFirstItem
	 * @description removes the first item from the playlist.
	 */
	PlaylistModel.prototype.removeFirstItem = function() {
	
		this.model.shift();
		
		this.ui.redraw(this.model.value());
	
	}
	
	/**
	 * clear
	 * @description flushes the model, localStorage and clears the UI.
	 */
	PlaylistModel.prototype.clear = function() {
	
		this.model.clear();
		
		this.ui.node.removeChildren();
	
	}
	
	/**
	 * getItem
	 * @description returns a playlist item object.
	 * @param n (int) - the playlist item index.
	 */
	PlaylistModel.prototype.getItem = function(n) {
	
		return this.model.getItemAtIndex(n);
	
	}
	
	/**
	 * getItems
	 * @description fetches the items for the corresponding type and id.
	 * @param type (string) - The type of items to get.
	 * @param id (string) - The unique identifier for the type.
	 */
	var getItems = function(type,id,callback) {
		if ( type == 'genre' )
		{
			this.api.getTracksInGenre(id,function(tracks){

				callback(tracks);

			});
		}
		else if ( type == 'artist' )
		{
			this.api.getTracksByArtist(id,function(tracks){

				callback(tracks);

			});
		}
		else if ( type == 'album' )
		{
			this.api.getTracksInAlbum(id,function(tracks){

				callback(tracks);

			});
		}
		else if ( type == 'track' )
		{
			this.api.getTrack(id,function(tracks){

				callback(tracks);

			});
		}
	}
	
	return PlaylistModel;

});