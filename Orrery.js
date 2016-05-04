/*************************************************************************************************************/

/**
 ** File: Orrery.js
 ** Date Written: January 16, 2012
 ** Date Last Updated: February 10, 2012
 ** Written By: Timothy "Popisfizzy" Reilly
 **/

/**
 ** Purpose.
 **   This file implements the main Orrery singleton. It's the primary class used by the library to handle
 ** the implementation of a game, and all the elements of the game, such as the player, the canvas, characters,
 ** input, the map, constants, and so on.
 **/

/*
 * Includes
 */

// Due to technical limitations of Javascript, includes are located in Orrery.Initialize(). In all other Orrery
// files, they are included in the header. Included files are, thus, listed below:

// Orrery.Extensions/Orrery.Constant.js
// Orrery.Extensions/Orrery.Browser.js
// Orrery.Extensions/Orrery.OperatingSystem.js
// Orrery.Client/Client.js
// Orrery.Player/Player.js
// Orrery.Game/Game.js
// Orrery.Resource/Resource.js

/*
 * Class definition.
 */

var Orrery = {

  /*
   * Basic Orrery variables.
   */

  // The time the window was loaded. In most situations, this should also be very, very close to the time the
  // window, browser, tab, or etc. was opened.
  LaunchTime : null,

  /*
   * Below we implement a few read-only properties that give easy-access to a few useful pieces of data, such
   * as the current time, the height of the page, the directory, the user's screen resolution, etc.
   */
  
  // The current time.
  get Time()            { return (new Date()).getTime(); },
  
  // The time since the window was loaded.
  get TimeSinceLaunch() { return this.Time() - this.LaunchTime; },

  // The directory the Orrery.js file was included from.
  get Directory()
  {
    var path = window.location.href.split('/');
    path.length --;
    return path.join('/') + '/';
  },
  
  // The viewport. In browsers, this is the window element.
  get Viewport() { return window; },
  
  // The available width of the viewport.
  get ViewportWidth()
  {
    if((typeof window.innerWidth) != 'undefined')
      // This is what standards-complient browsers should use.
      return window.innerWidth;

    if( ((typeof document.documentElement) != 'undefined') &&
        ((typeof document.documentElement.clientWidth) != 'undefined') &&
        (document.documentElement.clientWidth != 0) )
      // 'Standards-complient' IE6.
      return document.documentElement.clientWidth;

    else
      // Older versions of IE.
      return document.getElementsByTagName('body')[0].clientWidth;
  },
  
  // The available height of the viewport.
  get ViewportHeight()
  {
    if((typeof window.innerHeight) != 'undefined')
      // Standards-complient browsers.
      return window.innerHeight;

    if( ((typeof document.documentElement) != 'undefined') &&
        ((typeof document.documentElement.clientHeight) != 'undefined') &&
        (document.documentElement.clientHeight != 0) )
      // 'Standards-complient' IE6.
      return document.documentElement.clientHeight;

    else
      // Older versions of IE.
      return document.getElementByTagName('body')[0].clientHeight;
  },
  
  Screen : {
    // Some special properties related to the screen.
    
    // The screen resolution.
    get Resolution()  { return screen.width + 'x' + screen.height; },

    // The width of the resolution.
    get ResolutionX() { return screen.width; },
    
    // The height of the resolution.
    get ResolutionY() { return screen.height; },
    
    // The color depth, in bits-per-pixel.
    get ColorDepth() { return screen.colorDepth; }
  },
  
  /*
   * Internal class definitions. That is, classes that are defined in this file rather than a file that will
   * be included later, or other such situations.
   */
  
  Loader : {
    /*
     * The loader class is used to load external files for dynamic resources, such as .js files, stylesheets,
     * and audio-visual files. The Orrery.Resource load methods use Orrery.Loader to actually load their data.
     * The primary reason to use the Orrery.Resource classes is that they cache data if requested, and they
     * automatically generate the necessary class for the Loader.Load() method.
     */
    
    /*
     * Variables.
     */
    
    // Default time out, in milliseconds. Negative values indicate that there is no timeout. This is the default
    // behavior.
    timeout : -1,
    
    ResourceType : {
      // Constants that indicate resource type.
      
      // Text resources. SCRIPT refers to Javascript code, and STYLESHEET refers to CSS data.
      SCRIPT     : 1,
      STYLESHEET : 2,
      
      // These refer to other kinds of resources. IMAGE is any static or semi-static visual resource, such as
      // picture or image files like PNG, JPG or GIF files. AUDIO refers to audio files, such as OGG or MP3.
      // VISUAL refers to non-static audiovisual files, like FLV or MP4.
      IMAGE  : 3,
      AUDIO  : 4,
      VISUAL : 5
    },
    
    LoadState : {
      // The different loading states that a resource can be in.
      
       // No load state. That is, loading has not begun.
      NONE : 0,
      
       // Loading has begun. No results from this data.
      PROCESSING : 1,
      
      // Successfully loaded.
      LOAD : 2,
      
      // An error state has occurred. The file may not exist or the URL is invalid.
      ERROR : 4,
      
      // The user has aborted loading.
      ABORT : 8,
      
      // The filed has timed out while trying to retrieve it.
      TIMEOUT : 16,
      
      // A failure state of ERROR, ABORT, or TIMEOUT has been reached.
      FAILURE : 4 | 8 | 16, // this.ERROR | this.ABORT | this.TIMEOUT,
      
      // Processing has completed. This means the file has successfully loaded, reached an error state,
      // been aborted, or timed out.
      COMPLETE : 2 | (4 | 8 | 16), // this.LOAD | this.FAILURE,
      
    },
  
    /*
     * Event handlers.
     */
    
    // Called when a load is successful.
    onload : null,
    
    // When an error occurs in loading. This is most typically due to an invalid URL or a non-existant file.
    onerror : null,
    
    // When the user causes a load to abort, such as by cancelling loading, closing a browser, window, or tab, or
    // going to a new page (such as by clicking a hyperlink).
    onabort : null,
    
    // Caused by a failure of the resource to load in a timely manner, as specified by the programmer.
    ontimeout : null,
    
    // Called when any error state occurs. That is, when any of onerror, onabort, or ontimeout are called, then
    // onfailure is called as well.
    onfailure : null,
    
    // Called when any of onload, onerror, onabort, or ontimeout are called. Whenever loading of a resource is
    // completed in one way or another, this event is called.
    oncomplete : null,

    /*
     * Methods.
     */

    Load : function (source, data)
    // Primary method to load resources. source is the URL to load from, while data is an object with methods
    // and variables that ovewrite the default Orrery.Loader values. Additionally, data must contain the type of
    // resource being loaded, with values from Loader.ResourceType. If the default methods are to be ignored,
    // with no replacmenet function, then data must include the variable with the value as null.
    
    /**
     ** NOTE: Currently only loading scripts and images is supported. Media content (audio and video) is gonna
     ** be god damned annoying to implement, and loading stylesheets is just a pain because of current browser
     ** implementations of their related event handling: They basically have none!
     **/
    {
      /*
       * Error states that can not be corrected by the Load() method. This means the programmer passed invalid
       * data to the method. Each error state throws an exception.
       */
    
      if((typeof data) != 'object')
        // The data argument must represent an object, and it must have a type variable, which indicates the load
        // type for the data being processed.
        throw new Error('Can not load resources without a data object.');
      
      if((typeof source) != 'string')
        // source must be a string, as a URL is always what the data will be loaded from, and URLs are always
        // strings.
        throw new Error('Source URL can not be loaded from. Data is not a string.');
      
      if((typeof data.type) == 'undefined')
        // The data.type property of data must be defined. Without it, the Loader.Load() method does not know how
        // to handle the data.
        throw new Error('Data object must have type variable to indicate load type.');
      
      if((typeof data.type) != 'number')
        // The data.type property must be numeric.
        throw new Error('The type variable of the data object must be numeric.');
      
      if(!(data.type in [this.SCRIPT, this.STYLESHEET, this.IMAGE, this.AUDIO, this.VISUAL]))
        // And, lastly, the data.type property must be one of the values above.
        throw new Error('The type variable of the data object has an invalid value.');
      
      /*
       * Now filter in the proper values for the various event handler methods. If we have an example event
       * handler method data.onevent, then if data.onevent is a function, that function will be performed. If it
       * is present but not a function, no action will be performed. If it is not present, then Loader.onevent
       * method will be used if it exists.
       */
      
      data = {
      
        // Set the onload event handler.
        
        onload : (typeof data.onload) == 'undefined' ?
                    // If data.onload is not present at all, then use Orrery.Loader.onload.
                    this.onload
                    : (
                      (typeof data.onload) == 'function' ?
                        // If data.onload is present as a function, then use it.
                        data.onload
                        
                        // If it is present, but not a function, then store null here. This means that there is
                        // no event handler when loading occurs.
                        : null
                    ),
      
        // Set the onerror event handler.
        
        onerror : (typeof data.onerror) == 'undefined' ?
                    // onerror is not present, so use Orrery.Loader.onerror.
                    this.onerror
                    : (
                      (typeof data.onerror) == 'function' ?
                        // data.onload is present and a function, so use it.
                        data.onerror
                        
                        // data.onload is present, but not a function. Store null so no event handling occurs.
                        : null
                    ),
        
        // Etc.
        onabort : (typeof data.onabort) == 'undefined' ? this.onabort :
          ( (typeof data.onabort) == 'function' ? data.onabort : null ),
        ontimeout : (typeof data.ontimeout) == 'undefined' ? this.ontimeout :
          ( (typeof data.ontimeout) == 'function' ? data.ontimeout : null ),
        onfailure : (typeof data.onfailure) == 'undefined' ? this.onfailure :
          ( (typeof data.onfailure) == 'function' ? data.onfailure : null ),
        oncomplete : (typeof data.oncomplete) == 'undefined' ? this.oncomplete :
          ( (typeof data.oncomplete) == 'function' ? data.complete : null ),
        
        // If data.timeout is present, then it must be numeric. If it's not, it will be set to -1. If it is, then
        // its value will be used. If it is not present, Loader.timeout will be used.
        
        timeout : (typeof data.timeout) == 'undefined' ? this.timeout :
          ( (typeof data.timeout == 'number') ? data.timeout : -1 ),
        
        // We've already filtered for data.type, so it should be valid.
        type : data.type,
        
        // Variable that will be used to track the status of loading.
        status : (typeof data.status) == 'undefined' ? null : data.status,
        
        // The resource that is being loaded (or is attempting to be loaded).
        resource : null,
        
        // The source file.
        source : source
      };
      
      /*
       * Next, we actually attempt to load the resource. Different resources will have different load methods.
       */
      
      if(data.type == this.ResourceType.SCRIPT)
      // This handles the loading of a new script resource. Orrery assumes that the type of the script is simply
      // the "type/javascript" MIME type, and does not currently support any other types.
      {
        // Nothing at all has begun yet.
        data.status = this.LoadState.NONE;
      
        // Generate the HTMLScriptElement object.
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = source;
        
        // Set the event handlers. Note that under HTML5 standards, the HTMLScriptElement does not have an
        // onabort event. Thus, none will be used here.
        
        // Used in the inner functions to keep a clear reference to what 'this' should be, without doing
        // any binding.
        var _this = this;
        
        // The head. This will be what the script element is attached to, and possibly detached from.
        var head = document.getElementsByTagName('head')[0];
        
        script.onload = function (event)
        // The standard implementation of onload for a script. This event is called when a script finishes
        // loading successfully. Be wary, though: Browser implementations of what 'successfully' mean are a bit
        // odd. For example, a file with errors in the code or a non-javascript file will still fire the onload
        // event. Basically, onload means *a* file was loaded, not necessarily a syntactically-valid Javascript file.
        {
          if((data.status & _this.LoadState.COMPLETE) == 0)
          // Check and see if another load state has occurred. This shouldn't be the case, but we will check just
          // to be careful.
          {
            // The file has successfully been loaded.
            data.status = _this.LoadState.LOAD;
            
            if((typeof data.onload) == 'function')
              // If the data.onload event handler is present, use it.
              data.onload(event, script, data);
            
            if((typeof data.oncomplete) == 'function')
              // If the data.oncomplete event handler is present, then call it.
              data.oncomplete(event, script, data);
          }
          else
          // If it has, we need to detach the script. We'll do that here.
          {
            // Clear out the URL script is pointing to, and then remove it from head. This should successfully
            // detach the child node.
            script.src = null;
            head.removeChild(script);
          }
        };
        
        script.onreadystatechange = function (event)
        // Fuckin' IE. IE (or maybe just pre-9 versions) use this instead of standard methods for information
        // such as loading.
        {
          if( (script.readyState == 'loaded') || (script.readyState == 'complete') )
          // IE uses the script.readyState variable to indicate the state of the script. Both 'loaded' and
          // 'complete' indicate the script is finished.
          {
            if((data.status & _this.LoadState.COMPLETE) == 0)
            // Preferably, when the code reaches this point no other states have occurred. That is, it has
            // loaded and not, e.g., timed out.
            {
              // Flag the the script has successfully been loaded.
              data.status = _this.LoadState.LOAD;
              
              // Now, call the onload and oncomplete events, if they are present.
              
              if((typeof data.onload) == 'function')
                data.onload(event, script, data);
              if((typeof data.oncomplete) == 'function')
                data.oncomplete(event, script, data);
            }
            else
            // If we have reached another state, detach the script.
            {
              script.src = null;
              head.removeChild(script);
            }
          }
        };
        
        script.onerror = function (event)
        // Called when there is an error in loading the script. Unfortunately, this does not actually do
        // anytyhing under current implementations. It's just here in hope.
        {
          if((data.status & _this.LoadState.COMPLETE) == 0)
          // As usual, no other states should have occurred.
          {
            // Update the status to indicate an error has occurred.
            data.status = _this.LoadState.ERROR;
            
            if((typeof data.onerror) == 'function')
              // Call the onerror event, if it is present.
              data.onerror(event, script, data);
            
            if((typeof data.onfailure) == 'function')
              // Call the onfailure event, if it's present.
              data.onfailure(event, script, data);
            
            if((typeof data.oncomplete) == 'function')
              // Call the oncomplete event, if it is present.
              data.oncomplete(event, script, data);
            
            // Now we try to detach the script from the head.
            
            script.src = null;
            head.removeChild(script);
          }
        };
        
        // Now, attach the HTMLScriptElement object to head. This also causes the browser to begin an attempt to
        // load the script. Additionally, we update the loading status.
        head.appendChild(script)
        data.status = this.LoadState.PROCESSING;
        
        if( (data.timeout != null) && (data.timeout > 0) )
        // Now that we've started loading the script, we can see if it can time out. As mentioned before, a
        // timeout only occurs if data.timeout is positive.
        {
          setTimeout( function (event)
            {
              if((data.status & _this.LoadState.COMPLETE) == 0)
              // If no other states have occurred in the meantime, then a time out has occurred.
              {
                // Update the status to reflect this.
                data.status = _this.LoadState.TIMEOUT;
                
                // Call the necessary event handlers.
                
                if((typeof data.ontimeout) == 'function')
                  data.ontimeout(event, script, data);
                if((typeof data.onfailure) == 'function')
                  data.onfailure(event, script, data);
                if((typeof data.oncomplete) == 'function')
                  data.oncomplete(event, script, data);
                
                // And now, remove the script element from the head.
                script.src = null;
                head.removeChild(script);
              }
            }, data.timeout);
        }
        
        // Now that we're done, mark the script as the resource, and return the data object.
        data.resource = script;
        return data;
      }
      
      else if(data.type == this.ResourceType.IMAGE)
      // Loading an image.
      {
        // As above, nothing has happened yet, so set the status to indicate that.
        data.status = this.LoadState.NONE;
        
        // Generate the HTML DOM image object.
        var image = document.createElement('img');
        
        // Used to keep a reference to what 'this' should be, inside methods.
        var _this = this;
        
        // Now set the event handlers.
        
        image.onload = function (event)
        // Called when the image is successfully loaded.
        {
          if((data.status & _this.LoadState.COMPLETE) == 0)
          // It shouldn't be possible that another state has occurred.
          {
            // The file has been successfully loaded.
            data.status = _this.LoadState.LOAD;
            
            if((typeof data.onload) == 'function')
              // If data.onload is a function, call it. The event it delegates has successfully occured.
              data.onload(event, image, data);
            
            if((typeof data.oncomplete) == 'function')
              // Same as above, but for data.oncomplete.
              data.onload(event, image, data);
          }
          else
          // If, somehow, another state *has* occurred, we'll just 'unload' the image by redirecting its source.
          {
            image.src = null;
          }
        };
        
        image.onabort = function (event)
        // If the user aborts the attempt to load the image, either by cancelling the loading or clicking on
        // something such as a link, which redirects the page, or closes a tab or window.
        {
          if((data.status & _this.LoadState.COMPLETE) == 0)
          // So long as no other state has occurred, continue normal onabort functionality.
          {
            // Update the status to reflect the abortion.
            data.status = _this.LoadState.ABORT;
            
            // Call the relevant event handlers, if they exist.
            
            if((typeof data.onabort) == 'function')
              data.onabort(event, image, data);
            if((typeof data.onfailure) == 'function')
              data.onfailure(event, image, data);
            if((typeof data.oncomplete) == 'function')
              data.oncomplete(event, image, data);
            
            // And now, unload the image.
            image.src = null;
          }
        };
        
        image.onerror = function (event)
        // If an error occurs. This is either caused by an invalid URL, a file that is not present at the URL, or
        // a file that can not be read (perhaps by being either corrupted, an unknown file type, or a non-image
        // file).
        {
          if((data.status & _this.LoadState.COMPLETE) == 0)
          // No other state should have occurred.
          {
            // Update the status.
            data.status = _this.LoadState.ERROR;
            
            // Event handlers.
            
            if((typeof data.onerror) == 'function')
              data.onerror(event, image, data);
            if((typeof data.onfailure) == 'function')
              data.onfailure(event, image, data);
            if((typeof data.oncomplete) == 'function')
              data.oncomplete(event, image, data);
            
            // And now, unload.
            image.src = null;
          }
        };
        
        // Now being loading the image, and update the status.
        image.src = source;
        data.status = this.LoadState.PROCESSING;
        
        if( (data.timeout != null) && (data.timeout > 0) )
        // If there is a timeout present, then we'll start a check for it.
        {
          setTimeout( function (event)
            {
              if((data.status & _this.LoadState.COMPLETE) != 0)
              // If and only if another resource state has not occurred in the timeout interval will we move
              // forward with calling the event handler.
              {
                // Update the status to reflect the timeout.
                data.status = _this.LoadState.TIMEOUT;
                
                // Call the relevant event handlers.
                
                if((typeof data.ontimeout) == 'function')
                  data.ontimeout(event, image, data);
                if((typeof data.onfailure) == 'function')
                  data.onfailure(event, image, data);
                if((typeof data.oncomplete) == 'function')
                  data.oncomplete(event, image, data);
                  
                // Unload the image.
                image.src = null;
              }
            }, data.timeout);
        }
        
        // Attach the image to the data.resource property, and and return the data object.
        data.resource = image;
        return data;
      }
    },
  
  },
  
  IncludeManager : {
    /*
     * This method handles files that are included via the Orrery.include() method, though it must be
     * specifically included as the data object, and IncludeManager.PreLoad() must be specifically
     * included as the preload function. All default Orrery files will use this class.
     /

    /*
     * Class variables.
     */
    
    // The program gives a timeout of 3500 seconds for each file.
    timeout : 3500,
    
    // The total amount of files that have loaded.
    Includes : 0,
    
    // The total amount of files that are attempting to load.
    IncludeMax : 0,
    
    /*
     * Class methods.
     */
    
    preload : function ()
    // Increments IncludeMax to indicate another file has been included.
    {
      this.IncludeMax ++;
    },
    
    onload : function (event, script, data)
    // Indicates a file has been successfully loaded.
    {
      // Increment Includes to indicate another file has successfully been loaded.
      this.Includes ++;
      
      if((typeof Orrery.onload) == 'function')
        // If Orrery.onload is defined, then call it, along wtih the event, script, and data aarguments.
        Orrery.onload(event, script, data);
      
      if( (this.Includes == this.IncludeMax) && ((typeof Orrery.oncomplete) == 'function') )
        // If all the files have been included, and if Orrery.oncomplete is a function, then call
        // Orrery.oncomplete
        Orrery.oncomplete();
    },
    
    onfailure : function (event, script, data)
    // This method is called if a file fails to load. Under the current W3C specifications, this basically
    // means it must've timed out, though I'm still using onfailure just in-case this changed.
    {
      if(this.Includes < this.IncludeMax)
      // Double check that onfailure isn't being called erroneous.
      {
        // Call this to ensure that onload can not be called.
        this.IncludeMax ++;
        
        if((typeof Orrery.onfailure) == 'function')
          // If the Orrery.onfailure method is defined, call it.
          Orrery.onfailure(data);
      }
      else
        // If it is, throw an exception.
        throw new Error('Erroneous call of Orrery.IncludeManager.onfail: All files have loaded.');
    },
    
    /*
     * By default, all the other methods are undefined, and do not use the default Orrery.Loader methods.
     */
    
    onabort    : null,
    onerror    : null,
    ontimeout  : null,
    oncomplete : null
  
  },
  
  /*
   * Here are external classes, which are classes defined in external files that are later included.
   */
  
  // Stores all the global constants used by Orrery. Some of these constants are defined in other files, but they
  // will always be present in the Orrery.Constant class, with the same values. 
  // Defined in: Orrery.Extensions/Orrery.Constant.js
  Constant : null,
  
  // These store methods that can be used to determine what browser, browser version, rendering engine, and
  // rendering engine version a user is using. As these two classes serve a very similar, related purpose, they
  // are defined in the same file.
  // Defined in: Orrery.Extensions/Orrery.Browser.js
  Browser : null,
  RenderingEngine : null,
  
  // This stores methods that can be used to determine what operating system a user is using.
  // Defined in: Orrery.Extensions/Orrery.OperatingSystem.js 
  OperatingSystem : null,
  
  // This stores client information about a user. This, thus, is what stores information about a player's
  // characters, their local information, etc. Clients must be manually assigned a player character, but a client
  // will have information automatically stored on initialization unless overwritten. A client may have multiple
  // players.
  // Defined in: Orrery.Client/Client.js
  Client : null,
  
  // This stores information on a player's avatar on-screen, including information such as input handling and
  // position information. All players have exactly one client.
  // Defined in: Orrery.Player/Player.js
  Player : null,
  
  // This stores game information, such as calculated latency, current FPS, target FPS, and in-game tick
  // information. It also stores the game loop.
  // Defined in Orrery.Game/Game.js
  Game : null,
  
  // This is a singleton class that is used as an assistant for loading resources, such as stylesheets, images,
  // video, etc. It provides wrappers for multimedia data, and will also cache and store data unless otherwise-
  // instructed not to.
  // Defined in Orrery.Resource/Resource.js
  Resource : null,
  
  /*
   * Miscellaneous classes. These provide a point for a programmer to attach certain classe that they may use
   * later, such as for memory and connections.
   */
  
  Storage : {
    // These are used as clear points to access data storage for the end programmer to use. Presumably, Local
    // would be used to store something like cookies and/or the HTML5 localStorage system, and Server would
    // use WebSockets or AJAX to store things on an external server.

    Local : null,
    Server : null
  },
  
  // Use to store a connection to a server, either through AJAX, long-polling, or WebSockets.
  Connection : null,
  
  /*
   * Finally, here are our class-level methods.
   */
  
  Initialize : function ()
  // This is the initialization method of the class. Largely, it sets some of the basic variables, calls the
  // Orrery.onload method, which is user-specified, and includes the necessary subfiles. This file can not
  // have includes at the header because Orrery is not defined at that point. All other files can, and should,
  // have the includes there though.
  {
    // This is where the basic variables will be initialized. Currently, this only includes the launch time.
    this.LaunchTime = this.Time;
    
    // We bind the preload, onload, and onfailure methods of Orrery.IncludeManager to Orrery.IncludeManager.
    
    this.IncludeManager.preload = this.IncludeManager.preload.bind(this.IncludeManager);
    this.IncludeManager.onload = this.IncludeManager.onload.bind(this.IncludeManager);
    this.IncludeManager.onfailure = this.IncludeManager.onfailure.bind(this.IncludeManager);
    
    /*
     * Includes
     */
    
    Include('Orrery.Extensions/Orrery.Constant.js');
    Include('Orrery.Extensions/Orrery.Browser.js');
    Include('Orrery.Extensions/Orrery.OperatingSystem.js');
    Include('Orrery.Client/Client.js');
  },
  
  // This function will be called after Orrery has finished initializing. It takes no arguments.
  oncomplete : null,
  
  // This function will be called after each individdual Orrery file has been loaded. It takes arguments for
  // the event handler called, the HTMLSourceObject, and the data object.
  onload : null,
  
  // This function will be called if Orrery has failed to load all files. It takes an argument for the data
  // object.
  onfailure : null,
  
  include : function (source, callback, preload)
  // This function is used to include other, external files into the browser. source is the URL to the file, and
  // callback is either a function, which will be used as the onload function, or an object, which is the object
  // type used by Orrery.Loader.Load(). Check that method for more information. preload indicates a function to
  // be run before the file attempts to load.
  {
    if((typeof preload) == 'function')
      // If preload is present and a function, call it.
      preload();
  
    if((typeof callback) == 'function')
    // Here, we create a very simple data object, with just type and the onload method.
    {
      return this.Loader.Load(source, {
          type : this.Loader.ResourceType.SCRIPT,
          onload : callback
        });
    }
    else if((typeof callback) == 'object')
    // If callback is actually an object, then we verify that type = this.Loader.ResourceType.SCRIPT, and then we
    // run the method. Other than checking what type is, we won't do any verification. Some will be done in the
    // this.Loader.Load() method, and the rest will just be the assumption that the programmer has passed valid
    // information.
    {
      callback.type = this.Loader.ResourceType.SCRIPT;
      return this.Loader.Load(source, callback);
    }
    else if( ((typeof callback) == 'undefined') || (callback == null) )
    // In this case, callback wasn't provided. We'll just pass an object with the type on it.
    {
      return this.Loader.Load(source, { type : this.Loader.ResourceType.SCRIPT });
    }
    else
      // In any other situations we don't know what to do. Throw an exception.
      throw new Error('Unknown or invalid argument \'callback\': ' + callback);
  },
  
  onfileload : function (f)
  // Use this to include maintenance code in a file. Specifically, include it at the end of a file to have code
  // run after the all of the file has been processed.
  {
    if((typeof f) == 'function')
      // f must be a function.
      return f.call();
    
    return null;
  }

};

/*
 * Footer.
 */

var Include = function (source)
// Basically an alias for Orrery.include(), except it automatically provides the relevant Orrery.IncludeManager
// data for arguments. This method will be used in all default Orrery files. It is written as a variable so it
// can be easily overwritten.
{
  return Orrery.include(source, Orrery.IncludeManager, Orrery.IncludeManager.preload);
}

// Bind will be used extensively, and some browsers do not support it. Thus, we will implement it here. This code
// is courtesy Mozilla Docs. This has some caveats, though. To see those, please read the following:
//     https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind#Compatibility

if(!Function.prototype.bind)
{
  Function.prototype.bind = function (oThis)
  {
    if((typeof this) !== 'function')
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable.');
    
    var aArgs = Array.prototype.slice.call(arguments, 1);
    var fToBind = this;
    var fNOP = function () { };
    var fBound = function ()
      {
        return fToBind.apply(
          (this instanceof fNOP) ? this : (oThis || window),
          aArgs.concat(Array.prototype.slice.call(arguments))
        );
      };
    
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    
    return fBound;
  };
}

// Used to determine whether window.onload will initialize the Orrery class, or whether it will be done manually.

if((typeof $_ORRERY_NO_AUTO_INITIALIZE) == 'undefined')
{
  window.onload = Orrery.Initialize.bind(Orrery);
}