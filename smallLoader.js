smallLoader = {
    load: function (scripts) {
        smallLoader.queue = scripts;
        smallLoader.pendingScripts = [];
        var firstScript = document.scripts[0];
		for (i = 0; i < smallLoader.queue.length; ++i) {
        	if ('async' in firstScript ) {
   	            var element = document.createElement("script");
				element.type = "text/javascript";
				element.async = false;
        		element.src = smallLoader.queue[i];
        		document.head.appendChild(element);
            }
            else if (firstScript.readyState) {
            	element = document.createElement("script");
				element.type = "text/javascript";
                smallLoader.pendingScripts.push(element);
                element.onreadystatechange = function() {
	                var pending;
	            	if (smallLoader.pendingScripts[0].readyState == "loaded" || smallLoader.pendingScripts[0].readyState == "complete" ) {
		        	     	pending = smallLoader.pendingScripts.shift();
		        	        element.onreadystatechange = null;
		                    firstScript.parentNode.insertBefore(pending, firstScript);
			        }
				};
				element.src = smallLoader.queue[i];
        	}
        }
    }
};