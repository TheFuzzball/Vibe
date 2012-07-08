define(["require","util","ui.player.controls","ui.player.slider"],function(require){function UIPlayer(options){var options=typeof options=="object"?options:{},node=this.node=util.createElement({tag:"div",id:"UIPlayer"}),self=this;typeof options.onseek=="function"&&(this.onseek=options.onseek),typeof options.onplaytoggle=="function"&&(this.onplaytoggle=options.onplaytoggle),typeof options.onskip=="functions"&&(this.onskip=options.onskip),util.registerStylesheet("./stylesheets/ui.player.css",function(){var controls=self.controls=new PlayerControls({appendTo:node,onprevious:function(){self.onskip(-1)},onnext:function(){self.onskip(1)},onplaytoggle:function(button){self.onplaytoggle(button)}});setTimeout(function(){var playerSlider=self.playerSlider=new PlayerSlider({appendTo:node,onseek:self.onseek})},150),options.onload&&options.onload(self)})}var util=require("util"),PlayerControls=require("ui.player.controls"),PlayerSlider=require("ui.player.slider");return UIPlayer})