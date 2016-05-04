/**
 ** File: Canvas.Draw.js
 ** Date Written: January 29, 2012
 ** Date Last Updated: February 6, 2012
 ** Written By: Timothy "Popisfizzy" Reilly
 ** Included From: Canvas.js
 **/

/**
 ** Purpose:
 **   The Canvas.Draw class implements drawing methods for its master Canvas class. Here, the Draw class is
 ** implemented as a factory, a function that'll be called when Canvas is created and which outputs an object
 ** that is attached to the Canvas class. It also modifies its master Canvas class by transforming it in ways
 ** which make it easier to draw on, and more intuitive.
 **/

/**
 ** TODO: Implement a method that will draw lines (open and closed). Implement aliases for the quadratic and
 ** Bezier curve methods in the context API. Implement a method that draws a parametric equation using lines,
 ** with user-provided sample point distances (?). Implement gradient functions. Implement better image method
 ** support (?).
 **/

/*
 * Factory definition.
 */

Orrery.Client.Canvas.prototype.Draw = function (Canvas)
{
  /*

  First, we transform the canvas a bit. This describes a transformation matrix, in particular an affine
  transformation matrix. This matrix is as follows:

                               A  B                      C
                          A  [ 1  0 ( Math.floor(Canvas.Width   / 2) + 0.5 ) ]
                          B  [ 0 -1 ( Math.floor(Canvas.Height  / 2) + 0.5 ) ]
                          C  [ 0  0                      1                  ]

     If we denote the matrix as M, and position (X,Y) as Matrix_XY, then each element is as follows:
       - M_AA indicates that vertical elements are mapped to themselves, and not stretched.
       - M_BB indicates that horizontal elements are mirrored, and not stretched.
       - M_AB and M_BA indicate that there is no shear transformation.
       - M_AC indicates that the X axis is shifted to the middle of the canvas (half its width), and M_BC
         indicates that the Y axis is shifted to the middle of the canvas (half its height). Both of these
         values are floored. The 0.5 is a half-pixel shift, which is to smooth out some types of drawing
         the HTML <canvas> element does.
       - M_AC, M_BC, and M_CC are part of the affine matrix, and can not be altered by the transform() method.

  */
  Canvas.Context.setTransform( 1, 0, 0, -1, Math.floor(Canvas.Width / 2) + 0.5, Math.floor(Canvas.Height / 2) + 0.5 );
  
  /*
   * Class definition.
   */
  
  return {
    /*
     * The master Canvas and Context.
     */
    
    Canvas : Canvas,
    Context : Canvas.Context,
    
    /*
     * Coloring and style variables.
     */
    
    // The color that is drawn when the canvas is cleared.
    ClearColor : '#FFFFFF',

    // The default fill color.
    DefaultFillColor : '#000000',
    
    // The default line color.
    DefaultLineColor : '#000000',
    
    // The line width, in pixels.
    LineWidth : 1,
    
    // The line style. This is either butt, round, or square.
    LineStyle : 1, // this.LineStyles.BUTT
    
    LineStyles : {
      // Constants for these.
    
      BUTT   : 1,
      ROUND  : 2,
      SQUARE : 3
    },
    
    // The line join style. This is either round, bevel, or miter.
    LineJoinStyle : 1, // this.LineJoinStyles.MITER
    
    LineJoinStyles : {
      // Constants for these.
      
      MITER : 1,
      BEVEL : 2,
      ROUND : 3
    },
    
    // MiterLimit, used when this.LineJoinStyle == this.LineJoinStyles.MITER.
    MiterLimit : 10,
    
    /*
     * Context interface methods.
     */
    
    // This resets the canvas to what it was when the canvas was created ( that is, (0,0) centered at the middle
    // of the canvas, and the positive direction is towards the upper-right).
    Reset : function () { this.Context.setTransform( 1, 0, 0, -1, Math.floor(Canvas.Width / 2), Math.floor(Canvas.Height / 2)); },
    
    // This saves the current state of the canvas.
    Save : function () { this.Context.save(); },
    
    // This restores the previosu state of the canvas, or the previous n states if the argument is specified.
    Restore : function (n)
    {
      if((typeof n) == 'undefined')
        n = 1;
      
      for(var i = 1; i <= n; i ++)
        this.Context.restore();
    },
  
    /*
     * Transformation methods.
     */
    
    // Transform plain. This is just an alias for the Context.transform() method.
    Transform : function (a, b, c, d, e, f) { this.Context.transform(a, b, c, d, e, f); },
    
    // Transform assist. This helps the user by specifying the specific values they wish to transform, though it
    // reduces flexibility.
    TransformAssist : function (theta, sx, sy, dx, dy, kx, ky)
    /*
     * theta  - A rotation by theta radians.
     * sx, sy - Horizontal and vertical scaling.
     * dx, dy - Horizontal and vertical transformations.
     * kx, ky - Horizontal and vertical skewing/shearing.
     */
    {
      // Pre-calculate these, so we don't have to do it a bunch of times.
      var cosTheta = Math.cos(theta);
      var sinTheta = Math.sin(theta);
    
      // All this stuff is basically doing a bunch of matrix multiplications and looking at the result. To be
      // more specific, I calculated the product of the following four matrices:
      //  [ sx  0  0 ]   [  1 kx  0 ]   [ 1 0 dx ]   [ cos(theta) -sin(theta) 0 ]
      //  [ 0  sy  0 ] * [ ky  1  0 ] * [ 0 1 dy ] * [ sin(theta)  cos(theta) 0 ]
      //  [ 0   0  1 ]   [  0  0  1 ]   [ 0 0  1 ]   [     0           0      1 ]
      // These are, respectively, a scale matrix, a shear matrix, a translation matrix, and a rotation matrix.
      // They are all in affine form, which is what the Context.transform() method uses. Their product gives the
      // results below, where a = M_11, b = M_21, c = M_12, d = M_22, e = M_13, f = M_23.
      
      var a = (sx *      cosTheta) + (sx * kx * sinTheta);
      var b = (sy * ky * cosTheta) + (sy *      sinTheta);
      var c = (sx * kx * cosTheta) - (sx *      sinTheta);
      var d = (sy *      cosTheta) - (sy * ky * sinTheta);
      
      var e = (sx * dx) + (sx * kx * dy);
      var f = (sy * kx * dx) + (sy * dy);
      
      // And apply the transformation.
      this.Context.transform(a, b, c, d, e, f);
    },
    
    // Methods for rotating the canvas.
    
    // This rotates the canvas by theta radians.
    Rotate : function (theta) { this.Context.rotate(theta); },
    
    // Alias for this.Rotate().
    RotateRadian : function (theta) { this.Rotate(theta); },
    
    // This rotates the canvas by theta degrees.
    RotateDegree : function (theta) { this.Context.rotate( theta * (Math.PI / 180) ); },
    
    // This rotates the canvas by theta turns. For example, 1/2 turns is pi radians, or 180 degrees, and 3/4
    // turns is 3/2 radians, or 270 degrees.
    RotateTurn : function (theta) { this.Context.rotate( theta * 2 * Math.PI ); },
    
    // Methods for translating the canvas.
    Translate           : function (dx, dy) { this.Context.translate(dx, dy); },
    TranslateHorizontal : function (dx) { this.Translate(dx, 0); },
    TranslateVertical   : function (dy) { this.Translate(0, dy); },
    
    // Methods for scaling the canvas.
    Scale           : function (sx, sy) { this.Context.scale(sx, sy); },
    ScaleHorizontal : function (sx) { this.Context.scale(sx, 0); },
    ScaleVertical   : function (sy) { this.Context.scale(0, sy); },
    
    // Methods for shearing the canvas. There is no shearing method in the standard HTML5 Canvas API, so I use
    // the transform method.
    Shear           : function (kx, ky) { this.Context.transform(1, ky, kx, 1, 0, 0); },
    ShearHorizontal : function (kx) { this.Shear(kx, 0); },
    ShearVertical   : function (ky) { this.Shear(0, ky); },
    
    // Methods for applying reflection transformations to the canvas.
    
    // This produces the mirror of the canvas. That is, it is the reflection through the line x = y.
    Mirror : function () { this.Context.transform(0, 1, 1, 0, 0, 0); },
    
    // This gets the reflection of the canvas, which is the reflection of the canvas through the origin.
    Reflection : function () { this.Context.transform(-1, 0, 0, -1, 0, 0); },
    
    // The vertical reflection of the canvas (reflection across the x-axis).
    VerticalReflection : function () { this.Context.transform(1, 0, 0, -1, 0, 0); },
    
    // The horizontal reflection of the canvas (reflection across the y-axis).
    HorizontalReflection : function () { this.Context.transform(-1, 0, 0, 1, 0, 0); },
    
    // Methods for squeeze-mapping the canvas. Squeeze mappings distort distances but preserve areas in Euclidean
    // space.
    Squeeze           : function (sh, sv) { this.Context.scale(sh / sv, sv / sh); },
    SqueezeHorizontal : function (r)    { this.Squeeze(r, 1); },
    SqueezeVertical   : function (r)    { this.Squeeze(1, r); },
  
    /*
     * Drawing assistance methods.
     */
    
    SetCanvasData : function (FillColor, LineColor, LineWidth, LineStyle, LineJoinStyle, MiterLimit)
    // This sets the values of some of the drawing-related variables for the context. This code is repeated a
    // lot, so it's thrown into this function.
    {
     // Set the fillStyle and strokeStyle values. If either are null, they won't be drawn.
      if(FillColor != null)
        this.Context.fillStyle = FillColor;
      if(LineColor != null)
        this.Context.strokeStyle = LineColor;
      
      // Next, set the line-styling data.
      
      this.Context.lineWidth = LineWidth;
      
      switch(LineStyle)
      {
        case this.LineStyles.BUTT:
          this.Context.lineCap = 'butt';
          break;
        
        case this.LineStyles.ROUND:
          this.Context.lineCap = 'round';
          break;
        
        case this.LineStyles.SQUARE:
          this.Context.lineCap = 'square';
          break;
        
        default:
          // If it is none of these, throw an exception.
          throw new Error('LineStyle set to invalid value. Expected ' + this.LineStyles.BUTT + ', ' + this.LineStyles.ROUND + ', or ' +
                          this.LineStyles.SQUARE + '. Got ' + LineStyle + '.');
      }
      
      switch(LineJoinStyle)
      {
        case this.LineJoinStyles.ROUND:
          this.Context.lineJoin = 'round';
          break;
        
        case this.LineJoinStyles.MITER:
          this.Context.lineJoin = 'miter';
          break;
          
        case this.LineJoinStyles.BEVEL:
          this.Context.lineJoin = 'bevel';
          break;
        
        default:
          // If it's none of these, throw an exception.
          throw new Error('LineJoinStyle set to invalid value. Expected ' + this.LineJoinStyles.ROUND + ', ' + this.LineJoinStyles.MITER +' , or ' +
                          this.LineJoinStyles.BEVEL + '. Got ' + LineJoinStyle + '.');
      }
      
      // Double check the miter limit isn't below one. If it is, throw an error (this is meaningless for the
      // canvas element). If it's not, set it.
      
      if(MiterLimit < 1)
        throw new Error('MiterLimit must be greater than or equal to 1. Values less than one are meaningless.');
      else
        this.miterLimit = MiterLimit;
    },
    
    RotateAroundPoint : function (rx, ry, px, py, theta)
    // This rotates a point (px, py) by theta, using a point (rx, ry) as a reference point.
    {
      // cos(theta) and sin(theta), rounded to three decimal points.
      var cosTheta = Math.round(Math.cos(theta) * 1000) / 1000;
      var sinTheta = Math.round(Math.sin(theta) * 1000) / 1000;
      
      var npx = rx + ((px - rx) * cosTheta) - ((py - ry) * sinTheta);
      var npy = ry + ((px - rx) * sinTheta) + ((py - ry) * cosTheta);
      
      return [npx, npy];
    },
    
    /*
     * Drawing methods.
     */
    
    Clear : function (color)
    // This clears the canvas. Thanks to the user Prestaul on StackOverflow.com for this solution (though I
    // wasn't the one who asked the initial question).
    {
      if((typeof color) == 'undefined')
        // If color is not provided, then use the default ClearColor value.
        color = this.ClearColor;
        
      // Save the context.
      this.Save();
      
      // Now, reset it to the canvas default using the identity transformation.
      this.Context.setTransform(1, 0, 0, 1, 0, 0);
      
      // Create a rectangle of the indicated color that fills the canvas.
      this.Context.fillStyle = color;
      this.Context.fillRect(0, 0, this.Canvas.Width, this.Canvas.Height);
      
      // And restore the state of the context.
      this.Restore();
    },
    
    Fill : function (color)
    // This fills the canvas with a color or gradient. It acts similarly to Clear(), but with a different
    // setTransform() operation. It also must have a color type that is either a gradient or string.
    {
      if( ((typeof color) != 'string') && !(color instanceof CanvasGradient) )
      // If it's not a string and not a gradient, then throw an exception.
      {
        throw new Error('Color must be a string or a gradient.');
      }
      
      // Save the context's state.
      this.Save();
      
      // Set the context to the transformation that places the center of the canvas at (0,0).
      this.Context.setTransform( 1, 0, 0, -1, Math.floor(Canvas.Width / 2) + 0.5, Math.floor(Canvas.Height / 2) + 0.5 );
      
      // Now draw the gradient.
      this.Context.fillStyle = color;
      this.Context.fillRect(-this.Canvas.Width / 2, -this.Canvas.Height / 2, this.Canvas.Width, this.Canvas.Height);
      
      // And restore the context.
      this.Restore();
    },
    
    Square : function (lx, ly, size, theta, property)
    // This draws a square. lx and ly are the lower corner, and size is the size of a side. Theta is the angle
    // (in radians) that it's drawn in, and property is an object containing the property of the square,
    // such as its color data. If property is not present, the default values will be used instead. It is an
    // alias for Rectangle.
    {
      this.Rectangle(lx, ly, lx + size, ly + size, theta, property);
    },
    
    Diamond : function (lx, ly, size, theta, property)
    // This is an alias for Square, but theta is passed as theta + Math.PI / 4.
    {
      this.Square(lx, ly, size, theta + Math.PI / 4, property);
    },
    
    Rectangle : function (lx, ly, dx, dy, theta, property)
    // This draws a rectangle. The arguments here are similar to the Square method's arguments, except size is 
    // replaced with dx and dy, which are the lengths of the horizontal and vertical sides. It is an alias for
    // Parallelogram.
    {
      this.Parallelogram(lx, ly, dx - lx, dx, dy, theta, property);
    },
    
    Parallelogram : function (lx, ly, l, hx, hy, theta, property)
    // This draws a parallelogramm. (lx, ly) is the low corner, and (hx, hy) is the high corner. l indicates the
    // length of the horizontal leg of the parallelogram.
    {
      // Color data.
      var FillColor = ( (typeof property.FillColor) != 'undefined' ) ? property.FillColor : this.FillColor;
      var LineColor = ( (typeof property.LineColor) != 'undefined' ) ? property.LineColor : this.LineColor;
      
      // Line-styling data.
      var LineWidth = ( (typeof property.LineWidth) != 'undefined' ) ? property.LineWidth : this.LineWidth;
      var LineStyle = ( (typeof property.LineStyle) != 'undefined' ) ? property.LineStyle : this.LineStyle;
      var LineJoinStyle = ( (typeof property.LineJoinStyle) != 'undefined' ) ? property.LineJoinStyle : this.LineJoinStyle;
      var MiterLimit = ( (typeof property.MiterLimit) != 'undefined' ) ? property.MiterLimit : this.MiterLimit;
      
      // Save the state of the canvas, and then set the canvas variable stuff.
      this.Save();
      this.SetCanvasData(FillColor, LineColor, LineWidth, LineStyle, LineJoinStyle, MiterLimit, theta);
      
      // Begin the path.
      this.Context.beginPath();
      
      // The points that will serve as the vertices of the parallelogram. Mind that one of them will be (lx, ly).
      // These are named according to where they would be drawn then theta = 0.
      
      // Bottom right. This is (lx + l, ly)
      var br = this.RotateAroundPoint(lx,ly , lx+l,ly , theta);
      var br_x = br[0];
      var br_y = br[1];
      
      // Top right. This is (hx, hy).
      var tr = this.RotateAroundPoint(lx,ly , hx,hy , theta);
      var tr_x = tr[0];
      var tr_y = tr[1];
      
      // Top left. This is (hx - l, hy).
      var tl = this.RotateAroundPoint(lx,ly , hx-l,hy , theta);
      var tl_x = tl[0];
      var tl_y = tl[1];
      
      // Draw the path.
      this.Context.moveTo(lx, ly);
      this.Context.lineTo(br_x, br_y);
      this.Context.lineTo(tr_x, tr_y);
      this.Context.lineTo(tl_x, tl_y);
      
      // Close the path.
      this.Context.closePath();
      
      // Now draw the square indicated by the path..
      if(FillColor != null)
        this.Context.fill();
      if(LineColor != null)
        this.Context.stroke();
      
     // And restore the canvas state.
     this.Restore();
    },
    
    Circle : function (cx, cy, r, property)
    // (cx, cy) is the center of the circle, and 
    {
      // Color data.
      var FillColor = ( (typeof property.FillColor) != 'undefined' ) ? property.FillColor : this.FillColor;
      var LineColor = ( (typeof property.LineColor) != 'undefined' ) ? property.LineColor : this.LineColor;
      
      // Line-styling data.
      var LineWidth = ( (typeof property.LineWidth) != 'undefined' ) ? property.LineWidth : this.LineWidth;
      var LineStyle = ( (typeof property.LineStyle) != 'undefined' ) ? property.LineStyle : this.LineStyle;
      var LineJoinStyle = ( (typeof property.LineJoinStyle) != 'undefined' ) ? property.LineJoinStyle : this.LineJoinStyle;
      var MiterLimit = ( (typeof property.MiterLimit) != 'undefined' ) ? property.MiterLimit : this.MiterLimit;
      
      // Save the state of the canvas, and then set the canvas variable stuff.
      this.Save();
      this.SetCanvasData(FillColor, LineColor, LineWidth, LineStyle, LineJoinStyle, MiterLimit, 0);
      
      // Draw the circle path.
      this.Context.beginPath();
      this.Context.arc(cx, cy, r, 0, 2 * Math.PI, false);
      this.Context.closePath();
      
      // Now actually draw it.
      if(FillColor != null)
        this.Context.fill();
      if(LineColor != null)
        this.Context.stroke();
        
      // Restore the canvas state.
      this.Restore();
    },
    
    Ellipse : function (cx, cy, w, h, theta, property)
    // This draws an ellipse on the canvas, using Bezier curves. This is based on code by tjameson posted on
    // StackOverflow.com, though edited to suit my needs.
    {
      // Color data.
      var FillColor = ( (typeof property.FillColor) != 'undefined' ) ? property.FillColor : this.FillColor;
      var LineColor = ( (typeof property.LineColor) != 'undefined' ) ? property.LineColor : this.LineColor;
      
      // Line-styling data.
      var LineWidth = ( (typeof property.LineWidth) != 'undefined' ) ? property.LineWidth : this.LineWidth;
      var LineStyle = ( (typeof property.LineStyle) != 'undefined' ) ? property.LineStyle : this.LineStyle;
      var LineJoinStyle = ( (typeof property.LineJoinStyle) != 'undefined' ) ? property.LineJoinStyle : this.LineJoinStyle;
      var MiterLimit = ( (typeof property.MiterLimit) != 'undefined' ) ? property.MiterLimit : this.MiterLimit;
      
      // Save the state of the canvas, and then set the canvas variable stuff.
      this.Save();
      this.SetCanvasData(FillColor, LineColor, LineWidth, LineStyle, LineJoinStyle, MiterLimit, theta);
      
      // Variables to draw the ellipse.
      var kappa = 0.5522848;
      
      // Horizontal and vertical control point offsets.
      var ox = w * kappa;
      var oy = h * kappa;
      
      // x and y endpoints.
      var xe = cx + w;
      var ye = cy + h;
      
      // Now draw the path for the bezier curve.
      this.Context.beginPath();
      
      // The variables here are kind of ugly. Just note that every point rotates around (cx,cy), and that the
      // bezierCurveTo method accepts three points.
      
      // Initial point.
      
      var P1 = this.RotateAroundPoint(cx,cy , cx-w,cy , theta);
      this.Context.moveTo(P1[0],P1[1]);
      
      // First Bezier curve.
      
      var P2_1 = this.RotateAroundPoint(cx,cy , cx-w,cy-oy , theta);
      var P2_2 = this.RotateAroundPoint(cx,cy , cx-ox,cy-h , theta);
      var P2_3 = this.RotateAroundPoint(cx,cy , cx,cy-h    , theta);
      this.Context.bezierCurveTo(P2_1[0],P2_1[1] , P2_2[0],P2_2[1] , P2_3[0],P2_3[1]);
      
      // Second Bezier curve.
      
      var P3_1 = this.RotateAroundPoint(cx,cy , cx+ox,cy-h , theta);
      var P3_2 = this.RotateAroundPoint(cx,cy , xe,cy-oy   , theta);
      var P3_3 = this.RotateAroundPoint(cx,cy , xe,cy      , theta);
      
      this.Context.bezierCurveTo(P3_1[0],P3_1[1] , P3_2[0],P3_2[1] , P3_3[0],P3_3[1]);
      
      // Third Bezier curve.
      
      var P4_1 = this.RotateAroundPoint(cx,cy , xe,cy+oy , theta);
      var P4_2 = this.RotateAroundPoint(cx,cy , cx+ox,ye , theta);
      var P4_3 = this.RotateAroundPoint(cx,cy , cx,ye    , theta);
      
      this.Context.bezierCurveTo(P4_1[0],P4_1[1] , P4_2[0],P4_2[1] , P4_3[0],P4_3[1]);
      
      // Fourth Bezier curve.
      
      var P5_1 = this.RotateAroundPoint(cx,cy , cx-ox,ye   , theta);
      var P5_2 = this.RotateAroundPoint(cx,cy , cx-w,cy+oy , theta);
      
      this.Context.bezierCurveTo(P5_1[0],P5_1[1] , P5_2[0],P5_2[1] , P1[0],P1[1]);
      
      this.Context.closePath();
      
      // And draw the ellipse.
      if(FillColor != null)
        this.Context.fill();
      if(LineColor != null)
        this.Context.stroke();
      
      // Restore the canvas state.
      this.Restore();
    },
    
    Image : function (image, x, y)
    // This draws an image on the canvas. image is an image object.
    {
      this.Context.drawImage(image, x, y);
    },
    
    Polygon : function (cx, cy, s, r, theta, property)
    // This draws a regular s-sided polygon with a radius of r, where the radius is the distance from the center
    // of the polygon to one of its vertices. (cx, cy) is the center of the polygon, and theta is the angle it
    // will be drawn at. The polygon is set up such that the bottom of the polygon will always be parallel with
    // the y axis, before rotation by theta.
    {
      if( s != (s | 0) )
      // This is a trick that effectively truncates s. Truncation is rounding towards zero. That is, truncating
      // gives Trunc(-2.5) = -2, and Trunc(2.5) = 2. Basically, this checks to see if s is an integer. If it's
      // not, then throw an exception, as polygons must have an integer number of sides.
      {
        throw new Error('Polygon must have an integer number of sides.');
      }
      
      if(s < 3)
      // Polygons must have at least 3 sides.
      {
        throw new Error('Polygons must have at least three sides.');
      }
      
      // Color data.
      var FillColor = ( (typeof property.FillColor) != 'undefined' ) ? property.FillColor : this.FillColor;
      var LineColor = ( (typeof property.LineColor) != 'undefined' ) ? property.LineColor : this.LineColor;
      
      // Line-styling data.
      var LineWidth = ( (typeof property.LineWidth) != 'undefined' ) ? property.LineWidth : this.LineWidth;
      var LineStyle = ( (typeof property.LineStyle) != 'undefined' ) ? property.LineStyle : this.LineStyle;
      var LineJoinStyle = ( (typeof property.LineJoinStyle) != 'undefined' ) ? property.LineJoinStyle : this.LineJoinStyle;
      var MiterLimit = ( (typeof property.MiterLimit) != 'undefined' ) ? property.MiterLimit : this.MiterLimit;
      
      if((s % 2) == 0)
        // If it is even sided, the algorithm will draw the polygon 45 degrees off from what we want, so we need
        // to add Math.PI / s to theta.
        theta += Math.PI / s;
	  
      // Save the state of the canvas, and then set the canvas variable stuff. Note that theta is not handled
      // here, but down below.
      this.Save();
      this.SetCanvasData(FillColor, LineColor, LineWidth, LineStyle, LineJoinStyle, MiterLimit, 0);
	  
      // Now draw the path for the n-dimensional polygon.
	  
      // This is the angle, in radians, that separates the vertices of the polygon relative to the circumscribed
      // circle.
      var angle = (Math.PI * 2) / s;
	  
      // Begin the path.
      this.Context.beginPath();
	  
      for(var i = 1; i <= s; i ++)
      // And then move the pointer to all the other angles.
      {
        var x = r * Math.sin(angle * i - theta);
        var y = r * Math.cos(angle * i - theta);
        
        // Round x and y to a few decimal points.
        x = Math.round(x * 1000) / 1000;
        y = Math.round(y * 1000) / 1000;
		
        if(i == 1)
          this.Context.moveTo(cx + x, cy + y);
        else
          this.Context.lineTo(cx + x, cy + y);
      }
      
      // Close the path.
      this.Context.closePath();
	  
      // Now draw the polygon.
      if(FillColor != null)
        this.Context.fill();
      if(LineColor != null)
        this.Context.stroke();
      
      // Restore the canvas.
      this.Restore();
    },
    
  };
}
