/**
 * MusicMe Playlist
 * @description Provides the Playlist view and mutator methods.
 */
define(['require','util','dependencies/EventEmitter', 'UI/Playlist/PlaylistRow', 'UI/Playlist/PlaylistLegend'],

function(require, util, EventEmitter, UIPlaylistRow, UIPlaylistLegend, ButtonBar) {

	// register the view stylesheet.
	util.registerStylesheet(require.toUrl('./Playlist.css'))
	
	/**
	 * constructs a UIPlaylist instance.
	 * @param options {object} options with which to instantiate the playlist.
	 */
	var UIPlaylist = function(options) {

		var self = this

		// ensure options is an object.
		var options = this.options = ( typeof options == 'object' ) ? options : {}
		
		// define columns to use.
		this.useColumns = options.hasOwnProperty('useColumns') ? options.useColumns : ['trackno','trackname','albumname','artistname','tracklength']
		
		// create the root playlist element node.
		var node = this.node = util.createElement({
			tag : 'div',
			id : 'UIPlaylist',
			appendTo : ( options.appendTo instanceof Element ) ? options.appendTo : document.body
		})
			
		var header = this.header = util.createElement({'tag' : 'div', 'appendTo' : node})
		
		// we're using the control bar.
		if ( typeof options.useControlBar !== 'undefined' && options.useControlBar instanceof Array ) {
		
			// fetch the control bar module.
			require(['UI/Playlist/PlaylistControlBar'], function(UIPlaylistControlBar) {
			
				var control = self.control = UIPlaylistControlBar.call(self, options.useControlBar)
			
				var legend = new UIPlaylistLegend(header).withColumns(self.useColumns)
			
				node.addClass('usingControlBar')
			
			})
		
		}
		
		else {
		
			var legend = new UIPlaylistLegend(header).withColumns(this.useColumns)
		}
		
		var listContainer = this.listContainer = util.createElement({
			'tag' : 'div',
			'customClass' : 'listContainer',
			'appendTo' : node
		})
			
		var list = this.list = util.createElement({'tag' : 'ol', 'appendTo' : listContainer})
		
		// check if we're using the info bar.
		if ( typeof options.useInfoBar == 'boolean' && options.useInfoBar ) {
		
			// fetch the info bar module.
			require(['UI/Playlist/PlaylistInfoBar'], function(UIPlaylistInfoBar) {
			
				// make an info bar instance.
				self.infoBar = new UIPlaylistInfoBar(self.node)
				
				// set the class on #UIPlaylist.
				self.node.addClass('usingInfoBar')
			
				// tell any listeners that the info bar module is loaded.
				self.emit('infoBarLoaded')
			
			})
		
		}
		
	}
	
	/**
	 * adds item rows to the playlist.
	 * @param items {array} playlist items to be appended.
	 */
	UIPlaylist.prototype.addRows = function(items) {
	
		var self = this
	
		items.forEach(function(item, index) {
		
			if ( UIPlaylistRow.isValidDefinition(item) ) {
			
				var playlistRow = new UIPlaylistRow(item, 'bob').withColumns(self.useColumns)
				
				playlistRow.on('itemSelected', function(item) {
					
					console.log('My oh my.')
					
					self.emit('itemSelected', item)
					
				})
				
				self.list.appendChild(playlistRow.row)
				
			}
			
			else { console.warn('Cannot add item ' + index + ' to the playlist. It is not a valid playlist row.')
			
				console.log(item)
			}
		})
	
	}
	
	/**
	 * adds the rows but also clears the playlist.
	 * @param items {array} list of playlist items.
	 */
	UIPlaylist.prototype.redraw = function(items) {
	
		// empty playlist UI.
		this.list.removeChildren()
		
		// add the items.
		this.addRows(items)
	
	}
	
	// use EventEmitter.
	EventEmitter.augment(UIPlaylist.prototype)
		
	// define UIPlaylist module.
	return UIPlaylist

})