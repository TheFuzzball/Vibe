define({forEach:function(array,callback){if(array instanceof Array&&typeof callback=="function")for(var i=0;i<array.length;i++)callback(array[i],i,array)},map:function(array,callback){var arr=[];for(var i=0;i<array.length;i++)arr.push(callback(array[i]));return arr},setAttributes:function(node,attributes){if(node&&attributes)if(attributes instanceof Array)this.forEach(attributes,function(attribute){node.setAttribute(attribute[0],attribute[1])});else if(typeof attributes=="object")for(var i in attributes)node.setAttribute(i,attributes[i])},createElement:function(definition){if(typeof definition!="object"||!definition.tag)return void 0;var node=document.createElement(definition.tag),self=this;return typeof definition.inner=="string"&&(node.innerHTML=definition.inner),definition.id&&node.setAttribute("id",definition.id),definition.customClass&&node.setAttribute("class",definition.customClass),definition.attributes&&this.setAttributes(node,definition.attributes),definition.children&&definition.children instanceof Array&&this.forEach(definition.children,function(child){child.appendTo=node,self.createElement(child)}),definition.appendTo&&definition.appendTo instanceof Element&&definition.appendTo.appendChild(node),node},addListener:function(){return document.addEventListener?function(element,listenFor,callback){element.addEventListener(listenFor,callback,!1)}:function(element,listenFor,callback){element.attachEvent("on"+listenFor,callback)}}(),removeListener:function(){return document.removeEventListener?function(element,listenFor,dispatch){element.removeEventListener(listenFor,dispatch,!1)}:function(element,listenFor,dispatch){element.detachEvent(listenFor,dispatch)}}(),addClass:function(node,className){node.className.length==0?node.className=className:(new RegExp("(^| )"+className+"( |$)")).test(node.className)||(node.className+=" "+className)},removeClass:function(node,className){node.className=node.className.replace(new RegExp("( |^)"+className+"( |$)"),""),node.className.length==0&&node.removeAttribute("class")},hasClass:function(node,className){return(new RegExp("(^| )"+className+"($| )")).test(node.className)},toggleClass:function(node,className){var regex=new RegExp(className);regex.test(node.className)?node.className=node.className.replace(className,""):node.className.length==0?node.className=className:node.className+=" "+className},removeNode:function(node){node instanceof Element&&("removeNode"in node?node.removeNode(!0):node.parentNode.removeChild(node))},removeChildren:function(node){while(node.firstChild)this.removeNode(node.firstChild)},appendChildren:function(node,children){if(!(children.hasOwnProperty("length")&&node instanceof Element))return!1;for(var i=0;i<children.length;i++)children[i]instanceof Element&&node.appendChild(children[i])},augment:function(receiving,sending,context){for(var i in sending)sending.hasOwnProperty(i)&&(context?receiving[i]=function(method,context){return function(){method.call(context)}}(sending[i],context):receiving[i]=sending[i])},registerStylesheet:function(){var stylesheets={},_self=this,verifyResource=function(url,callback){var XHR=new XMLHttpRequest;XHR.open("get",url),XHR.send(),XHR.onreadystatechange=function(){XHR.readyState==4&&(/^(0|404$)/.test(XHR.status)||XHR.responseText.length==0?callback(!1):callback(!0))}},StylesheetObserver=function(url,callback){var timeout=0,self=this;this.url=url,this.callback=callback,void function(){for(var i=0;i<document.styleSheets.length;i++)if((new RegExp(url+"$")).test(document.styleSheets[i].href)){self.reference=document.styleSheets[i],callback(document.styleSheets[i]);return}timeout<=100?setTimeout(checker,50):callback(!1)}()},_registerStylesheet=function(url,callback){if(url in stylesheets)return!1;var link=document.createElement("link"),callback=typeof callback=="function"?callback:function(loaded){var message=loaded?"Loaded resource: "+url+" successfully":"Failed to load "+url;console.log(message)};link.setAttribute("href",url),link.setAttribute("type","text/css"),link.setAttribute("rel","stylesheet"),document.getElementsByTagName("head")[0].appendChild(link),stylesheets[url]=new StylesheetObserver(url,function(ref){if(!ref){callback(!1);return}var numberOfRules=null;try{numberOfRules=ref.cssRules.length}catch(error){numberOfRules=null}finally{numberOfRules?callback(!0):numberOfRules!=null?callback(!1):verifyResource(url,function(exists){callback(exists)})}})};return _registerStylesheet.hasBeenRegistered=function(url){return stylesheets[url]},_registerStylesheet}(),cacheImage:function(url){var image=new Image;image.src=url},formatTime:function(seconds){seconds=Math.ceil(seconds);var minutes=Math.floor(seconds/60),seconds=seconds%60;return String(minutes).length==1&&(minutes="0"+String(minutes)),String(seconds).length==1&&(seconds="0"+String(seconds)),minutes+":"+seconds},doubleClick:function(element,click,doubleClick,clickTimeoutDuration){this.addListener(element,"click",function(e){var target=e.target||e.srcElement;typeof doubleClick.clickTimeout=="undefined"?doubleClick.clickTimeout=setTimeout(function(){doubleClick.clickTimeout=undefined,typeof click=="function"&&click(target)},clickTimeoutDuration||170):(clearTimeout(doubleClick.clickTimeout),doubleClick.clickTimeout=undefined,doubleClick(target))})},htmlEntities:function(string){return string.replace(/&/g,"&#38;").replace(/</g,"&#60;").replace(/>/g,"&#62;").replace(/£/g,"&#163;")},getMetaContent:function(name){var metaTags=document.getElementsByTagName("meta");for(var i=0;i<metaTags.length;i++)if(metaTags[i].getAttribute("name")==name)return metaTags[i].getAttribute("content");return!1},disableUserSelect:function(node){this.addListener(node,"selectstart",function(e){return e.cancelBubble&&e.cancelBubble(),e.returnValue=!1,e.preventDefault&&e.preventDefault(),e.stopPropogation&&e.stopPropogation(),!1})},hasProtocol:function(obj,protocol){if(typeof obj!="object")return!1;for(var i=0;i<protocol.length;i++)if(typeof obj[protocol[i]]!="function")return!1;return!0},hasProperties:function(obj,properties){if(typeof obj!="object")return!1;for(var i=0;i<properties.length;i++)if(typeof properties[i]=="string"&&!obj.hasOwnProperty(properties[i]))return!1;return!0},browser:{isMobile:function(){return/(iPhone|Android|Mobile)/i.test(navigator.userAgent)}(),isIE:function(){return/MSIE/i.test(navigator.userAgent)}(),hasSupport:{dragAndDrop:function(){return"draggable"in document.createElement("div")}(),svg:function(){var support=document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1");return/opera/i.test(navigator.userAgent)&&(support=!1),support}(),cssTransitions:function(){var prefix=["transition","WebkitTransition","MozTransition","OTransition","msTransition"];for(var i=0;i<prefix.length;i++)if(prefix[i]in document.createElement("div").style)return prefix[i].replace("Transition","");return!1}(),localStorage:function(){try{return window.localStorage?!0:!1}catch(ex){return ex}}()}}})