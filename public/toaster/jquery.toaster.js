/**
 * jquery.toaster v1.1
 * copyright 2011 Rob Stortelers (Merula Softworks) - www.merulasoft.nl
 */
(function($){  
 $.toaster = function(options) {  
    
    var defaults = {  
	   showTime:1000, //Time visible in milliseconds
	   centerX:false, //Center horizontal
	   centerY:false  //Center vertical
	};  
	
	var options = $.extend(defaults, options);  
	
	var isQue = false; //is there a que?
	
	//create container
	var container = $('<div class="toast-container"></div>').appendTo('body');
	container.hide();
	var que = new Array();
	
	this.toast = function(text)
	{
		que.push(text);
		if(!isQue)
			NextToast();
	}
	
	function ShowToast(text)//show a toast
	{
		container.hide().text(text);
		CenterContainer();
		container.fadeIn(function(){
			setTimeout(HideToast, options.showTime);
		});
	}
	
	function CenterContainer() //center the container
	{
		if(options.centerX)
		{
			container.css("left","50%");
			container.css("margin-left","-"+container.outerWidth()/2+"px");
		}
		if(options.centerY)
		{
			container.css("top","50%");
			container.css("margin-top","-"+container.outerHeight()/2+"px");
		}
	}
	
	function HideToast()//hide current toast
	{
		container.fadeOut(function(){
			que.shift();
			NextToast();
		});
	}
	
	function NextToast() //show next toast in que
	{
		isQue = que.length > 0;
		if(isQue)
			ShowToast(que[0]);
	}
	
	return this;
 };  
})(jQuery);  