lazyLoader = {
    load: function (scripts) {
        // The queue for the scripts to be loaded
        lazyLoader.queue = scripts;
        lazyLoader.pendingScripts = [];
        // There will always be a script in the document, at least this very same script... 
        // ...this script  will be used to identify available properties, thus assess correct way to proceed
        var firstScript = document.scripts[0];
        // We will loop thru the scripts on the queue
        for (i = 0; i < lazyLoader.queue.length; ++i) {
            // Evaluates if the async property is used by the browser
            if ('async' in firstScript ) {
                // Since src has to be defined after onreadystate change for IE, we organize all "element" steps together... 
                var element = document.createElement("script");
                element.type = "text/javascript"
                //... two more line of code than necessary but we add order and clarity
                // Define async as false, thus the scripts order will be respected
                element.async = false;
                element.src = lazyLoader.queue[i];
                document.head.appendChild(element);
            }
            // Somebody who hates developers invented IE, so we deal with it as follows:
            // ... In IE<11 script objects (and other objects) have a property called readyState...
            // ... check the script object has said property (readyState) ... 
            // ... if true, Bingo! We have and IE! 
            else if (firstScript.readyState) {
                // How it works: IE will load the script even if not injected to the DOM...
                // ... we create an event listener, we then inject the scripts in sequential order
                // Create an script element
                var element = document.createElement("script");
                element.type = "text/javascript"
                // Add the scripts from the queue to the pending list in order
                lazyLoader.pendingScripts.push(element)
                // Set an event listener for the script element 
                element.onreadystatechange = function() {
                    var pending;
                    // When the next script on the pending list has loaded proceed
                    if (lazyLoader.pendingScripts[0].readyState == "loaded" || lazyLoader.pendingScripts[0].readyState == "complete" ) {
                            // Remove the script we just loaded from the pending list
                            pending = lazyLoader.pendingScripts.shift()
                            // Clear the listener
                            element.onreadystatechange = null;
                            // Inject the script to the DOM, we don't use appendChild as it might break on IE
                            firstScript.parentNode.insertBefore(pending, firstScript);
                    }
                }
                // Once we have set the listener we set the script object's src
                element.src = lazyLoader.queue[i];
            }
        }
    }
};