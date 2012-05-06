if(!Argolus) var Argolus = {
    debug : false
};
if(!Argolus.Tools) Argolus.Tools = {};
Argolus.Tools.generateHeightMap = function(height, width){
    var size = width * height, 
    data = new Float32Array( size ),
    perlin = new ImprovedNoise(), 
    quality = 1, 
    z = Math.random() * 100;
    for ( var i = 0; i < size; i ++ ) {
        data[ i ] = 0;
    }
    for ( var j = 0; j < 4; j ++ ) {
        for ( var i = 0; i < size; i ++ ) {
            var x = i % width, y = ~~ ( i / width );
            data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
        }
        quality *= 5;
    }
    return data;
}

Argolus.Tools.generateMonochromeTexture = function(heightmap, height, width){
    var canvas, canvasScaled, context, image, imageData, level, diff, vector3, sun, shade;
    vector3 = new THREE.Vector3( 0, 0, 0 );
    sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();
    canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );
    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;
    for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
        vector3.x = heightmap[ j - 2 ] - heightmap[ j + 2 ];
        vector3.y = 2;
        vector3.z = heightmap[ j - width * 2 ] - heightmap[ j + width * 2 ];
        vector3.normalize();
        shade = vector3.dot( sun );
        imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + heightmap[ j ] * 0.007 );
        imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + heightmap[ j ] * 0.007 );
        imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + heightmap[ j ] * 0.007 );
    }
    context.putImageData( image, 0, 0 );
    canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;
    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );
    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;
    for ( var i = 0, l = imageData.length; i < l; i += 4 ) {
        var v = ~~ ( Math.random() * 5 );
        imageData[ i ] += v;
        imageData[ i + 1 ] += v;
        imageData[ i + 2 ] += v;
    }
    context.putImageData( image, 0, 0 );
    return canvasScaled;
}