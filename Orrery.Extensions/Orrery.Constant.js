/**
 ** File: Orrery.Constants.js
 ** Date Written: February 11, 2012
 ** Date Last Updated: February 11, 2012
 ** Written By: Timothy "Popisfizzy" Reilly
 ** Included From: Orrery.js
 **/

/**
 ** Purpose:
 **   This file includes definitions of globally-used constants for the library. Some constants present in other
 ** files are, additionally, redefined here, but with the same values. This is to give a central locations to
 ** access these values from.
 **/

/**
 ** TODO: Implement touch constants. Implement constants for non-canvas, non-window input (?).
 **/

/*
 * Singleton definition.
 */

Orrery.Constant = {

  /*
   * These two sets of constants are used in the Orrery.Loader class, present in Orrery.js.
   */

  ResourceType : {
  
    /*
     * These indicate types of dynamic resources that may be loaded.
     */
    
    // Text data.
    SCRIPT     : 1,
    STYLESHEET : 2,
    
    // Media data.
    IMAGE  : 3,
    AUDIO  : 4,
    VISUAL : 5
  },
  
  LoadState : {
  
    /*
     * These indicate the current state of loading dynamic resources.
     */
    
    // No current state. The resource has not even begun being processed.
    NONE : 0,
    
    // Currently processing. Loading has begun, but there are no results that are anymore useful.
    PROCESSING : 1,
  
    // Successfully loaded.
    LOAD : 2,
    
    // An error has occurred when loading the file. Perhaps the URL is malformed, or the file does not exist.
    ERROR : 4,
    
    // The user has aborted attempting to load the file, perhaps through cancelling file transfers, or perhaps
    // through loading a new pages.
    ABORT : 8,
    
    // The file has timed out. It has taken too long to try and load it.
    TIMEEOUT : 16,
    
    // Some sort of failure has occurred. Equal to (ERROR | ABORT | TIMEOUT).
    FAILURE : 28,
    
    // The file has finished processing, whether it either succeeded (loaded) or failed (errored, aborted, or was
    // timed out). This is equal to (LOAD | FAILURE) which is equal to (LOAD | ERROR | ABORT | TIMEOUT).
    COMPLETE : 30
  },
  
  /*
   * These are input constants, used in Input.js as a normalized set of values that are going to be consistent
   * and regular across browsers. Note that they are normalized to relatively-arbitrary values, and thus these do
   * not necessarily associate with any other values. For example, there is no strong relation between the values
   * here and ASCII values, in regards to the keyboard.
   */
  
  Keyboard : {
  
    /*
     * Values for keyboard inputs and keyboard states.
     */
    
    // Keyboard inputs. These are, specifically, inputs for a Windows-oriented, American QWERTY keyboard. I need
    // to do more research about other types of keyboard, for other languages an operating systems, so that I can
    // expand on this.
    
    // Letter inputs.
    A :  0,
    B :  1,
    C :  2,
    D :  3,
    E :  4,
    F :  5,
    G :  6,
    H :  7,
    I :  8,
    J :  9,
    K : 10,
    L : 11,
    M : 12,
    N : 13,
    O : 14,
    P : 15,
    Q : 16,
    R : 17,
    S : 18,
    T : 19,
    U : 20,
    V : 21,
    W : 22,
    X : 23,
    Y : 24,
    Z : 25,
    
    // Number row inputs.
    ONE   : 26,
    TWO   : 27,
    THREE : 28,
    FOUR  : 29,
    FIVE  : 30,
    SIX   : 31,
    SEVEN : 32,
    EIGHT : 33,
    NINE  : 34,
    ZERO  : 35,
    
    NUMPAD : {
      // Inputs specifically for the number pad. Several keys present in the number pad are not present here due
      // to their lack of distinct input information. For example, the + key on the numpad has the same
      // information as the + key on the main keyboard area.
    
      ONE   : 36,
      TWO   : 37,
      THREE : 38,
      FOUR  : 39,
      FIVE  : 40,
      SIX   : 41,
      SEVEN : 42,
      EIGHT : 43,
      NINE  : 44,
      ZERO  : 45,
      
      POINT    : 46,
      SLASH    : 47,
      ASTERISK : 48,
    },
    
    // Symbolic inputs.
    TILDE         : 49,
    HYPHEN        : 50,
    EQUALS        : 51,
    LEFT_BRACKET  : 52,
    RIGHT_BRACKET : 53,
    SEMICOLON     : 54,
    APOSTROPHE    : 55,
    COMMA         : 56,
    PERIOD        : 57,
    BACKSLASH     : 58,
    FORWARDSLASH  : 59,
    
    // Function key inputs.
    F1  : 60,
    F2  : 61,
    F3  : 62,
    F4  : 63,
    F5  : 64,
    F6  : 65,
    F7  : 66,
    F8  : 67,
    F9  : 68,
    F10 : 69,
    F11 : 70,
    F12 : 71,
    
    // Directional inputs
    UP    : 72,
    DOWN  : 73,
    LEFT  : 74,
    RIGHT : 75,
    
    // Other inputs. Miscellaneous stuff.
    SHIFT : 76,
    CTRL  : 77,
    ALT   : 78,
    
    WINDOWS : 79,
    
    SPACE : 80,
    TAB   : 81,
    ENTER : 82,
    
    BACKSPACE : 83,
    
    CAPS_LOCK   : 84,
    SCROLL_LOCK : 85,
    NUM_LOCK    : 86,
    
    INSERT    : 87,
    HOME      : 88,
    PAGE_UP   : 89,
    PAGE_DOWN : 90,
    END       : 91,
    DELETE    : 92,
    
    PRINT_SCREEN : 93,
    PAUSE        : 94,
    
    ESCAPE : 95,
    
    // Keyboard states. Each of the inputs can be in one of these states at a time.
    
    // When a key is simply pressed, and not held down. This will be followed by a RELEASE event. This is similar
    // to the keydown event in the DOM.
    PRESS : 96,
    
    // Used to indicate that a key has *not* been pressed. Useful for certain types of inputs, when a distinction
    // between a state with multiple keys down, and a state with some down, some up is important. This is called
    // a negative state of PRESS.
    UNPRESS : 97,
    
    // This is called after a key has been held pressed and not released for a certain amount of time, the time
    // being indicated by the programmer. This is similar to the keypress event in the DOM.
    HOLD : 98,
    
    // This is thrown when a key has been released, either after a PRESS or HOLD event. This is similar to the
    // keyup event in the DOM.
    RELEASE : 99,
    
    /*
     * These functions indicate whether a constant is part of a specific class of constants within the Keyboard
     * inputs and states.
     */
    
    IsConstant : function (n)
    // Returns true if n is a Keyboard constant.
    {
      return (n >= 0) && (n <= 99);
    },
    
    IsInput : function (n)
    // Returns true if n is a Keyboard input.
    {
      return (n >= 0) && (n <= 95);
    },
    
    IsState : function (n)
    // Returns true if n is a Keyboard state.
    {
      return (n >= 96) && (n <= 99);
    }
  
  },
  
  Mouse : {
  
    /*
     * These are inputs and states associated with the mouse. Unlike with the keyboard, there are only a small
     * amount of inputs, and a large amount of states.
     */
    
    // Mouse inputs.
    
    LEFT   : 100,
    MIDDLE : 101,
    RIGHT  : 102,
    
    // Mouse states.
    
    // A PRESS event followed immediately by a RELEASE event.
    CLICK    : 103,
    
    // Two CLICK events in quick succession.
    DBLCLICK : 104,
    
    WHEEL : {
      // Wheel states. These are only valid when used in conjunction with the MIDDLE input.
    
      UP   : 105,
      DOWN : 106,
    },
    
    // Used when the mouse moves on the canvas. This functions exactly the same regardless of which mouse input
    // it is used in conjunction with.
    MOVE  : 107,
    
    // Used when the mouse enters a specific part of the canvas. As with MOVE, it doesn't matter which input it
    // is used in conjunction with.
    ENTER : 108,
    
    // Used when the mouse leaves a specific part of the canvas. As with MOVE, it doesn't matter which input it
    // is used in conjunction with.
    LEAVE : 109,
    
    // When the mouse is pressed, regardless of whether it is released. Similar to the mousedown DOM event.
    PRESS : 110,
    
    // When a mouse button has not been pressed. A negative state of PRESS.
    UNPRESS : 111,
    
    // When a mouse button is released after it has been pressed (or held down).
    RELEASE : 112,
    
    // After a mouse button has been pressed but not released for a certain amount of time, as indicated by the
    // programmer.
    HOLD : 113,
    
    // When a press or hold event co-occurs with a move event.
    DRAG : 114,
    
    // A release event after a drag event.
    DROP : 115,
    
    // Occurs after a move event has not occurred for a specified amount of time, as indicated by the programmer.
    // This functions exactly the same regardless of which mouse input it is used in conjunction with.
    HOVER : 116,
    
    /*
     * Functions that indicate whether a given value is a mouse constant.
     */
    
    IsConstant : function (n)
    // Returns true when n is a mouse constant.
    {
      return (n >= 100) && (n <= 116);
    },
    
    IsInput : function (n)
    // Returns true when n is a mouse input.
    {
      return (n >= 100) && (n <= 102);
    },
    
    IsState : function (n)
    // Returns true when n is a mouse state.
    {
      return (n >= 103) && (n <= 116);
    }
  
  },
  
  WINDOW : {
    // The window is considered its own input. It's somewhat bizarre, but it is the best way of handling it in
    // the Client.Input singleton.
    WINDOW : 117,
    
    // When the window gains focus.
    FOCUS_IN  : 118,
    
    // When the window loses focus.
    FOCUS_OUT : 119,
    
    /*
     * Indicates whether a value is a window constant.
     */
    
    IsConstant : function (n)
    // Returns true when n is a window constant.
    {
      return (n >= 117) && (n <= 119);
    },
    
    IsState : function (n)
    // Returns true if n is a window state.
    {
      return (n == 118) || (n == 119);
    },
    
    IsInput : function (n)
    // Returns true if n is a window constant.
    {
      return (n == 117);
    }
  
  },
  
  TOUCH : {
  
    /**
     ** TODO: Add touch constants.
     **/
  
  }

};