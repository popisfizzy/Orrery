/**
 ** File: Canvas.js
 ** Date Written: January 28, 2012
 ** Date Last Updated: January 29, 2012
 ** Written By: Timothy "Popisfizzy" Reilly
 ** Included From: Client.js
 **/

/**
 ** Purpose:
 **   The canvas object is used to directly draw on and manipulate a canvas element, as well as modify and read
 ** its properties. It includes its own built-in drawing methods, accessed via the Draw inner class, which
 ** includes methods to create simple geometric figures and manipulate the drawing properties of the canvas.
 ** Additionally, the Canvas class differs from the vanilla HTML5 canvas in that (0,0) indicates the center of
 ** the screen, and the positive (x,y) directions are towards the top-right. Thus, this canvas object attempts to
 ** implement a Cartesian grid. Additionally, angles are taken to be in the standards form of polar coordinates:
 ** 0 radians is to the right, and pi/2 radians is to the top.
 **/

/*
 * Includes.
 */

Include('Orrery.Client/Canvas/Canvas.Draw.js');
// Include('Orrery.Client/Canvas/Canvas.Input.js');

/*
 * Class constructor.
 */

Orrery.Client.Canvas = function (id)
{
  // First, retrieve the supposed element indicated by its ID.
	this.Canvas = document.getElementById(id);
  
  if(this.Canvas)
  // If something is found and retrieved by document.getElementById...
  {
    if(this.Canvas.nodeName && (this.Canvas.nodeName == 'CANVAS'))
    // ... and if the retrieved element has a nodeName property, and the property is equal to 'CANVAS', then the
    // proper type of element was retrieved.
    {
      // Generates the context from the canvas.
      this.Context = this.Canvas.getContext('2d');
      
      // Bind the OnContextMenu method to the oncontextmenu event of the canvas.
      this.OnContextMenu = this.OnContextMenu.bind(this);
      this.Canvas.oncontextmenu = this.OnContextMenu;
      
      // Use the factory methods for Draw and Input.
      this.Draw = this.Draw(this);
    }
    else
    // Otherwise, the wrong type of element was grabbed. Throw an exception.
    {
      throw new Error('Invalid element type. Canvas type required.');
    }
  }
  else
  // Otherwise, it was an invalid ID.
  {
    throw new Error('Invalid or unknown ID \'' + id + '\'.');
  }
}

/*
 * Class prototype definition.
 */

Orrery.Client.Canvas.prototype = {

  /*
   * Variables of the Canvas prototype.
   */
  
  // The client the Canvas is attached to. Obviously, this is the same as Orrery.Client.
  Client : null,

  // This is the canvas being used, and the related context for that canvas. The context will only be the 2D
  // context, as the 3D context is not widely-supported and I don't know enough about 3D programming for it
  // to be of use.
  Canvas : null,
  Context : null,

  /*
   * Canvas properties.
   */
  
  // Gets the ID of the <canvas> element that is stored.
  get id() { return this.Canvas.id; },
  
  // Sets the id of the stored <canvas> element.
  set id(_id)
  {
    this.Canvas.id = _id;
    return this.Canvas.id;
  },
  
  // These get, respectively, the height and width of the canvas element.
  get Height() { return parseInt(this.Canvas.getAttribute('height')); },
  get Width()  { return parseInt(this.Canvas.getAttribute('width')); },
  
  // These set, respectively, the width and height of the canvas element.
  set Height(_h)
  {
    this.Canvas.setAttribute('height', _h);
    return this.Height;
  },
  
  set Width(_w)
  {
    this.Canvas.setAttribute('width', _w);
    return this.Width;
  },
  
  // These get the distances of the top, bottom, left, and right of the canvas relative to the viewport, where
  // (0,0) is considered to be the upper-left of the viewport. That is, Left gets the distance between the canvas
  // and the left of the viewport, Right gets the distance between the canvas and the right of the viewport, etc.
  get Left()   { return this.Canvas.offsetLeft; },
  get Right()  { return Orrery.ViewportWidth - (this.Left + this.Width); },
  get Top()    { return this.Canvas.offsetTop; },
  get Bottom() { return Orrery.ViewportHeight - (this.Top + this.Height); },
  
  // These return a coordinate pair in (x,y) of the corners, and where (0,0) refers to the upper-left of the
  // viewport.
  get TopLeft()     { return [this.Left,              this.Top              ]; },
  get TopRight()    { return [this.Left + this.Width, this.Top              ]; },
  get BottomLeft()  { return [this.Left,              this.Top + this.Height]; },
  get BottomRight() { return [this.Left + this.Width, this.Top + this.Height]; },
  
  // Manages whether the canvas element is displayed or not.
  
  get display()
  {
    if(this.Canvas.style.display == 'none')
      // If the display value of the canvas' style is set to 'none', then it is currently not displayed, so
      // return false.
      return false;
    else
      // Otherwise, the canvas element should be visible, so return true.
      return true;
  },
  
  set display(_d)
  // Sets whether the element is displayed or not. Must be a boolean value.
  {
    if(_d == true)
      // If the argument is true, then the canvas element should be displayed. Set the style.display value to
      // 'inline'.
      this.Canvas.style.display = 'inline';
    else if(_d == false)
      // If the argument is false, it shouldn't be displayed. Set style.display to 'none'.
      this.Canvas.style.display = 'none';
    else
      // If it is none of these, then an invalid value was passed. Throw an exception.
      throw new Error('Invalid argument for display value of canvas. Must be boolean (true or false).');
    
    return this.display;
  },
  
  // These handle accessors and mutators relevant for the oncontextmenu event.
  
  get contextmenu()
  // This gets the current value for the oncontextmenu property, if context menus are enabled.
  {
    if(this.ContextMenu.enabled && ((typeof this.ContextMenu.oncontextmenu) == 'function') )
      // If the context menu is enabled and it's a function, return the function.
      return this.ContextMenu.oncontextmenu;
    else
      return null;
  },
  
  set contextmenu(_f)
  // Sets the value for the oncontextmenu property. This must be a function or null.
  {
    if( ((typeof _f) == 'function') || ((typeof _f) == 'null') )
      // If it's a function or null, set it to _f.
      this.ContextMenu.oncontextmenu = _f;
    else
      // Otherwise, throw an exception.
      throw new Error('Invalid value for context menu. Expected function or null.');
  },
  
  get contextmenu_enabled()
  // Accessor for the this.ContextMenu.enabled property.
  {
    return this.ContextMenu.enabled;
  },
  
  set contextmenu_enabled(_e)
  // Mutator for the this.ContextMenu.enabled property. Must be boolean (true or false).
  {
    if( (_e == true) || (_e == false) )
      // If it's boolean, set this.ContextMenu.enabled to _e.
      this.ContextMenu.enabled = _e;
    else
      // Otherwise, throw an exception.
      throw new Error('Invalid value for enabling or disabling a context menu. Expected boolean value (true or false).');
  },
  
  /*
   * Class methods.
   */
  
  OnContextMenu : function (event)
  // Primarily used to attach to this.Canvas.oncontextmenu event handler.
  {
    if((typeof this.ContextMenu.oncontextmenu) == 'function')
    {
      // The return value. If the function does not explicitly return a boolean value, then OnContextMenu will
      // return false. This assures that no default context menus occur.
      var r = this.ContextMenu.oncontextmenu(event);
      
      if( (r != true) && (r != false) )
        return false;
      
      return r;
    }
    
    return false;
  },
  
  /*
   * Inner class definitions.
   */
  
  ContextMenu : {
    // This class handles the operation of the canvas' context menu. oncontextmenu is a function that will be
    // called when the Canvas.oncontextmenu event occurs. enabled is a boolean value that indicates whether or
    // not the context menu will occur.
    
    // The function that is called when Canvas.oncontextmenu is.
    oncontextmenu : null,
    
    // Whether the context menu is eneabled. By default, it is not.
    enabled : false
  },
  
  /*
   * Inner class properties. These are defined in other files.
   */
  
  // Used to manage drawing and drawing-related properties of the canvas. Defined in Canvas.Draw.js
  Draw : null,
  
  // Used to handle input on the canvas. That is, input that involves clicking on the canvas, or scrolling over
  // it, or etc. Things such as keyboard presses are not handled by the canvas. Defined in Canvas.Input.js
  Input : null,
  
};