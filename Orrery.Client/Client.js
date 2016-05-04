/**
 ** File: Client.js
 ** Date Written: January 26, 2012
 ** Date Last Updated: February 6, 2012
 ** Written By: Timothy "Popisfizzy" Reilly
 ** Included From: Orrery.js
 **/

/**
 ** Purpose:
 **   The client is basically the user. It stores information about them, and event handlers are attached to the 
 ** client and then passed to their player. Additionally, all drawing is done through the client. A client has at
 ** least one player, and every player must be attached to the client. When a client connects to a player, the
 ** commands of the player are then re-attached to a client.
 **/

/*
 * Includes.
 */

// This manages a Client's attached canvases, including their properties, drawing to them, and managing their
// input. The input is tied into Client.Input.
Include('Orrery.Client/Canvas/Canvas.js');

// Manages all Client Input methods. Both the Canvas.Input and Player.Input classes use Client.Input in order to
// function.
Include('Orrery.Client/Input/Input.js');

/*
 * Class definition.
 */

Orrery.Client = { // The client is defined as a singleton, as it is unecessary to create new clients.

  /*
   * Variables.
   */

  // This is a list lf available Player.Canvas elements to the client.
  Canvases : [],
  
  /*
   * Implements the player inner class, which manages the client's available players.
   */
  
  // This gets the active player from the PlayerArray type.
  get Player() { return this.PlayerArray.players[this.PlayerArray.pointer]; },

  // This sets the active player from the PlayerArray. The argument must be an object, and if it's not an
  // exception will be thrown. If the object is present, then the object will be added to the PlayerArray players
  // array, and the pointer set to it.
  set Player(data)
  {
    if((typeof data) == 'object')
    {
      var index = this.PlayerArray.players.indexOf(data);
      
      if((typeof this.Player.ondisconnect) == 'function')
        // If the current player has an ondisconnect event, call it.
        this.Player.ondisconnect(this);
      
      if(index == -1)
      // If the index is equal to -1, then the object is not present in the array. It'll be added, and the
      // pointer will be set to it.
      {
        // First, add the new character to the PlayerArray player's list.
        this.PlayerArray.players.length ++;
        this.PlayerArray.players[this.PlayerArray.players.length - 1] = data;
        
        // Sets the pointer to the length of the array.
        this.PlayerArray.pointer = this.PlayerArray.players.length;
        
        if((this.Player.onfirstconnection) == 'function')
          // If the onfirstconnection event handler is defined, call it and pass the connecting client.
          this.Player.onfirstconnection(this);
        if((this.Player.onconnection) == 'function')
          // If the onconnection event handler is defined, call it and pass the connection client.
          this.Player.onconnection(this);
      }
      
      else
      {
        // If the item already exists, set the pointer to it.
        this.PlayerArray.pointer = index;

        if((this.Player.onconnect) == 'function')
          // If the onconnect event handler is defined, call it and indicate the client connecting.
          this.Player.onconnect(this);
      }
      
      // Return the current player.
      return this.Player;
    }
  },
  
  PlayerArray : {
    // This is simply an inner class that stores all the players of a client in an array. An additional value, a
    // pointer, is also stored. The pointer indicates which index of the array holds the currently-active player.
  
    // The list of players that the client has access to. 
    players : [],

    // This is the pointer to the index in in the players list that contains the active pointer.
    pointer : 0
  },
  
  /*
   * Client inner classes.
   */
  
  // Canvas is the class that manages and maintains canvas elements. It also includes its own drawing methods and
  // handling of coordinates. The main differences are that (0,0) indicate the center of the canvas, and that the
  // top-right of the canvas indicates positive x and y directions. Defined in Orrery.Client/Canvas/Canvas.js.
  Canvas : null,
  
  // This manages the currently-active user input, which can alter depending on the client's currently-active
  // player. Whenenver the client switches player, this class (which is a singleton) is updated to reflect the
  // changes. It is defined in Orrery.Client/Input/Input.js.
  Input : null,
  
  /*
   * Client methods.
   */
  
  AddCanvas : function (_id)
  // Creates a new canvas object for a given _id. _id is the ID of the <canvas> element.
  {
    // First, attempt to generate the Canvas element.
    var potential = new this.Canvas(_id);
    if(potential)
    // If generated, add it to the Canvases array, associated with the ID of the canvas.
    {
      this.Canvases[_id] = potential;
      potential.Client = this;

      return potential;
    }
    
    return null;
  }

};