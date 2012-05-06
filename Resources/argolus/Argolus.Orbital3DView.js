Argolus.Orbital3DView = new Class({
    Extends : Argolus.View,
    initialize : function(element, options){
        this.parent(element, options);
        this.size = this.element.getSize();
        this.camera = new THREE.MythCamera( {
            fov: 60, 
            aspect: this.size.x / this.size.y, 
            near: 1, 
            far: 20000,
            movementSpeed: 1000, 
            lookSpeed: 0.1, 
            lookVertical: true
        } );
    },
    observe : function(scene){
        this.scene = scene;
        this.submesh = scene.submesh();
        this.scene.scene.addObject( this.submesh.mesh );
        this.camera.bindSubmesh(this.submesh);
        //set camera height 500 above mesh center
        this.camera.position.y = this.submesh.heightmap[ scene.half.width + scene.half.depth * scene.options.world.width ] + 500;
        this.animate();
    },
    keyboardBindings: function(){
        var axis1 = 'x';
        var axis2 = 'z';
        var axis3 = (axis1 == 'y' || axis2 == 'y' ? (axis1 == 'x' || axis2 == 'x' ? 'z': 'x'): 'y');
        var angle = this.camera.viewingAngle(axis2, axis1);
        var updateStats = function(){
            var xDiv = document.getElementById( 'x_div' );
            var yDiv = document.getElementById( 'y_div' );
            var zDiv = document.getElementById( 'z_div' );
            var zzDiv = document.getElementById( 'zz_div' );
            var targX = Math.floor(this.camera.target.position.x+(this.submesh.width/2));
            var targZ = Math.floor(this.camera.target.position.z+(this.submesh.depth/2));
            var camX = Math.floor(this.camera.position.x+(this.submesh.width/2));
            var camZ = Math.floor(this.camera.position.z+(this.submesh.depth/2));
            xDiv.innerHTML = this.camera.target.position.x.toFixed(2);
            yDiv.innerHTML = this.camera.target.position.y.toFixed(2);
            zDiv.innerHTML = this.camera.target.position.z.toFixed(2);
            zzDiv.innerHTML = this.submesh.getHeight(this.camera.target.position.x, this.camera.target.position.z);
        }.bind(this);
        var forward = function(){
            this.camera.forward(axis1, axis2, axis3, angle);
            if(Argolus.debug) updateStats();
        }.bind(this);
        var backward = function(){
            this.camera.backward(axis1, axis2, axis3, angle);
            if(Argolus.debug) updateStats();
        }.bind(this);
        var left = function(){
            this.camera.strafe_left(axis1, axis2, axis3, angle);
            if(Argolus.debug) updateStats();
        }.bind(this);
        var right = function(){
            this.camera.strafe_right(axis1, axis2, axis3, angle);
            if(Argolus.debug) updateStats();
        }.bind(this);
        var keys = new Keyboard({
            defaultEventType: 'keydown',
            events: {
                'up': forward,
                'w': forward,
                'down': backward,
                's': backward,
                'left': left,
                'a': left,
                'right': right,
                'd': right,
                'r': function(){
                    this.camera.rise(axis1, axis2, axis3, angle);
                    if(Argolus.debug) updateStats();
                }.bind(this),
                'f': function(){
                    this.camera.sink(axis1, axis2, axis3, angle);
                    if(Argolus.debug) updateStats();
                }.bind(this),
                'q': function(){
                    this.camera.turnwise(axis1, axis2, axis3, angle);
                    if(Argolus.debug) updateStats();
                }.bind(this),
                'e': function(){
                    this.camera.widdershins(axis1, axis2, axis3, angle);
                    if(Argolus.debug) updateStats();
                }.bind(this),
                'c': function(){
                    this.camera.zoom_in(axis1, axis2, axis3, angle);
                    if(Argolus.debug) updateStats();
                }.bind(this),
                'v': function(){
                    this.camera.zoom_out(axis1, axis2, axis3, angle);
                    if(Argolus.debug) updateStats();
                }.bind(this),
                'z': function(){
                    this.camera.spin_left(axis1, axis2, axis3, angle);
                    if(Argolus.debug) updateStats();
                }.bind(this),
                'x': function(){
                    this.camera.spin_right(axis1, axis2, axis3, angle);
                    if(Argolus.debug) updateStats();
                }.bind(this)
            }
        });
        return keys;
    }
});