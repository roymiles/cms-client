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
    
    // Find all nodes with the 'zeal' class
    var obj = document.getElementsByClassName('zeal');
    var items = [].slice.call(obj)
    for (var i = 0, len = items.length; i < len; i++) {
      // Get module name
      items[i].dataset.columns
      
      // Check to see if this module is installed...
    }
});
