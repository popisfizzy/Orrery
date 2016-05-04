/**
 ** File: Orrery.Browser.js
 ** Date Written: January 22, 2012
 ** Date Last Updated: January 24, 2012
 ** Written By: Timothy "Popisfizzy" Reilly
 **/

/**
 ** Purpose.
 **   This file implements method to assist a programmer in determing the browser, browser version, rendering
 ** engine, and rendering engine version. While the programmer can dynamically add new methods to determine a
 ** user's browser and etc., there are a number of methods built-in that should likely cover 99.9% of all users
 ** encountered. This number is completely unverified, and just based on my personal experience in regards to
 ** browsers I have encountered, and browser popularity.
 **
 **   As a justification, though, note that this basically makes the claim that there are only about 200,000
 ** people, worldwide, who do not use the browsers implemented below. Whether that sounds accurate is up to you,
 ** but I'm confident-enough in it, but keep in mind that the top five browsers make up between 99.3% and 99.53%
 ** of the global market share.
 **/

/*
 * Orrery.Browser class definition. This class is used to get the user's browser name and the version that they
 * are using.
 */

Orrery.Browser = {

  /*
   * Read-only accessors.
   */

  // get UserAgentHeader() { return 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.75 Safari/535.7'; },
  get UserAgentHeader() { return navigator.userAgent; },
  
  /*
   * A list of the accepted browsers. This is used by the Name() and Version() methods.
   */

  SupportedBrowsers : [
    'Camino',
    'Chrome',
    'Epiphany',
    'Firefox',
    'InternetExplorer',
    'Konqueror',
    'Netscape',
    'Opera',
    'Safari',
    'SeaMonkey'
  ],

  /*
   * Implements the individual methods to detect a single browser. These output boolean values.
   */

  Camino : function ()
  {
    // In the userAgent header, Camino is indicated by the presence of 'Camino/'. The version number takes the
    // form, at max, of something like 2.0.4a1pre2, 2.0.6b2pre1, 2.0.5rc2, or 1.0b2+.
    return /(camino)\/((\d\.?){2,3}(a|b|rc){0,1}\d*(pre)?\+?)/i.test(this.UserAgentHeader);
  },
  
  Chrome : function ()
  {
    // Chrome is very regular in its appearance in the userAgentHeader. It is preceded by 'Chrome/'. Except for
    // the first build, it takes the format of a sequence of four numbers, separated by periods, with the numbers
    // containing one to three digits. For example, 17.0.963.12 or 14.0.814.0 or 11.0.696.68. The very first
    // build had no version number.
    return /(chrome)\/((\d{1,3}\.?){4})?/i.test(this.UserAgentHeader);
  },
  
  Epiphany : function ()
  {
    // Epiphany is fairly regular, but not as much as Chrome. For post-initial release versions, the userAgent
    // header is preceded by 'Epiphany/', and the version number takes a format of two to four numbers separated
    // by periods. Tbe numbers are one to two characters long. The initial release userAgent header was indicated
    // by either 'epiphany-browser' or 'epiphany-webkit'.
    return /((epiphany)\/((\d{1,2}\.?){2,4}))|(epiphany\-(webkit|browser))/i.test(this.UserAgentHeader);
  },
  
  Firefox : function ()
  {
    if(!this.Netscape() && !this.SeaMonkey())
    // Netscape, for some reason, includes strings that can give a false positive for Firefox. We exclude this
    // here. SeaMonkey does the same.
    {
      // Firefox is indicated by the presence of 'Firefox' in the header. The first version did not contain a
      // forward slash, and only had 'Firefox'. All later versions had 'Firefox/'. As is common, the version
      // number is primarily indicated by a string of dot-seperated numbers. The numbers contain between one and
      // two digits, and there are between two and four numbers. There are some miscellaneous things present,
      // such as one version with 'plugin' in the header, and other versions containing 'B' and 'C'. Additionally,
      // some early versions had a + at the end.
      return /(firefox)((\/)((\d{1,2}\.?){2,4}([abc]\d+)?(plugin\d+)?(pre)?\+?))?/i.test(this.UserAgentHeader);
    }

    return false;
  },
  
  InternetExplorer : function ()
  {
    if(!this.Opera())
    // Early versions of Opera include MSIE in their name, so filter them out first.
    {
      // Of course, IE is the outlier of the group. It is indicated by 'MSIE ' being located in the paranthetical
      // that is typically used to indicate OS information. Even still, it is fairly regular, with the version
      // being indicated by two period-separated numbers of one to two digits.
      return /(msie)\s((\d{1,2}\.?){2}(b\d?)?)/i.test(this.UserAgentHeader);
    }
  },
  
  Konqueror : function ()
  {
    // Konqueror is also found in the OS information area. It is indicated by 'Konqueror/' in the header. The
    // version is indicated by two to three period-separted numbers. A release candidate may be indicated by a
    // hypen and something of the form 'rc3'.
    return /(konqueror)\/((\d\.?){2,3}(\-((\d{2})|(rc\d)))?)/i.test(this.UserAgentHeader);
  },
  
  Netscape : function ()
  {
    if(!this.InternetExplorer())
    // Some versions of Internet Explorer can result in a false positive to Netscape, due to the presence of
    // 'Mozilla/4.0' in their userAgent header.
    {
      // Today I learned a fun fact! Before Netscape 6, Netscape was indicated by the presence of 'Mozilla/' in
      // the userAgent header. Specifically, something that wasn't 'Mozilla/5.0'. At version 6, Netscape was
      // indicated by 'Netscape6/' in the header. After that, it was 'Netscape/'. FUCK YOU NETSCAPE. You couldn't
      // have known, but fuck you.
      return /((netscape(6?)|navigator)\/((\d{1,4}\.?){1,4}((b|rc)\d)?))|((mozilla)\/[234]\.\d*(gold|c\-sgi)?)/i.test(this.UserAgentHeader);
    }
  },
  
  Opera : function ()
  {
    // Opera is fairly regular. It is indicated by 'Opera/' in the userAgent header, except for the first
    // version, when it was just 'Opera'. The version is indicated by two period-separated numbers.
    
    // Actually, that's only until somewhere between Opera 9.80 and Opera 10.00, where they decided to switch
    // from this sensical version to only having Opera/9.80 at the beginning, and the version is indicated by
    // 'Version/' followed by a number formatted like above.
    
    // UNLESS it has 'Mozilla/' at the front, when it's actually 'Opera 12.34'. WHY, OPERA, WHY?!
    
    // At least we can definitively state whether it's Opera just by checking whether the legacy Opera data is
    // present in the userAgent header. Version stuff will be a bigger pain.
    return /(opera)((\/|\s)((\d{1,2}\.?){1,2}))?/i.test(this.UserAgentHeader);;
  },
  
  Safari : function ()
  {
    // Safari. Why Safari. Why. It's not as bad as Opera, but they didn't start identifying version numbers until
    // Safari 3.0.1. Before that, there was only the build number. On top of that, Chrome and Epiphany also have
    // the Safari build information present in their userAgent headers. Thus, we must filter them out first.
    
    if(!this.Chrome() && !this.Epiphany() && !this.Opera())
    // Chrome, Epiphany, and Opera all have data that could result in a false positive for Safari, so we need to
    // filter them out first.
    {
      return /(safari)(\/|\s)(\d{1,3}\.?){2,3}/i.test(this.UserAgentHeader);
    }
    
    return false;
  },
  
  SeaMonkey : function ()
  {
    // SeaMonkey is relatively consistent. The big problem is just that it has two irregularities, but those are
    // easily-handled. The presence of SeaMonkey is indicated by 'SeaMonkey' in the userAgent header. It may be
    // followed by nothing, a hyphen, or a forward slash. Almost all have forward slashes, and it appears exactly
    // one version used either nothing or a hyphen.
    return /(seamonkey)((\/|\-)((\d{1,2}\.?)+(\-\d+)?([ab]\d*)?)(pre)?\+?)?/i.test(this.UserAgentHeader);
  },
  
  /*
   * This method looks through the list of supported browsers for detection and outputs the name of the user's
   * current browser, if it's supported. If not, it outputs "Unknown".
   */

  Name : function ()
  {
    for(var i = 0; i < this.SupportedBrowsers.length; i ++)
    {
      // Look through each of the browsers in the list. If there is a corresponding method, then call it, and if
      // it returns true, pass that browser.
      
      var browser = this.SupportedBrowsers[i];
      if( ((typeof this[browser]) == 'function') && this[browser]() )
        return browser;
    }
    
    // If this point has been reached, the user's browser is unkown.
    return 'Unknown';
  },
  
  /*
   * This implements ways to determine the browser version. The methods below are not meant to be called
   * individually, though they may be. Instead, the version should be detected with the Version() method, while
   * these methods are used to store how an individual browser's implementation of the version is stored. These
   * methods are implemented in an inner class.
   */

  BrowserVersion : {

    Camino : function ()
    {
      // This grabs the second group of the regex, which is '((\d\.?){2,3}(a|b|rc){0,1}\d*(pre)?\+?)', the
      // browser version info for Camino.
      return /(camino)\/((\d\.?){2,3}(a|b|rc){0,1}\d*(pre)?\+?)/i.exec(this.UserAgentHeader)[2];
    },
    
    Chrome : function ()
    {
      // As with Camino, this grabs the second regex grouping, which contains the version info.
      return /(chrome)\/((\d{1,3}\.?){4})?/i.exec(this.UserAgentHeader)[2];
    },
    
    Epiphany : function ()
    {
      if(/epiphany\-(browser|webkit)/i.test(this.UserAgentHeader))
        // The earlier version of Epiphany has an unknown browser version.
        return 'Unknown';
      
      // If it's not the earlier version, then just return the known version number, by grabbing the second
      // group.
      return /(epiphany)\/((\d{1,2}\.?){2,4})/i.exec(this.UserAgentHeader)[2];
    },
    
    Firefox : function ()
    {
      if(/firefox\//i.test(this.UserAgentHeader) == false)
        // As with Epiphany, the earliest version of Firefox had an unkonwn browser version.
        return 'Unkown';
      
      return /(firefox)\/((\d{1,2}\.?){2,4}([abc]\d+)?(plugin\d+)?(pre)?\+?)?/i.exec(this.UserAgentHeader)[2];
    },
    
    InternetExplorer : function ()
    {
      // The second group is just the version number.
      return /(msie)\s((\d{1,2}\.?){2}(b\d?)?)/i.exec(this.UserAgentHeader)[2];
    },
    
    Konqueror : function ()
    {
      // Once again, second group is the version number.
      return /(konqueror)\/((\d\.?){2,3}(\-((\d{2})|(rc\d)))?)/i.exec(this.UserAgentHeader)[2];
    },
    
    Netscape : function ()
    {
      // Netscape is annoying to get the version number.
      
      // If it is Netscape version 6.0 or above, then we use this method to get the version number.
      var regex = /(netscape(6?)|navigator)\/((\d{1,4}\.?){1,4}((b|rc)\d)?)/i.exec(this.UserAgentHeader)
      if(regex && (regex.length > 0) )
        return regex[3];
        
      // Otherwise, we use this version.
      return /(mozilla)\/([234]\.\d*(gold|c\-sgi)?)/i.exec(this.UserAgentHeader)[2];
    },
    
    Opera : function ()
    {
      // In post-9.80 versions of Opera, the version is indicated by the text 'Version/' followed by the version
      // number. If this is present, it is used.
      var regex = /(version)\/((\d{1,2}\.?){2})/i.exec(this.UserAgentHeader);
      if(regex && (regex.length > 0) )
        return regex[2];
      
      // Otherwise, we grab the version number from the text following 'Opera/' in the header.
      regex = /(opera)(\/|\s)((\d{1,2}\.?){2})/i.exec(this.UserAgentHeader);
      if(regex && (regex.length > 0) )
        return regex[3];
    },
    
    Safari : function ()
    {
      // Before Safari 3.0, the version number was not provided via the userAngent header, so there is not a very
      // reliable way to detect pre-3.0 versions. This will simply report 'Unknown' if the 'Version/' info is not
      // present.
      var regex = /(version)\/((\d\.?){2,3})/i.exec(this.UserAgentHeader);
      if(regex && (regex.length > 0) )
        return regex[2];
    },
    
    SeaMonkey : function ()
    {
      // There is a slight discrepancy in how version number is indicated, and the very first version has an
      // unknown version, and thus reports 'Unknown'. Even so, detecting the version is very simple. We just grab
      // third group.
      var regex =  /(seamonkey)(\/|\-)((\d{1,2}\.?)+(\-\d+)?(([ab]\d?)?(pre)?)\+?)/i.exec(this.UserAgentHeader);
      if(regex && (regex.length > 0) )
        return regex[3];
    }
  
  },
  
  /*
   * This function grabs the version number, based on the output from Name().
   */
  
  Version : function ()
  {
    var Browser = this.Name();
    
    if(Browser == 'Unknown')
      return 'Unknown';
    
    if((typeof this.BrowserVersion[Browser]) == 'function')
      return this.BrowserVersion[Browser]() || 'Unknown';
    
    return 'Unknown';
  },
  
  /*
   * This method allows a new browser to be supported by Orrery.Browser.
   */

  NewBrowser : function (browser, detection, version)
  // Browser is a string that is the browser's name. detection is a function that returns a boolean value of true
  // if it detects that the userAgent header indicates it is that browser, and false otherwise. version is a
  // function that returns the version of the browser. If no value is returned, the Version() method will
  // instead return 'Unknown'.
  {
    // Some error handling.
  
    if((typeof browser) != 'string')
      // browser must be a string.
      throw new Error('Invalid data type for browser name.');
    
    if( ((typeof detection) != 'function') || ((typeof version) != 'function') )
      // detection and veresion must be functions.
      throw new Error('Non-function is invalid for browser detection.');
    
    // Now add the new functions.
    
    // Add the browser to the list of supported browsers.
    this.SupportedBrowsers.length ++;
    this.SupportedBrowsers[this.SupportedBrowsers.length - 1] = browser;
    
    // Attach the detection function to Orrery.Browser.
    this[browser] = detection.bind(Orrery.Browser);
    
    // Attach the version function to Orrery.Browser.BrowserVersion.
    this.BrowserVersion[browser] = version.bind(Orrery.Browser);
  }

};

/*
 * Orrery.RenderingEngine class definition. This class is used to get the user's rendering engine name and the
 * version that they are using. The internal structure is almost the same as Orrery.Browser, but it's directed at
 * a different set of data. These five are used by all the major browsers, and most if the minor ones, so there
 * should likely be almost no cases where a browser will use an engine that isn't one of the five defaults.
 * Anything that doesn't use them is likely a crawler.
 */

Orrery.RenderingEngine = {

  /*
   * Read-only accessor.
   */

  // get UserAgentHeader() { return 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.75 Safari/535.7'; },
  get UserAgentHeader() { return navigator.userAgent; },
  
  /*
   * The list of supported rendering engines.
   */
  
  SupportedRenderingEngines : [
    'Gecko',
    'KHTML',
    'Presto',
    'Trident',
    'WebKit'
  ],

  /*
   * Boolean-outputting functions that indicate whether a particular rendering engine is used.
   */

  Gecko : function ()
  {
    // Gecko is indicated by 'Gecko/' followed by an eight-digit number, which is the date of the most recent
    // build, and also (basically) the version number.
    return /(gecko)\/(\d{8})/i.test(this.UserAgentHeader);
  },

  KHTML : function ()
  {
    if(!this.WebKit())
    // Chrome, at least, can give a false positive for KHTML.
    {
      // KHTML is indicated by 'KHTML' in the file name. Konqueror is the most notable browser to use KHTML, and
      // it did not indicate its rendering engine until version 3.2. Thus, versions before this will indicate an
      // unknown rendering engine.
      return /(khtml)((\/)((\d\.?){3}))?/i.test(this.UserAgentHeader);
    }
  },
  
  Presto : function ()
  {
    // Unfortunately, early versions of Opera did not report their rendering engine, so they will report
    // 'Unknown' when queried.
    return /(presto)\/((\d{1,4}\.?){3})/i.test(this.UserAgentHeader);
  },
  
  Trident : function ()
  {
    // A number of versions of IE do not indicate their rendering engine. Oddly, this seems almost-entirely
    // random, so eh. These browsers will return 'Unknown' when queried for rendering engine info.
    return /(trident)\/((\d+\.?){2})/i.test(this.UserAgentHeader);
  },
  
  WebKit : function ()
  {
    // WebKit is used, most notably, by Chrome and Safari. It is indicated by the presence of 'AppleWebKit/' in
    // the userAgent header.
    return /(applewebkit)\/((\d{1,3}\.?){2,3}\+?)/i.test(this.UserAgentHeader);
  },
  
  /*
   * This method looks through the list of supported rendering engines for detection and outputs the name of the
   * user's browser's current rendering engine, if it's supported. If not, it outputs "Unknown".
   */

  Name : function ()
  {
    for(var i = 0; i < this.SupportedRenderingEngines.length; i ++)
    {
      // Look through each of the engines in the list. If there is a corresponding method, then call it, and if
      // it returns true, pass that name of that rendering engine.
      
      var engine = this.SupportedRenderingEngines[i];
      if( ((typeof this[engine]) == 'function') && this[engine]() )
        return engine;
    }
    
    // If this point has been reached, the user's rendering engine is unkown.
    return 'Unknown';
  },
  
  /*
   * These output the version of the current rendering engine. They should not be called individually, even
   * though it is possible. Instead, using the Version() method.
   */

  RenderingEngineVersion : {
  
    Gecko : function ()
    {
      // The version of Gecko is just an eight-digit numerical string, which is the date of the last build. It
      // is, in effect, the version number of Gecko.
      return /(gecko)\/(\d{8})/i.exec(this.UserAgentHeader)[2];
    },
    
    KTHML : function ()
    {
      // KTHML's version number is indicated by three numbers separated by a dot. Some headers do not include
      // this number, and thus their version is unknown. In this regex, that value is 5.
      var regex = /(khtml)((\/)((\d\.?){3}))?/i.exec(this.UserAgentHeader);
      if(regex && (regex.length >= 5) )
        return regex[5];
    },
    
    Presto : function ()
    {
      // Unfortunately, early versions of Opera did not report their rendering engine, so they will report
      // 'Unknown' when queried.
      var regex = /(presto)\/((\d{1,4}\.?){3})/i.exec(this.UserAgentHeader);
      if(regex && (regex.length > 0) )
        return regex[2];
    },
    
    Trident : function ()
    {
      // A number of versions of IE just do not report the rendering engine. These will return 'Unknown'.
      var regex = /(trident)\/((\d+\.?){2})/i.exec(this.UserAgentHeader);
      if(regex && (regex.length > 0) )
        return regex[2];
    },
    
    WebKit : function ()
    {
      // From what I've seen, only Epiphany uses WebKit versions with a '+', and only Safari uses WebKit versions
      // that have three numbers.
      return /(applewebkit)\/((\d{1,3}\.?){2,3}\+?)/i.exec(this.UserAgentHeader)[2];
    }
  
  },
  
  /*
   * This function grabs the version number, based on the output from Name().
   */
  
  Version : function ()
  {
    var Engine = this.Name();
    
    if(Engine == 'Unknown')
      return 'Unknown';
    
    if((typeof this.RenderingEngineVersion[Engine]) == 'function')
      return this.RenderingEngineVersion[Engine]() || 'Unknown';
    
    return 'Unknown';
  },
  
  /*
   * This method allows a new rendering engine to be supported by Orrery.RenderingEngine. It acts mostly the same
   * as Orrery.Browser.NewBrowser().
   */

  NewRenderingEngine : function (engine, detection, version)
  // See Orrery.Browser.NewBrowser() for information about the arguments.
  {
    // Some error handling.
  
    if((typeof engine) != 'string')
      // engine must be a string.
      throw new Error('Invalid data type for rendering engine name.');
    
    if( ((typeof detection) != 'function') || ((typeof version) != 'function') )
      // detection and veresion must be functions.
      throw new Error('Non-function is invalid for rendering engine detection.');
    
    // Now add the new functions.
    
    // Add the engine to the list of supported browsers.
    this.SupportedRenderingEngines.length ++;
    this.SupportedRenderingEngines[this.SupportedBrowsers.length - 1] = engine;
    
    // Attach the detection function to Orrery.RenderingEngine.
    this[engine] = detection.bind(Orrery.RenderingEngine);
    
    // Attach the version function to Orrery.RenderingEngine.RenderingEngineVersion.
    this.BrowserVersion[engine] = version.bind(Orrery.RenderingEngine);
  }

};

/*
 * Footer.
 */

Orrery.onfileload( function ()
  // When the file loads, we're going to bind all the Orrery.Browser.BrowserVersion methods to Orrery.Browser
  // and Orrery.RenderingEngine.RenderingEngineVersion to Orrery.RenderingEngine, which simplifies their code.
  {
    for(var i in Orrery.Browser.BrowserVersion)
    {
      if((typeof Orrery.Browser.BrowserVersion[i]) == 'function')
        Orrery.Browser.BrowserVersion[i] = Orrery.Browser.BrowserVersion[i].bind(Orrery.Browser);
    }
    
    for(var i in Orrery.RenderingEngine.RenderingEngineVersion)
    {
      if((typeof Orrery.RenderingEngine.RenderingEngineVersion[i]) == 'function')
        Orrery.RenderingEngine.RenderingEngineVersion[i] = Orrery.RenderingEngine.RenderingEngineVersion[i].bind(Orrery.RenderingEngine);
        
    }
} );