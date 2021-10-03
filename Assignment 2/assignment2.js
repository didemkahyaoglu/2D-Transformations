"use strict";

var canvas;
var gl;

var scale = vec3(1, 1, 1); 
var trans = vec3(0,0,1);

var theta=0.0 ;
var theta2=0.0;
var thetaLoc;


var u_colorLocation,u_Color;
var color =vec3(0,0,0);

var speed = 100;
var direction = true;

var bufferTri, bufferRect1, bufferRect2, bufferRect3, triVertices, rectVertices1, rectVertices2, rectVertices3;
var vPosition;
var transformationMatrix, transformationMatrixLoc;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	

    // Make the letters
    triVertices = [
        vec2(  -0.25,  -0.8 ),
        vec2(  0.25,  -0.8 ),
        vec2(  0.0, 0.05 )
    ];

    rectVertices1 = [ //green
        vec2(  0.05,  -0.05 ),
        vec2(  0.43,  0.33 ),
		vec2(  -0.05,  0.05 ),
        vec2(  0.33,  0.43 )
        
    ];
	
	
	rectVertices2 = [ //Blue
		vec2(  0.05,  0.05 ),
        vec2(  0.44,  -0.34 ),
        vec2(  -0.05,  -0.05 ),
        vec2(  0.34,  -0.44 )
	];
	
	rectVertices3 = [ //red
		vec2(  0.01,  0.05 ),
        vec2(  -0.55,  0.05 ),
        vec2(  0.01,  -0.1 ),
        vec2(  -0.55,  -0.1 )
	];
    
	
    // Load the data into the GPU
    bufferTri = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triVertices), gl.STATIC_DRAW );

    // Load the data into the GPU
    bufferRect1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices1), gl.STATIC_DRAW );
	
	
	bufferRect2 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices2), gl.STATIC_DRAW );
	
	bufferRect3 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect3 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices3), gl.STATIC_DRAW );
	

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );	
    thetaLoc = gl.getUniformLocation(program, "theta");
	
	
	transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );
	u_colorLocation = gl.getUniformLocation( program, "u_Color" );
	
	
	
       document.getElementById("inp_objX").oninput = function(event) {
        //TODO: fill here to adjust translation according to slider value
		trans[0]=event.target.value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
        //TODO: fill here to adjust translation according to slider value
		trans[1]=event.target.value;
    };
    document.getElementById("inp_obj_scale").oninput = function(event) {
        //TODO: fill here to adjust scale according to slider value
		scale[0] = event.target.value;
        scale[1] = event.target.value;
    };
    document.getElementById("inp_obj_rotation").oninput = function(event) {
        //TODO: fill here to adjust rotation according to slider value
		theta2=event.target.value;
		
    };
    document.getElementById("inp_wing_speed").oninput = function(event) {
       speed = 100 - event.target.value;	   
    };
    document.getElementById("redSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
		color[0]= event.target.value;
    };
    document.getElementById("greenSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
		color[1]= event.target.value;
    };
    document.getElementById("blueSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
		color[2]= event.target.value;
    };
	

    render();

};


var Rcount=0;


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
	
	theta += (direction ? 0.1 : -0.1);	
    gl.uniform1f(thetaLoc, theta);
	

    transformationMatrix = mat4();
	
	transformationMatrix = mult(transformationMatrix, translate(trans[0], trans[1], trans[2]));
	transformationMatrix = mult(transformationMatrix, scalem(scale[0], scale[1], scale[2]));		
	transformationMatrix = mult(transformationMatrix, rotateZ(theta2));
 
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.uniform4f(u_colorLocation,color[0],color[1],color[2],1.0);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );
	
	Rcount=Rcount+2; 
	transformationMatrix = mult(transformationMatrix, rotateZ(Rcount));
	
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    
	
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect1 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.uniform4f(u_colorLocation,0.0,1.0,0.0,1.0);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
	
	gl.bindBuffer( gl.ARRAY_BUFFER,bufferRect2 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.uniform4f(u_colorLocation,0.0,0.0,1.0,1.0);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
	
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect3 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.uniform4f(u_colorLocation,1.0,0.0,0.0,1.0);
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	
	/*	setTimeout(
      function () {requestAnimFrame( render );},
       speed
    );*/

	
	
    window.requestAnimFrame(render);
}


