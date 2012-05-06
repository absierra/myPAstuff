Argolus.Scene = new Class({
    Implements: Options,
    options: {
        lightColor: '#fff', //todo
        gridSize : 1,
        element : window,
        world :{
            width : 256,
            depth : 256
        }
    },
    submeshes : [],
    submeshCache : [],
    initialize : function(element, options){
        this.setOptions(options);
        this.half = {
            width : (this.options.world.width/2),
            depth : (this.options.world.depth/2)
        };
        this.scene = new THREE.Scene();
		this.submeshes.push(new Argolus.Submesh());
    },
    submesh: function() {
        if(this.submeshes.length == 0) throw('no submesh!');
        return this.submeshes[0];
    },
    onTransfer : function(event){
        
    }
});