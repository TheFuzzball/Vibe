define(["util"],function(util){var DragAndDrop={};return DragAndDrop.draggable=function(options){if(typeof options!="object"||typeof options=="object"&&(!options.start||!options.node))throw new Error("Draggable options invalid.");options.node.setAttribute("draggable","true"),util.addListener(options.node,"dragstart",function(e){window.dropZone=options.dropZone;var data=options.start(e.target||e.srcElement,e);typeof data=="object"?data=JSON.stringify(data):data=data.toString(),e.dataTransfer.setData("Text",data),e.dataTransfer.dropEffect="copy"}),util.addListener(options.node,"selectstart",function(e){return!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&(e.preventDefault&&e.preventDefault(),e.srcElement&&e.srcElement.dragDrop&&e.srcElement.dragDrop()),!1})},DragAndDrop.droppable=function(options){if(typeof options!="object"||typeof options=="object"&&(!options.drop||!options.node))throw new Error("Droppable options invalid.");util.addListener(options.node,"dragover",function(e){var target=e.target||e.srcElement;if(options.dropZone&&window.dropZone==options.dropZone||!options.dropZone){if(typeof options.zoneClass=="string"){var classNode=options.zoneHighlightNode||target;util.addClass(classNode,options.zoneClass)}e.dataTransfer.effectAllowed="all",e.preventDefault&&e.preventDefault()}else e.dataTransfer.effectAllowed="none";return typeof options.whileentered=="function"&&options.whileentered(target,e),!1}),util.addListener(options.node,"dragenter",function(e){var target=e.target||e.srcElement;return typeof options.enter=="function"&&options.enter(target,e),!1}),util.addListener(options.node,"dragleave",function(e){var target=e.target||e.srcElement;if(typeof options.zoneClass=="string"){var classNode=options.zoneHighlightNode||target;util.removeClass(classNode,options.zoneClass)}return typeof options.leave=="function"&&options.leave(target,e),!1}),util.addListener(options.node,"drop",function(e){var target=e.target||e.srcElement;if(typeof options.zoneClass=="string"){var classNode=options.zoneHighlightNode||target;util.removeClass(classNode,options.zoneClass)}var data=e.dataTransfer.getData("Text");if(data){try{data=JSON.parse(data)}catch(ex){/^\d+$/.test(data)?data=parseInt(data):/^\d+\.\d+$/.test(data)&&(data=parseFloat(data))}options.drop(target,e,data)}options.dropZone&&(window.dropZone=undefined),e.preventDefault&&e.preventDefault()})},DragAndDrop})