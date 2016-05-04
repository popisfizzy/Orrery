/**
 ** File: Input.js
 ** Date Written: February 6, 2012
 ** Date Last Updated: February 11, 2012
 ** Written By: Timothy "Popisfizzy" Reilly
 ** Included From: Client.js
 **/

/**
 ** Purpose:
 **   The Input class implements input-handling for all elements and all input types (including mouse clicks,
 ** keyboard input, window input, and touch screen input). The Canvas.Input and Player.Input classes make use of
 ** this class heavily for their input, and act as a type of wrapper to assist programmers in implementing input
 ** specific to Canvases and Players.
 **/

/*
 * Class definition.
 */ 

Orrery.Client.Input = {

  /*
   * Variables.
   */
  
  // A list of all Action objects currently attached to the client.
  Actions : [],
  
  // A list of all Input objects currently present. This is an associative array, where the key is the relevant
  // constant from Orrery.Constant, and it is associated with the Input object.
  Inputs : [],
  
  // This is a list of input modes currently present. This is used to manage event handlers. It is an associative
  // array, where the association is an array containing the handlers corresponding to present states.
  Modes : [],
  
  /*
   * Methods.
   */
  
  Attach : function (input, state)
  // This attaches an event listener to the relevant DOM object. It will attach nothing is the relevant mode and
  // state is already present.
  {
    // This is the list of available input modes, which are singleton objects from Orrery.Constant.
    var Modes = [ Orrery.Constant.Keyboard, Orrery.Constant.Mouse, Orrery.Constant.Window ];
    
    for(var i = 0; i < Modes.length; i ++)
    // Now process through the modes and check that both input and state are members of the modes.
    {
      if(Modes[i].IsInput(input) && Modes[i].IsState(state))
        // If both are valid, then we can stop verifying.
        break;
      
      if(i == (Modes.length - 1))
      // If we reached this point, then the input and state are mismatched, so throw an exception.
      {
        throw new Error('Mismatched input and state. Input: ' + input + ', State: ' + state + '.');
      }
    }
  },
  
  /*
   * Client.Input class constructors. For class prototypes, please see below the Orrery.Client definition, near
   * end of file.
   */

  Input : function (input, state, mode)
  // Constructor for the Input class, which is defined further below. This class handles manages the states for
  // individual inputs.
  {
    this.Input = input;
    this.State = state;
    this.Mode = mode;
    
    Orrery.Client.Input[this.Input] = this;
  },
  
  Action : function ( /* ... */ )
  // The Action class manages a particular set of Inputs, input states, and a single Function which is called
  // when the Action decides that all inputs are the correct state. The arguments here must consist of a number
  // of length-two arrays, with the first element being the input value and the second being the input state, and
  // then the last argument must be a Function.
  {
    if(arguments.length < 2)
      // If there are less than two arguments, it is obviously invalid data.
      throw new Error('Arguments must consist of at least one set of input data and a function.');
  
    // The Input classes passed as arguments. These will be used to associate with certain Input objects, and
    // form the array on what states input values should be in.
    var Inputs = [];
    
    // The Function that will be called when all inputs are in the right state.
    var Function;
    
    for(var i = 0; i < arguments.length; i ++)
    // Unfortunately, the Arguments array isn't actually an array, but just acts like it. slice() is unvailable
    // to it, so this has to be done instead.
    {
      if(i != (arguments.length - 1))
      // All arguments from 1 to Length-1 are length-two arrays containing an input value and its associated
      // input state.
      {
        if(!(arguments[i] instanceof Array))
          // If the argument is not an array, throw an exception.
          throw new Error('Invalid argument. Argument in this location should be of type Array.');
          
        if(arguments[i].length != 2)
          // Furthermore, if it's not of lenght two, throw an exception.
          throw new Error('Input data array must contain input value compontent and input state compontent.');
      
        // If it gets to this point, then add the new data to the array.
        Inputs.length ++;
        Inputs[Inputs.length - 1] = arguments[i];
      }
      else
      // The last argument is the relevant function to be called upon a successful Query.
      {
        if((typeof arguments[i]) != 'function')
          // If it's not a function, throw an exception.
          throw new Error('Invalid argument. Argument in this location should be of type Function.');
      
        Function = arguments[i];
      }
      
      // Add the Action to the Actions list of the input, to 'register' it as being present.
      Orrery.Client.Input.Actions.length ++;
      Orrery.Client.Input.Actions[Orrery.Client.Input.Actions.length - 1] = this;
    }
  },
  
},

/*
 * Input interior class prototype definitions.
 */

Orrery.Client.Input.Action.prototype = {

  /*
   * Action class variables.
   */

  // The function that will be called when the Action object executes.
  Function : null,
  
  // An associative array. The key is an Input object, and its value is an integer that corresponds to an input
  // state constant from Orrery.Constant. An Action object is executed only when all Input objects report the
  // state that this array stores as an association.
  Inputs : [],

  /*
   * Action class methods.
   */
  
  Query : function ()
  // This has the Action object analyze all of its inputs. If it finds that all of its inputs are in the correct
  // state, then it will execute.
  {
    for(var i in this.Inputs)
    // Loop through all the Input objects.
    {
      var Input = i;
      var State = this.Inputs[i];
      
      if(State != Input.State)
        // If there is any necessary state that doesn't match up with the current input state, then the Action
        // will not Execute. Return false to indicate this.
        return false;
    }
    
    // If the entire list is processed without trouble, then the Action object should Execute. Return true.
    return true;
  },
  
  Execute : function ()
  // This Exections and Action object. That is, it calls the Function bound to the Action, and passes an Event
  // object as its argument.
  {
    this.Function.call(new Orrery.Client.Input.Event(this));
  }
  
}

Orrery.Client.Input.Input.prototype = {

  /*
   * The interior Input class handles individual modes of inputs (for example, pressing a certain key or a given
   * mouse button, etc), and handles their state. The Input object also stores Action classes that utilize an
   * input. When the state for that Input updates, the associated Actions are queried and decide whether they
   * will execute.
   */

  /*
   * Input class variables.
   */

  // The associated Client.Input.Action objects. These Action objects contain an input in some state, which
  // is handled by this Input. Whenever the state changes, the Action is queried and decides itself whether
  // it should execute.
  Actions : [],

  // The input. This is a constant from Orrery.Constant.
  Input : null,
  
  // The current input state. Also a constant, from Orrery.Constant.
  State : null,
  
  // The input mode. This is not a constant, but actually one of the Orrery.Constant singletons. For example,
  // if Input = Orrery.Constant.Keyboard.SHIFT, then Mode = Orrery.Constant.Keyboard.
  Mode : null,
  
  /*
   * Methods.
   */
  
  UpdateInputState : function (state)
  // This changes the State to a new state. First it checks that this is a valid state, and then it Queries
  // the actions.
  {
    if(this.Mode.IsState(state))
    // If this is a valid state for the Mode, then do the following.
    {
      // Update the state to reflect the change.
      this.State = state;
      
      // Query the actions.
      this.Query();
    }
    else
    // Otherwise, throw an exception.
    {
      throw new Error('Invalid state for current Input.Mode. Got ' + state + '.');
    }
  },
  
  Query : function ()
  // This calls Action.Query() for each action associated with the input, to detect whether or not the action
  // should be executed.
  {
    for(var i = 0; i < this.Actions.length; i ++)
    {
      this.Actions[i].Query();
    }
  }

};
