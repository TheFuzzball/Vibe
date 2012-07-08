define([],function(){var Cursor={x:0,y:0,init:function(){this.setEvent("mouse"),this.setEvent("touch")},setEvent:function(type){var moveHandler=document["on"+type+"move"]||function(){};document["on"+type+"move"]=function(e){moveHandler(e),Cursor.refresh(e)}},refresh:function(e){e||(e=window.event),e.type=="mousemove"?this.set(e):e.touches&&this.set(e.touches[0])},set:function(e){if(e.pageX||e.pageY)this.x=e.pageX,this.y=e.pageY;else if(e.clientX||e.clientY)this.x=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,this.y=e.clientY+document.body.scrollTop+document.documentElement.scrollTop}};Cursor.init();var Position={get:function(obj){var curleft=curtop=0;if(obj.offsetParent)do curleft+=obj.offsetLeft,curtop+=obj.offsetTop;while(obj=obj.offsetParent);return[curleft,curtop]}},Dragdealer=function(wrapper,options){typeof wrapper=="string"&&(wrapper=document.getElementById(wrapper));if(!wrapper)return;var handle=wrapper.getElementsByTagName("div")[0];if(!handle||handle.className.search(/(^|\s)handle(\s|$)/)==-1)return;this.init(wrapper,handle,options||{}),this.setup()};return Dragdealer.prototype={init:function(wrapper,handle,options){this.wrapper=wrapper,this.handle=handle,this.options=options,this.disabled=this.getOption("disabled",!1),this.horizontal=this.getOption("horizontal",!0),this.vertical=this.getOption("vertical",!1),this.slide=this.getOption("slide",!0),this.steps=this.getOption("steps",0),this.snap=this.getOption("snap",!1),this.loose=this.getOption("loose",!1),this.speed=this.getOption("speed",10)/100,this.xPrecision=this.getOption("xPrecision",0),this.yPrecision=this.getOption("yPrecision",0),this.locked=!1,this.callback=options.callback||null,this.animationCallback=options.animationCallback||null,this.bounds={left:options.left||0,right:-(options.right||0),top:options.top||0,bottom:-(options.bottom||0),x0:0,x1:0,xRange:0,y0:0,y1:0,yRange:0},this.value={prev:[-1,-1],current:[options.x||0,options.y||0],target:[options.x||0,options.y||0],tap:[options.x||0,options.y||0]},this.offset={wrapper:[0,0],mouse:[0,0],prev:[-999999,-999999],current:[0,0],target:[0,0]},this.change=[0,0],this.activity=!1,this.dragging=!1,this.tapping=!1},getOption:function(name,defaultValue){return this.options[name]!==undefined?this.options[name]:defaultValue},setup:function(){this.setWrapperOffset(),this.setBoundsPadding(),this.setBounds(),this.setSteps(),this.addListeners()},setWrapperOffset:function(){this.offset.wrapper=Position.get(this.wrapper)},setBoundsPadding:function(){!this.bounds.left&&!this.bounds.right&&(this.bounds.left=Position.get(this.handle)[0]-this.offset.wrapper[0],this.bounds.right=-this.bounds.left),!this.bounds.top&&!this.bounds.bottom&&(this.bounds.top=Position.get(this.handle)[1]-this.offset.wrapper[1],this.bounds.bottom=-this.bounds.top)},setBounds:function(){this.bounds.x0=this.bounds.left,this.bounds.x1=this.wrapper.offsetWidth+this.bounds.right,this.bounds.xRange=this.bounds.x1-this.bounds.x0-this.handle.offsetWidth,this.bounds.y0=this.bounds.top,this.bounds.y1=this.wrapper.offsetHeight+this.bounds.bottom,this.bounds.yRange=this.bounds.y1-this.bounds.y0-this.handle.offsetHeight,this.bounds.xStep=1/(this.xPrecision||Math.max(this.wrapper.offsetWidth,this.handle.offsetWidth)),this.bounds.yStep=1/(this.yPrecision||Math.max(this.wrapper.offsetHeight,this.handle.offsetHeight))},setSteps:function(){if(this.steps>1){this.stepRatios=[];for(var i=0;i<=this.steps-1;i++)this.stepRatios[i]=i/(this.steps-1)}},addListeners:function(){var self=this;this.wrapper.onselectstart=function(){return!1},this.handle.onmousedown=this.handle.ontouchstart=function(e){self.handleDownHandler(e)},this.wrapper.onmousedown=this.wrapper.ontouchstart=function(e){self.wrapperDownHandler(e)};var mouseUpHandler=document.onmouseup||function(){};document.onmouseup=function(e){mouseUpHandler(e),self.documentUpHandler(e)};var touchEndHandler=document.ontouchend||function(){};document.ontouchend=function(e){touchEndHandler(e),self.documentUpHandler(e)};var resizeHandler=window.onresize||function(){};window.onresize=function(e){resizeHandler(e),self.documentResizeHandler(e)},this.wrapper.onmousemove=function(e){self.activity=!0},this.wrapper.onclick=function(e){return!self.activity},this.interval=setInterval(function(){self.animate()},25),self.animate(!1,!0)},handleDownHandler:function(e){if(this.locked)return;this.activity=!1,Cursor.refresh(e),this.preventDefaults(e,!0),this.startDrag(),this.cancelEvent(e)},wrapperDownHandler:function(e){this.locked=!0,Cursor.refresh(e),this.preventDefaults(e,!0),this.startTap()},documentUpHandler:function(e){this.stopDrag(),this.stopTap()},documentResizeHandler:function(e){this.setWrapperOffset(),this.setBounds(),this.update()},enable:function(){this.disabled=!1,this.handle.className=this.handle.className.replace(/\s?disabled/g,"")},disable:function(){this.disabled=!0,this.handle.className+=" disabled"},setStep:function(x,y,snap){this.setValue(this.steps&&x>1?(x-1)/(this.steps-1):0,this.steps&&y>1?(y-1)/(this.steps-1):0,snap)},setValue:function(x,y,snap){if(this.locked)return;this.setTargetValue([x,y||0]),snap&&this.groupCopy(this.value.current,this.value.target)},startTap:function(target){if(this.disabled)return;this.tapping=!0,target===undefined&&(target=[Cursor.x-this.offset.wrapper[0]-this.handle.offsetWidth/2,Cursor.y-this.offset.wrapper[1]-this.handle.offsetHeight/2]),this.setTargetOffset(target)},stopTap:function(){if(this.disabled||!this.tapping)return;this.tapping=!1,this.setTargetValue(this.value.current),this.result()},startDrag:function(){if(this.disabled)return;this.offset.mouse=[Cursor.x-Position.get(this.handle)[0],Cursor.y-Position.get(this.handle)[1]],this.dragging=!0},stopDrag:function(){if(this.disabled||!this.dragging)return;this.dragging=!1;var target=this.groupClone(this.value.current);if(this.slide){var ratioChange=this.change;target[0]+=ratioChange[0]*4,target[1]+=ratioChange[1]*4}this.setTargetValue(target),this.result()},feedback:function(){var value=this.value.current;this.snap&&this.steps>1&&(value=this.getClosestSteps(value)),this.groupCompare(value,this.value.prev)||(typeof this.animationCallback=="function"&&this.animationCallback(value[0],value[1]),this.groupCopy(this.value.prev,value))},result:function(){typeof this.callback=="function"&&(this.callback(this.value.target[0],this.value.target[1]),this.locked=!1)},animate:function(direct,first){if(direct&&!this.dragging)return;if(this.dragging){var prevTarget=this.groupClone(this.value.target),offset=[Cursor.x-this.offset.wrapper[0]-this.offset.mouse[0],Cursor.y-this.offset.wrapper[1]-this.offset.mouse[1]];this.setTargetOffset(offset,this.loose),this.change=[this.value.target[0]-prevTarget[0],this.value.target[1]-prevTarget[1]]}(this.dragging||first)&&this.groupCopy(this.value.current,this.value.target);if(this.dragging||this.glide()||first)this.update(),this.feedback()},glide:function(){var diff=[this.value.target[0]-this.value.current[0],this.value.target[1]-this.value.current[1]];return!diff[0]&&!diff[1]?!1:(Math.abs(diff[0])>this.bounds.xStep||Math.abs(diff[1])>this.bounds.yStep?(this.value.current[0]+=diff[0]*this.speed,this.value.current[1]+=diff[1]*this.speed):this.groupCopy(this.value.current,this.value.target),!0)},update:function(){this.snap?this.offset.current=this.getOffsetsByRatios(this.getClosestSteps(this.value.current)):this.offset.current=this.getOffsetsByRatios(this.value.current),this.show()},show:function(){this.groupCompare(this.offset.current,this.offset.prev)||(this.horizontal&&(this.handle.style.left=String(this.offset.current[0])+"px"),this.vertical&&(this.handle.style.top=String(this.offset.current[1])+"px"),this.groupCopy(this.offset.prev,this.offset.current))},setTargetValue:function(value,loose){var target=loose?this.getLooseValue(value):this.getProperValue(value);this.groupCopy(this.value.target,target),this.offset.target=this.getOffsetsByRatios(target)},setTargetOffset:function(offset,loose){var value=this.getRatiosByOffsets(offset),target=loose?this.getLooseValue(value):this.getProperValue(value);this.groupCopy(this.value.target,target),this.offset.target=this.getOffsetsByRatios(target)},getLooseValue:function(value){var proper=this.getProperValue(value);return[proper[0]+(value[0]-proper[0])/4,proper[1]+(value[1]-proper[1])/4]},getProperValue:function(value){var proper=this.groupClone(value);return proper[0]=Math.max(proper[0],0),proper[1]=Math.max(proper[1],0),proper[0]=Math.min(proper[0],1),proper[1]=Math.min(proper[1],1),(!this.dragging&&!this.tapping||this.snap)&&this.steps>1&&(proper=this.getClosestSteps(proper)),proper},getRatiosByOffsets:function(group){return[this.getRatioByOffset(group[0],this.bounds.xRange,this.bounds.x0),this.getRatioByOffset(group[1],this.bounds.yRange,this.bounds.y0)]},getRatioByOffset:function(offset,range,padding){return range?(offset-padding)/range:0},getOffsetsByRatios:function(group){return[this.getOffsetByRatio(group[0],this.bounds.xRange,this.bounds.x0),this.getOffsetByRatio(group[1],this.bounds.yRange,this.bounds.y0)]},getOffsetByRatio:function(ratio,range,padding){return Math.round(ratio*range)+padding},getClosestSteps:function(group){return[this.getClosestStep(group[0]),this.getClosestStep(group[1])]},getClosestStep:function(value){var k=0,min=1;for(var i=0;i<=this.steps-1;i++)Math.abs(this.stepRatios[i]-value)<min&&(min=Math.abs(this.stepRatios[i]-value),k=i);return this.stepRatios[k]},groupCompare:function(a,b){return a[0]==b[0]&&a[1]==b[1]},groupCopy:function(a,b){a[0]=b[0],a[1]=b[1]},groupClone:function(a){return[a[0],a[1]]},preventDefaults:function(e,selection){e||(e=window.event),e.preventDefault&&e.preventDefault(),e.returnValue=!1,selection&&document.selection&&document.selection.empty()},cancelEvent:function(e){e||(e=window.event),e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0}},Dragdealer})