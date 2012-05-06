Argolus.Marker = new Class({
    Implements: Options,
    x : 0,
    y : 0,
    options: {
        meshAttached: true,
        position: {
            x: 0,
            y: 0,
            z: 0, // if meshAttached, then z acts as a hover  
        }
    },
    initialize : function(options){
        this.setOptions(options);
    },
    move : function(x, y){
        if(typeOf(marker) == 'number') marker = markers[marker];
        
    }
    z : function(x, y){
        
    }
});
