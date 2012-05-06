THREE.MythCamera = function ( parameters ) {
	function bind( scope, fn ){
		return function(){
			fn.apply( scope, arguments );
		};
	};

	function map_linear( x, sa, sb, ea, eb ) {
		return ( x  - sa ) * ( eb - ea ) / ( sb - sa ) + ea;
	};

	function clamp_bottom( x, a ) {
		return x < a ? a : x;
	};

	function clamp( x, a, b ) {
		return x < a ? a : ( x > b ? b : x );
	};
	this.lastHeight = false;
	this.update = function() {
        this.position.x = this.target.position.x + Math.sin(this.o_mod) * (this.camera_radius + this.zm_mod);
        this.position.z = this.target.position.z + Math.cos(this.o_mod) * (this.camera_radius + this.zm_mod);
        if(this.submesh){
            var targX = Math.floor(this.target.position.x+(this.submesh.options.size.width/2));
            var targZ = Math.floor(this.target.position.z+(this.submesh.options.size.depth/2));
            var camX = Math.floor(this.position.x+(this.submesh.options.size.width/2));
            var camZ = Math.floor(this.position.z+(this.submesh.options.size.depth/2));
            var targetHeight = this.submesh.getHeight(targX, targZ);
            var cameraHeight = this.submesh.getHeight(camX, camZ);
            this.lastHeight = targetHeight;
            this.target.position.y = targetHeight;
            this.position.y = targetHeight+(this.z_mod);
        }else{
            this.position.y = 0+(this.z_mod);
        }
        this.supr.update.call(this);
	};
	
	this.viewingAngle = function(axis1, axis2){
        var deltas = this.deltas();
        return Math.atan2(deltas[axis1], deltas[axis2]);
    };
    
    this.deltas = function(){
        var result = {};
        result.x = this.position.x - this.target.position.x;
        result.y = this.position.y - this.target.position.y;
        result.z = this.position.z - this.target.position.z;
        return result;
    };
	
	this.resetToDefaults = function(){
        this.x_mod = 0;
        this.y_mod = 0;
        this.z_mod = 300;
        this.o_mod = 0;
        this.zm_mod = 0;
        this.position.x = this.camera_radius;
        this.position.y = this.camera_radius;
        this.position.z = 0;
    }
    
    this.turnwise = function(axis1, axis2, axis3, angle){
        this.o_mod = this.o_mod + (1 * this.orbit_speed);
    }
    
    this.widdershins = function(axis1, axis2, axis3, angle){
        this.o_mod = this.o_mod - (1 * this.orbit_speed);
    }
    
    this.rise = function(axis1, axis2, axis3, angle){
        this.z_mod = this.z_mod + this.increment;
    }
    
    this.sink = function(axis1, axis2, axis3, angle){
        this.z_mod = this.z_mod - this.increment;
    }
    
    this.zoom_in = function(axis1, axis2, axis3, angle){
        this.zm_mod = this.zm_mod - this.increment;
    }
    
    this.zoom_out = function(axis1, axis2, axis3, angle){
        this.zm_mod = this.zm_mod + this.increment;
    }
    
    this.forward = function(axis1, axis2, axis3, angle){
        this.target.position[axis1] = this.target.position[axis1] - (Math.cos(angle-this.o_mod) * this.increment);
        this.target.position[axis2] = this.target.position[axis2] - (Math.sin(angle-this.o_mod) * this.increment);
    };
    
    this.strafe_right = function(axis1, axis2, axis3, angle){
        var perpendicularAngle = this.degToRad(90 - this.radToDeg(angle));
        this.target.position[axis1] = this.target.position[axis1] + (Math.cos(perpendicularAngle-this.o_mod) * this.increment);
        this.target.position[axis2] = this.target.position[axis2] + (Math.sin(perpendicularAngle-this.o_mod) * this.increment);
    };
    
    this.backward = function(axis1, axis2, axis3, angle){
        this.target.position[axis1] = this.target.position[axis1] + (Math.cos(angle-this.o_mod) * this.increment);
        this.target.position[axis2] = this.target.position[axis2] + (Math.sin(angle-this.o_mod) * this.increment);
    }
    
    this.strafe_left = function(axis1, axis2, axis3, angle){
        var perpendicularAngle = this.degToRad(90 - this.radToDeg(angle));
        this.target.position[axis1] = this.target.position[axis1] - (Math.cos(perpendicularAngle-this.o_mod) * this.increment);
        this.target.position[axis2] = this.target.position[axis2] - (Math.sin(perpendicularAngle-this.o_mod) * this.increment);
    }
    
    //todo: spin function currently not working
    this.spin_left = function(axis1, axis2, axis3, angle){
        //this.target.position.x = this.target.position.x + Math.sin(6.28 -(angle-this.o_mod)) * (this.camera_radius + this.zm_mod);
        //this.target.position.z = this.target.position.z + Math.cos(6.28 -(angle-this.o_mod)) * (this.camera_radius + this.zm_mod);
    }
    
    this.spin_right = function(axis1, axis2, axis3, angle){
        
    }
    
    this.degToRad = function(angle) {
        return ((angle*Math.PI) / 180);
    }
    
    this.radToDeg = function(angle) {
        return ((angle*180) / Math.PI);
    }
    THREE.Camera.call( this, 75, window.innerWidth / window.innerHeight, 1, 10000, null, true);
    this.offset = 180/Math.PI;
    this.orbit_speed = 0.05; //radial_increment
    this.spin_speed = 0.05;
    this.camera_radius = 200;
    this.increment = 10;
    this.zm_unit = 1;
    this.bindSubmesh = function(submesh){
        this.submesh = submesh;
    }
    this.submesh = false;
    //this.useTarget = true;
    this.resetToDefaults();
    this.update();
    if(!this.domElement) this.domElement = document;
	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

};


THREE.MythCamera.prototype = new THREE.Camera();
THREE.MythCamera.prototype.constructor = THREE.QuakeCamera;
THREE.MythCamera.prototype.supr = THREE.Camera.prototype;
THREE.MythCamera.prototype.translate = function ( distance, axis ) {
	this.matrix.rotateAxis( axis );
	if( this.noFly ) axis.y = 0;
	this.position.addSelf( axis.multiplyScalar( distance ) );
};
