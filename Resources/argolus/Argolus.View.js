Argolus.View = new Class({
    Implements: Options,
    options: {},
    scene : false,
    initialize : function(element, options){
        this.setOptions(options);
        this.element = document.id(element);
        if(!this.options.inheritSize) this.options.inheritSize = this.element;
        var size = this.options.inheritSize.getSize();
        this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( size.x, size.y );
		this.element.innerHTML = "";
		this.element.appendChild( this.renderer.domElement );
    },
    stats : function(enabled){
        if(!enabled && enabled !== false) enabled = true;
        if(enabled){
            if(!this.status){
                this.status = new Stats();
                this.status.domElement.style.position = 'absolute';
                this.status.domElement.style.top = '0px';
                this.element.appendChild( this.status.domElement );
            }else{
                this.status.show();
            }
        }else{
            if(this.status) this.status.hide();
        }
    },
    animate: function() {
        requestAnimationFrame( this.animate.bind(this) ); //three.js global animate hook
        this.render();
        if(this.status) this.status.update();
    },
    observe : function(scene){
        this.scene = scene;
        this.animate();
    },
    render : function(){
        if(this.scene) this.renderer.render( this.scene.scene, this.camera );
    }
});