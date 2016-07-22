var token = '6537901131';
var url = 'http://localhost/Api/';
var _API = url + token;

var _isLoggedIn; // Bool for to determine users state
var _user; // Object to hold users details
var _SESHID; // Users session ID
var _CSRFTOKEN; // Unique token to prevent CSRF
var _cachedUsers; // Cached user information

var zeal = (function () {
    
    // Constructor
    function zeal(initially) {
        var i;
        for (i = 0; i < zeal.Extras.length; ++i) {
            zeal.Extras[i].apply(this);
        }
    }
    zeal.Extras = [];
    
    
    zeal.prototype._userLookup = function (node) {
        // Check to see if this users object already exists if not request it from the API    
        if(typeof _cachedUsers[node.dataset.username] != 'undefined') {
            var request = new XMLHttpRequest();
            request.open('GET', _API+'/getUser/'+node.dataset.username , true); // Not implemented function
            
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    // Success!
                    _cachedUsers = JSON.parse(request.responseText);
                    document.node.appendChild(node.dataset.value);
                } else {
                    // We reached our target server, but it returned an error
                    console.log('Failed to retrieve user information');
                }
            };
            
            request.onerror = function() {
                // There was a connection error of some sort
                console.log('Failed to connect to the server for a userLookup');
            };
            
            request.send();     
        }
    };    
    
    zeal.prototype._user = function (node) {
        if(!isLoggedIn){ return; }
        switch(node.dataset.id){
            case 'id':
                var content = (_user.id ? _user.id : 'Empty ID');
                node.innerHTML(content)
                break;
                
            case 'username':
                var content = (_user.username ? _user.username : 'Empty Username');
                node.innerHTML(content)
                break;
        }      
    };

    zeal.prototype._security = function (node) {
        switch(node.dataset.id){
            case 'loginForm':
                zeal.prototype._loginForm(node);
                break;
            case 'registerForm':
                zeal.prototype._registerForm(node);
                break;                
        }  
    };
    
    zeal.prototype._loginForm = function (node) {
        if(isLoggedIn){ return; } // Don't show log in form if user is already logged in
        
        // Has admin specified a redirect URL? If not redirect to home
        var redirect = node.dataset.redirect ? node.dataset.redirect : '/';
        
        var f = document.createElement("form");
        f.setAttribute('id',"zeal-login");
        f.setAttribute('method',"post");
        f.setAttribute('action',_API+"login");
        f.setAttribute('onsubmit',"return zeal.prototype._loginSubmit('" + redirect + "')");
        
        var i = document.createElement("input"); // Username field
        i.setAttribute('id',"zeal-username");
        i.setAttribute('type',"text");
        i.setAttribute('name',"username");
        i.setAttribute('class',"zeal-texbox");
        
        var p = document.createElement("input"); // Password field
        p.setAttribute('id',"zeal-password");
        p.setAttribute('type',"text");
        p.setAttribute('name',"password");
        p.setAttribute('class',"zeal-texbox");        
        
        var s = document.createElement("input"); // Submit element
        s.setAttribute('type',"submit");
        s.setAttribute('value',"Submit");
        s.setAttribute('class',"zeal-submit");
        
        f.appendChild(i);
        f.appendChild(p);
        f.appendChild(s);
        
        document.node.appendChild(f); // Append the form to the node 
    };
    
    zeal.prototype._loginSubmit = function (redirect) {
        var username = document.getElementById('zeal-username');
        zeal.prototype.login_isValid = true;
        if (zeal.prototype.login_isValid) {
            // Send the login request to the API
            var request = new XMLHttpRequest();
            request.open('POST', url + token + '/login', true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send(username);
         
            var data = JSON.parse(request.responseText);
            if(data == 'sucess') {
                zeal.prototype._createCookie('SESHID', data['SESHID'], 7); // Store the cookie for a week
                window.location.replace(redirect);
            }else{
                // Invalid credentials..
                console.log('Invalid credentials');
            }
            
        }
        return false; // Stop form from submitting
    };
    
    zeal.prototype._logoutForm = function (node) {
        if(!isLoggedIn){ return; } // Don't show logout form if user is not logged in  
        
        // Has admin specified a redirect URL? If not redirect to home
        var redirect = node.dataset.redirect ? node.dataset.redirect : '/';
        
        var f = document.createElement("form");
        f.setAttribute('id',"zeal-login");
        f.setAttribute('method',"post");
        f.setAttribute('action',_API+"login");
        f.setAttribute('onsubmit',"return zeal.prototype._logoutSubmit('" + redirect + "')");

        var s = document.createElement("input"); // Submit element
        s.setAttribute('type',"submit");
        s.setAttribute('value',"Submit");
        s.setAttribute('class',"zeal-submit");
        
        f.appendChild(s);
        
        document.node.appendChild(f); // Append the form to the node         
    };
    
    zeal.prototype._logoutSubmit = function () {
        // Delete user object and redirect if specified
        zeal.prototype._eraseCookie('SESHID');
        window.location.replace(redirect);
    };
    
    // Create and render register form 
    zeal.prototype._registerForm = function (node) {
        if(!isLoggedIn){ return; } // Don't show logout form if user is not logged in  
        
        // Has admin specified a redirect URL? If not redirect to home
        var redirect = node.dataset.redirect ? node.dataset.redirect : '/';
        
        var f = document.createElement("form");
        f.setAttribute('id',"zeal-register");
        f.setAttribute('method',"post");
        f.setAttribute('action',_API+"register");
        f.setAttribute('onsubmit',"return zeal.prototype._logoutSubmit('" + redirect + "')");

        var i = document.createElement("input"); // Username field
        i.setAttribute('id',"zeal-username");
        i.setAttribute('type',"text");
        i.setAttribute('name',"username");
        i.setAttribute('class',"zeal-texbox");
        
        var e = document.createElement("input"); // Email field
        e.setAttribute('id',"zeal-email");
        e.setAttribute('type',"text");
        e.setAttribute('name',"email");
        e.setAttribute('class',"zeal-texbox");        
        
        var p = document.createElement("input"); // Password field
        p.setAttribute('id',"zeal-password");
        p.setAttribute('type',"text");
        p.setAttribute('name',"password");
        p.setAttribute('class',"zeal-texbox");        

        var s = document.createElement("input"); // Submit element
        s.setAttribute('type',"submit");
        s.setAttribute('value',"Submit");
        s.setAttribute('class',"zeal-submit");
        
        // Append the elements to the form
        f.appendChild(i);
        f.appendChild(e);
        f.appendChild(p);
        f.appendChild(s);
        
        document.node.appendChild(f); // Append the form to the node        
        
    };
    
    zeal.prototype._registerSubmit = function (node) {
        // On submit of the register form   
    };    
    
    zeal.prototype._resetPasswordForm = function (node) {
        // Create and render the reset password form 
    };    
    
    zeal.prototype._resetPasswordSubmit = function (node) {
        // On submit of the reset password form
    };    
    
    
    zeal.prototype._createCookie = function (name, value, days) {
    	if (days) {
    		var date = new Date();
    		date.setTime(date.getTime()+(days*24*60*60*1000));
    		var expires = "; expires="+date.toGMTString();
    	}
    	else var expires = "";
    	document.cookie = name+"="+value+expires+"; path=/";
    }
    
    zeal.prototype._readCookie = function (name) {
    	var nameEQ = name + "=";
    	var ca = document.cookie.split(';');
    	for(var i=0;i < ca.length;i++) {
    		var c = ca[i];
    		while (c.charAt(0)==' ') c = c.substring(1,c.length);
    		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    	}
    	return null;
    }
    
    zeal.prototype._eraseCookie = function (name) {
    	createCookie(name,"",-1);
    }    
    

    return zeal;
}());


var ready = function (fn) {

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

    // Is the user logged in
    if (document.cookie.indexOf("SESHID") >= -1) {
        // Validate this token throught the API
        var request = new XMLHttpRequest();
        request.open('GET', url+token+'/'+zeal.prototype._readCookie('SESHID') , true);
        
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                _user = JSON.parse(request.responseText);
                _isLoggedIn = true;
            } else {
                // We reached our target server, but it returned an error
                console.log('Failed to validate session ID');
            }
        };
        
        request.onerror = function() {
          // There was a connection error of some sort
        };
        
        request.send();
    }
    
    // Get and load the dependancies using token...
    var request = new XMLHttpRequest();
    request.open('GET', _API+'/dependancies', true);
    
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
            console.log('Failed to retrieve site dependancies');
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
