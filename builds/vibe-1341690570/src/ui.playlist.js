define(["require","util","ui.widget.rearrangeableList","ui.playlist.row","ui.playlist.legend","ui.playlist.controlBar","ui.playlist.infoBar"],function(require){var util=require("util"),RearrangeableList=require("ui.widget.rearrangeableList"),PlaylistRow=require("ui.playlist.row"),PlaylistLegend=require("ui.playlist.legend"),PlaylistControlBar=require("ui.playlist.controlBar"),PlaylistInfoBar=require("ui.playlist.infoBar"),Playlist=function(options){var options=this.options=typeof options=="object"?options:{},self=this;util.registerStylesheet("./stylesheets/ui.playlist.css",function(){function playlistItemDidMove(){}function playlistItemWasRemoved(){}self.columns=options.hasOwnProperty("useColumns")?options.useColumns:["trackno","trackname","albumname","artistname","tracklength"];var node=self.node=util.createElement({tag:"div",id:"UIPlaylist"}),header=self.header=util.createElement({tag:"div",appendTo:node}),control=self.control=PlaylistControlBar.call(self,options.withControlBarButtons),legend=(new PlaylistLegend(header)).withColumns(self.columns),listContainer=self.listContainer=util.createElement({tag:"div",customClass:"listContainer",appendTo:node}),list=self.list=new RearrangeableList({appendTo:listContainer,onmoved:playlistItemDidMove,onnoderemoved:playlistItemWasRemoved});self.infoBar=new PlaylistInfoBar(self.node),self.options.onload&&self.options.onload()})};return Playlist.prototype.addRows=function(items,afterItem){var self=this,rows=util.map(items,function(item){var row=(new PlaylistRow(item)).withColumns(self.columns);return self.options.onplayitem&&(row.onplayitem=function(e,row){self.options.onplayitem(row)}),row.node});this.list.addNodes(rows,afterItem),self.options.onchange&&self.options.onchange()},Playlist.prototype.redraw=function(items){this.list&&(this.list.removeChildren(),this.addRows(items),this.options.onchange&&this.options.onchange())},Playlist})