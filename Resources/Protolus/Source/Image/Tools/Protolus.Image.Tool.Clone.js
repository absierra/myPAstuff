Protolus.Image.Tool.Clone = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'clone';
    },
    clonePoint : null,
    oldPoint : null,
    paint: function(brush, pixels, x, y){
        //TODO: figure out why this will not stay set without using this static to store it's state
        this.clonePoint = Protolus.Image.Booth.clonePosition;
        this.oldPoint = Protolus.Image.Booth.cloneBrushPosition;
        if(KeyboardHandler.isKeyPressed('alt')){
                this.clonePoint = {x:x, y:y};
                this.oldPoint = null;
                Protolus.Image.Booth.clonePosition = this.clonePoint;
                Protolus.Image.Booth.cloneBrushPosition = this.oldPoint;
                return pixels;
            }
        if(this.clonePoint == null || this.clonePoint == undefined){
            alert('No source! Please option-click to select a clone source.');
            return pixels;
        }
        //update clone point coordinates to be the difference in the 2
        if(this.oldPoint != null){
            //alert('ping');
            this.clonePoint.x += (x - this.oldPoint.x);
            this.clonePoint.y += (y - this.oldPoint.y);
            this.oldPoint.x = x;
            this.oldPoint.y = y;
        }else{
            this.oldPoint = {x:x, y:y};
        }
        Protolus.Image.Booth.clonePosition = this.clonePoint;
        Protolus.Image.Booth.cloneBrushPosition = this.oldPoint;
        var transparency = 0;
        var opaquness = 255 - transparency;
        // turn it into a ratio
        if(transparency != 0) transparency =  (transparency) / 255.0;
        if(opaquness != 0) opaquness = ( opaquness) / 255.0;
        var color = Protolus.Image.Booth.decodeHex(Protolus.Image.Booth.background);
        var brush = brush;
        //reset X/Y for the brush size
        var sx = pixels.width;
        var sy = pixels.height;
        //offset by half the brush size so the brush centers on the cursor
        x = x - Math.round(brush.length/2);
        y = y - Math.round(brush[0].length/2);
        var brushx, brushy;
        var pos, old_mult, new_mult, clone_pos;
        var x_offset = x - this.clonePoint.x;
        var y_offset = y - this.clonePoint.y;
        //var output = '';
        for(var ypos = y; ypos < y + brush[0].length; ypos++){
            brushy = ypos - y;
            for(xpos = x; xpos < x + brush.length; xpos++){
                brushx = xpos - x;
                if(opaquness != 0){
                    pos = ((ypos*(sx*4)) + (xpos*4));
                    clone_pos = (((ypos-y_offset)*(sx*4)) + ((xpos-x_offset)*4));
                    color = [
                        pixels.data[clone_pos    ],
                        pixels.data[clone_pos + 1],
                        pixels.data[clone_pos + 2]
                    ];
                    if(transparency != 0 || brush[brushx][brushy] != 255){ //is the overall paint at 100% opaqueness? is this portion of the brush an opaque pixel?
                        //we need to composite the 2 pixels
                        old_mult = (transparency == 0)? brush[brushx][brushy]/255 : transparency * brush[brushx][brushy]/255;
                        new_mult = opaquness * (255 - brush[brushx][brushy])/255;
                        pixels.data[pos    ] = (new_mult * pixels.data[pos    ]) + (old_mult * color[0]);
                        pixels.data[pos + 1] = (new_mult * pixels.data[pos + 1]) + (old_mult * color[1]);
                        pixels.data[pos + 2] = (new_mult * pixels.data[pos + 2]) + (old_mult * color[2]);
                        pixels.data[pos + 3] = Math.max(pixels.data[pos + 3], brush[brushx][brushy]);
                    }else{ //draw in the opaque pixel
                        pixels.data[pos    ] = brush[brushx][brushy]/255 * color[0];
                        pixels.data[pos + 1] = brush[brushx][brushy]/255 * color[1];
                        pixels.data[pos + 2] = brush[brushx][brushy]/255 * color[2];
                        pixels.data[pos + 3] = brush[brushx][brushy];
                    }
                } // if we fail this test, we don't need to draw this pixel, it's the same as the old one
            }
        }
        //alert(output);
        return pixels;
    },
});