var zeal = (function () {
    
	zeal.token = '6537901131';
	zeal.url = 'http://92.232.235.0/api/';
	zeal._API = zeal.url + zeal.token ;	

	zeal._isLoggedIn = 0; // Bool for to determine users state
	zeal._user; // Object to hold users details
	zeal._SESHID; // Users session ID
	zeal._CSRFTOKEN; // Unique token to prevent CSRF
	zeal._cachedUsers; // Cached user information
	
    // Constructor
    function zeal(initially) {
		console.log("Constructor for framework");
        for (var i = 0; i < zeal.Extras.length; ++i) {
            zeal.Extras[i].apply(this);
        }
    }
    zeal.Extras = [];
    
    
    zeal.prototype._userLookup = function (node) {
        // Check to see if this users object already exists if not request it from the API    
        if(typeof _cachedUsers[node.dataset.username] != 'undefined') {
            var request = new XMLHttpRequest();
            request.open('GET',  zeal._API+'/getUser/'+node.dataset.username , true); // Not implemented function
            
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
        if(!zeal.isLoggedIn){ return; }
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
			default:
				console.log(node.dataset.id + ' is an unknown data-id for the _security module');
        }  
    };
    
    zeal.prototype._loginForm = function (node) {
        if(zeal.isLoggedIn){ return; } // Don't show log in form if user is already logged in
        
		console.log(node);
		
        // Has admin specified a redirect URL? If not redirect to home
        var redirect = node.dataset.redirect ? node.dataset.redirect : '/';
        
        var f = document.createElement("form");
        f.setAttribute('id',"zeal-login");
        f.setAttribute('method',"post");
        f.setAttribute('action',zeal._API+"/login");
        f.setAttribute('onsubmit',"return zeal.prototype._loginSubmit('" + redirect + "')");
        
        var i = document.createElement("input"); // Username field
        i.setAttribute('id',"zeal-username");
        i.setAttribute('type',"text");
        i.setAttribute('name',"username");
        i.setAttribute('class',"zeal-texbox");
	        
	var il = document.createElement("Label");
	il.setAttribute("for", "zeal-username");
	il.setAttribute('class',"zeal-label");
	il.innerHTML = "Username";        
        
        var p = document.createElement("input"); // Password field
        p.setAttribute('id',"zeal-password");
        p.setAttribute('type',"text");
        p.setAttribute('name',"password");
        p.setAttribute('class',"zeal-texbox");     
        
	var pl = document.createElement("Label");
	pl.setAttribute("for", "zeal-password");
	pl.setAttribute('class',"zeal-label");
	pl.innerHTML = "Password";              
        
        var s = document.createElement("input"); // Submit element
        s.setAttribute('type',"submit");
        s.setAttribute('value',"Submit");
        s.setAttribute('class',"zeal-submit");
        
        f.appendChild(i);
        f.appendChild(p);
        f.appendChild(s);
        
        node.appendChild(f); // Append the form to the node 
    };
    
    zeal.prototype._loginSubmit = function (redirect) {
        var username = document.getElementById('zeal-username');
        zeal.prototype.login_isValid = true;
        if (zeal.prototype.login_isValid) {
            // Send the login request to the API
            var request = new XMLHttpRequest();
            request.open('POST',  zeal._API+'/login', true);
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
        if(!zeal.isLoggedIn){ return; } // Don't show logout form if user is not logged in  
        
        // Has admin specified a redirect URL? If not redirect to home
        var redirect = node.dataset.redirect ? node.dataset.redirect : '/';
        
        var f = document.createElement("form");
        f.setAttribute('id',"zeal-login");
        f.setAttribute('method',"post");
        f.setAttribute('action',_API+"/login");
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
        if(zeal.isLoggedIn){ return; } // Don't show register form if user is logged in  
        
        // Has admin specified a redirect URL? If not redirect to home
        var redirect = node.dataset.redirect ? node.dataset.redirect : '/';
        
        var f = document.createElement("form");
        f.setAttribute('id',"zeal-register");
        f.setAttribute('method',"post");
        f.setAttribute('action',zeal._API+"/register");
        f.setAttribute('onsubmit',"return zeal.prototype._logoutSubmit('" + redirect + "')");

        var i = document.createElement("input"); // Username field
        i.setAttribute('id',"zeal-username");
        i.setAttribute('type',"text");
        i.setAttribute('name',"username");
        i.setAttribute('class',"zeal-texbox");
        
	var il = document.createElement("Label");
	il.setAttribute("for", "zeal-username");
	il.setAttribute('class',"zeal-label");
	il.innerHTML = "Username";        
        
        var e = document.createElement("input"); // Email field
        e.setAttribute('id',"zeal-email");
        e.setAttribute('type',"text");
        e.setAttribute('name',"email");
        e.setAttribute('class',"zeal-texbox");  
        
	var el = document.createElement("Label");
	el.setAttribute("for", "zeal-email");
	el.setAttribute('class',"zeal-label");
	el.innerHTML = "Email";              
        
        var p = document.createElement("input"); // Password field
        p.setAttribute('id',"zeal-password");
        p.setAttribute('type',"text");
        p.setAttribute('name',"password");
        p.setAttribute('class',"zeal-texbox");   
        
	var pl = document.createElement("Label");
	pl.setAttribute("for", "zeal-password");
	pl.setAttribute('class',"zeal-label");
	pl.innerHTML = "Password";              

        var s = document.createElement("input"); // Submit element
        s.setAttribute('type',"submit");
        s.setAttribute('value',"Submit");
        s.setAttribute('class',"zeal-submit");
        
        // Append the elements to the form
        f.appendChild(i);
        f.appendChild(e);
        f.appendChild(p);
        f.appendChild(s);
        
        node.appendChild(f); // Append the form to the node        
        
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

	zeal.prototype._loginCheck = function () {
		if (document.cookie.indexOf("SESHID") >= 0) {
			// Validate this token throught the API
			var request = new XMLHttpRequest();
			request.open('GET',  zeal._API+'/'+zeal.prototype._readCookie('SESHID') , true);
			
			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					// Success!
					_user = JSON.parse(request.responseText);
					_isLoggedIn = true;
				} else {
					// We reached our target server, but it returned an error
					console.log('Failed to validate session ID. #1');
				}
			};
			
			request.onerror = function() {
			  // There was a connection error of some sort
			};
			
			request.send();
		} else {
			console.log("No session ID cookie");
		}
	}
	
	zeal.prototype._loadDependencies = function () {
		// Get and load the dependencies using token...
		var request = new XMLHttpRequest();
		request.open('GET',  zeal._API+'/dependencies', true);
		
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				// Success!
				var dependencies = JSON.parse(request.responseText);
				if(dependencies.references != 0){
					zeal.Extras.push(
						function () {
							// Push functions into zeal class
							this.data['name'] = data['fn'];
						}
					);
				} else {
					console.log('No dependencies to load');
				}


			}else{
				// We reached our target server, but it returned an error
				console.log('Failed to retrieve site dependencies. #1');
			}
		};
		
		request.onerror = function() {
			// There was a connection error of some sort
			console.log('Failed to retrieve site dependencies. #2');
		};
		
		request.send();
	}
	
	zeal.prototype._renderTemplates = function () {
		// Find all nodes with the 'zeal' class
		var obj = document.getElementsByClassName('zeal');
		var items = [].slice.call(obj);
		console.log(items.length + " templates to render");
		for (var i = 0, len = items.length; i < len; i++) {
			console.log('Rendering a template...');
			// Get module name
			var module = items[i].dataset.module;
			
			// Check if module is imported and if so call the function
			if (typeof zeal.prototype[module] == 'function') {
				console.log(zeal.prototype);
				console.log('Loading module');
				zeal.prototype[module](items[i]); // Pass the node dependancy into the module 
			} else {
				console.log(module + ' module does not exist');
			}
		  
			// Check to see if this module is installed...
		}
	}
    

    return zeal;
}());
