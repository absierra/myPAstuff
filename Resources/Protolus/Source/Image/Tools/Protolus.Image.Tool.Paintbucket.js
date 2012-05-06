Protolus.Image.Tool.Paintbucket = new Class({
    Extends : Protolus.Image.Tool,
    name : function(){
        return 'paintbucket';
    },
    paint: function(brush, pixels, x, y, sourceColor, foreground){
        var options = ImageBoothApplication.brushOptions;
        var pos = ((y*(pixels.width*4)) + (x*4));
        var hits = [];
        if(sourceColor == null){
            sourceColor = [pixels.data[pos], pixels.data[pos+1], pixels.data[pos+2]];
            foreground = hex2rgb(Protolus.Image.Booth.foreground);
        }
        var stack = [];
        stack.push([x, y, 'left']);
        var item, opacity;
        opacity = (options.opacity/100);
        while(stack.length > 0){
            pos = ((y*(pixels.width*4)) + (x*4));
            item = stack.pop();
            x = item[0];
            y = item[1];
            if(
                !hits[pos] &&
                colorDiff(
                    sourceColor[0], 
                    sourceColor[1], 
                    sourceColor[2], 
                    pixels.data[pos], 
                    pixels.data[pos+1], 
                    pixels.data[pos+2]
                ) < (options.amount/100)
            ){
                pixels.data[pos] = (foreground[0]*opacity) + ((1.0-opacity)*pixels.data[pos]);
                pixels.data[pos+1] = (foreground[1]*opacity) + ((1.0-opacity)*pixels.data[pos+1]);
                pixels.data[pos+2] = (foreground[2]*opacity) + ((1.0-opacity)*pixels.data[pos+2]);
                hits[pos] = true;
                switch(item[2]){
                    case 'left' :
                        stack.push([x, y, 'right']);
                        x--
                        if(x >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]){
                            stack.push([x, y, 'left']);
                        }
                        break;
                    case 'right' :
                        stack.push([x, y, 'top']);
                        x++
                        if(x < pixels.width && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'top' :
                        stack.push([x, y, 'bottom']);
                        y++
                        if(y < pixels.height && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'bottom' :
                        y--;
                        if(y >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                }
                continue;
            }
            if(item[2] != 'left'){
                switch(item[2]){
                    case 'right' :
                        stack.push([x, y, 'top']);
                        x++
                        if(x < pixels.width && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'top' :
                        stack.push([x, y, 'bottom']);
                        y++
                        if(y < pixels.height && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'bottom' :
                        y--;
                        if(y >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                }
            }
        }
        return pixels;
    },
    getControls : function(){
        return {
            'amount' : {
                'value' : '50',
                'default' : '50',
                'upper_bound' : '100',
                'lower_bound' : '0'
            },
            'opacity' : {
                'value' : '100',
                'default' : '100',
                'upper_bound' : '100',
                'lower_bound' : '0'
            },
        };
    }
});