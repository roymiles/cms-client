var token = '6537901131';
var url = 'http://localhost/Api/';
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

    zeal.prototype.login = function (node) {
        var f = document.createElement("form");
        f.setAttribute('method',"post");
        f.setAttribute('action',url+"login");
        
        var i = document.createElement("input"); //input element, text
        i.setAttribute('type',"text");
        i.setAttribute('name',"username");
        i.setAttribute('class',"zeal-texbox");
        
        var s = document.createElement("input"); //input element, Submit button
        s.setAttribute('type',"submit");
        s.setAttribute('value',"Submit");
        s.setAttribute('class',"zeal-submit");
        
        f.appendChild(i);
        f.appendChild(s);
        
        document.node.appendChild(f); // Append the form to the node   
    };
    
    zeal.prototype.register = function (node) {
        // Create and render register form    
    };

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
    
    // Get and load the dependancies using token...
    var request = new XMLHttpRequest();
    request.open('GET', url+token+'/dependancies', true);
    
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        zeal.Extras.push(
            function () {
                // Push functions into zeal class
                this.data['name'] = data['fn'];
            }
        );
        
        
        } else {
            // We reached our target server, but it returned an error
            alert('Shit...');
        }
    };
    
    request.onerror = function() {
      // There was a connection error of some sort
    };
    
    request.send();
    
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
