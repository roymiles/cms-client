var token = '6537901131';
var zeal = (function () {
    // Constructor
    function zeal(initially) {
        //stuff
        var i;
        for (i = 0; i < zeal.Extras.length; ++i) {
            zeal.Extras[i].apply(this);
        }
    }
    zeal.Extras = [];

    zeal.prototype.method1 = function () {/* stuff */};
    zeal.prototype.method2 = function () {/* stuff */};

    return zeal;
}());


var ready = function ( fn ) {

    // Sanity check
    if ( typeof fn !== 'function' ) return;

    // If document is already loaded, run method
    if ( document.readyState === 'complete'  ) {
        return fn();
    }

    // Otherwise, wait until document is loaded
    // The document has finished loading and the document has been parsed but sub-resources such as images, stylesheets and frames are still loading. The state indicates that the DOMContentLoaded event has been fired.
    document.addEventListener( 'interactive', fn, false );

    // Alternative: The document and all sub-resources have finished loading. The state indicates that the load event has been fired.
    // document.addEventListener( 'complete', fn, false );

};

// Example
ready(function() {
    // Do stuff...
    
    // Get and load dependancies using token...
    
    // Find all nodes with the 'zeal' class
    var obj = document.getElementsByClassName('zeal');
    var items = [].slice.call(obj)
    for (var i = 0, len = items.length; i < len; i++) {
        // Get module name
        var module = items[i].dataset.module;
        
        // Check if module is imported and if so call the function
        if (typeof zeal.prototype[module] == 'function') { 
            zeal.prototype[module](items[i]); // Pass the node dependancy into the module 
        }
      
        // Check to see if this module is installed...
    }
});
