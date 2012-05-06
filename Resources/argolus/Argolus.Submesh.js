Argolus.Submesh = new Class({
    Implements: Options,
    Extends: Argolus.Mesh,
    options: {
        color: '#fff',
        size: {
            width: 100,
            depth: 100
        }
    },
    initialize : function(options){
        this.setOptions(options);
        this.heightmap = Argolus.Tools.generateHeightMap( this.options.size.width, this.options.size.depth );
        this.geometry = new THREE.Plane( 7500, 7500, this.options.size.width - 1, this.options.size.depth - 1 );
        for ( var i = 0, l = this.geometry.vertices.length; i < l; i ++ ) {
            this.geometry.vertices[ i ].position.z = this.heightmap[ i ] * 10;
        }
        this.textureData = Argolus.Tools.generateMonochromeTexture(this.heightmap, this.options.size.width, this.options.size.depth )
        this.texture = new THREE.Texture( 
            this.textureData, 
            new THREE.UVMapping(), 
            THREE.ClampToEdgeWrapping, 
            THREE.ClampToEdgeWrapping
        );
        this.mesh = new THREE.Mesh( 
            this.geometry, 
            new THREE.MeshBasicMaterial({
                map: this.texture
            }) 
        );
        this.mesh.rotation.x = - 90 * Math.PI / 180;
        this.texture.needsUpdate = true;
        this.lastOne = false;
        this.one = 0;
    },
    getHeight : function(x, z){
            //console.log(['ggghhh', this.options, x, z]);
            x += (this.options.size.width/2);
            z += (this.options.size.depth/2);
            if(Argolus.debug && this.lastOne != x+':'+z && this.one < 20) console.log(['GH', x+':'+z, (this.options.size.width * x) + z, this.lastOne]);
            this.lastOne = x+':'+z;
            this.one++;
            var pos = (this.options.size.width * x) + z;
            try{
                if(this.geometry.vertices[pos/4]) return this.geometry.vertices[pos/4].position.z;
                else return 500;
            }catch(ex){
                return 100;
            }
    },
    'load' : function(){
        // 3 potential load methods
        // 1) procedural (base-state)
        // 2) entropic (player actions subject to decay)
        // 3) static (manual changes in the simulator)
    },
    show : function(){
    },
    hide : function(){
    },
    
    destroy : function(){
    }
});
