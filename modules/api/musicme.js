/**
 * MusicMe API
 * @description MusicMe Application Programming Interface. Allows interfacing with a MusicMe server.
 */
define(['dependencies/EventEmitter','dependencies/socket.io'],function(EventEmitter){

	// constructor.
	function Api(host,port)
	{
	
		var self = this;

		// set ready default.
		this.ready = false;

		// connect to the MusicMe server.
		this.connection = io.connect( 'http://' + ( host || 'localhost' ) + ':' + ( port || 6232 ) );

		// create an error dialogue on error.
		this.connection.on('error',function(){

			self.emit('error');

		});

		// emit ready event on connection.
		this.connection.on('connect',function(){
		
			self.emit('ready');
		
			// Api is now ready.
			self.ready = true;
		
		});

	}
	
	EventEmitter.augment(Api.prototype);

	/**
	 * getArtists
	 * @description Lists all artists within the collection.
	 * @param callback (function) - The function that will be sent the list of artists.
	 */
	Api.prototype.getArtists = function(callback){
	
		this.connection.emit('getArtists',function(err,artists){
		
			callback(artists);
		
		});
	
	}

	Api.prototype.getArtistsInGenre = function(genre,callback){
	
		var genre = decodeURIComponent(genre);
	
		this.connection.emit('getArtistsInGenre',genre,function(err,artists){
		
			callback(artists);
		
		});
	
	}

	/**
	 * getAlbums
	 * @description Lists all albums within the collection.
	 * @param callback (function) - The function that will be sent the list of albums.
	 */
	Api.prototype.getAlbums = function(callback){
	
		this.connection.emit('getAlbums',function(err,albums){
		
			callback(albums);
		
		});
	
	}
	
	Api.prototype.getAlbumsByArtist = function(id,callback){
	
		this.connection.emit('getAlbumsByArtist',id,function(err,albums){
		
			callback(albums);
		
		});
	
	}
	
	/**
	 * getTracks
	 * @description Lists all tracks within the collection.
	 * @param callback (function) - The function that will be sent the list of tracks.
	 */
	Api.prototype.getTracks = function(callback){
	
		this.connection.emit('getTracks',function(err,tracks){
		
			callback(tracks);
		
		});
	
	}
	
	Api.prototype.getTracksInAlbum = function(id,callback){
	
		this.connection.emit('getTracksInAlbum',id,function(err,tracks){
		
			callback(tracks);
		
		});
	
	}
	
	/**
	 * getGenres
	 * @description Lists all genres within the collection.
	 * @param callback (function) - The function that will be sent the list of genres.
	 */
	Api.prototype.getGenres = function(callback){
	
		this.connection.emit('getGenres',function(err,genres){
		
			callback(genres);
		
		});
	
	}
	
	Api.prototype.getMethodFor = function(type){
	
		var types = {
			'genre' : 'getArtistsInGenre',
			'artist' : 'getAlbumsByArtist',
			'album' : 'getTracksInAlbum'
		}
		
		if ( type in types ) return types[type];
		else return false;
	
	}
	
	Api.prototype.getSubtype = function(type){
	
		var types = {
			'genre' : 'artist',
			'artist' : 'album',
			'album' : 'track'
		}
	
		if ( type in types ) return types[type];
		else return false;
	
	}

	return Api;

});