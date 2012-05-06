/*
---
name: Fx.Step
description: "It ♥s Data"
requires: [Fx, Fx/CSS, Color/Color, ART]
provides: [Fx/Step]
...
*/

(function(){
    //duped from art due to closure happiness (JFC moo needs protected statics)
    var parameterCount = {
        l: 2, z: 0,
        h: 1, v: 1,
        c: 6, s: 4,
        q: 4, t: 2,
        m: 2, a: 7
    };
    function parse(path){
        if (!path) return [];
        var parts = [], index = -1,
            bits = path.match(/[a-df-z]|[\-+]?(?:[\d\.]e[\-+]?|[^\s\-+,a-z])+/ig),
            command, part, paramCount = 0;
        for (var i = 0, l = bits.length; i < l; i++){
            var bit = bits[i];
            if (bit.match(/^[a-z]/i)){
                command = bit;
                parts[++index] = part = [command];
                if (command == 'm') command = 'l';
                else if (command == 'M') command = 'L';
                paramCount = parameterCount[command.toLowerCase()];
            } else {
                if (part.length > paramCount) parts[++index] = part = [command];
                part.push(Number(bit));
            }
        }
        return parts;
    };
    
    Visualization.MutablePath = new Class({
        Extends: ART.Path,
        changed: false,
        segmentCache:{ vml : {}, raw : {}, svg : {} },
        alterSegment: function(position, value){
            if(typeOf(value) == 'string'){
                value = parse(value);
            }
            if(value.length-1 != parameterCount[value[0].trim().toLowerCase()]) throw 'parameter count error for line segment '+value[0]+'('+value.length+' instead of '+parameterCount[value[0].trim().toLowerCase()]+')';
            if(!this.path[position] && position == this.path.length){
                this.path.push(value);
                return;
            }
            // like a young Kevin Bacon, these shapes want to dance in this lifetime, even though city hall says 'no'
            if(typeOf(position) == 'number'){
                this.path[position] = value;
                this.changed = true;
                if(this.cache.svg) delete this.cache.svg;
            }else{ 
                //find by value
            }
	    },
	    segment : function(position, format){ //we use SVG or raw so we have *some* syntax to describe a path that isn't stack based
	        if(!format) format = 'raw';
	        if(!this.path[position]) throw('no position to fetch path segment');
	        var result = false;
	        switch(format){
	            case 'raw' :
	                result = this.path[position];
	                break;
	            case 'svg' :
	                result = this.path[position].join(' ');
	                break;
	            default :
	                thow('unsupported segment return type:'+format);
	        }
	        if(result.contains('NaN')) throw Exception('your path is wonked');
	        return result;
	    },
	    toSVG : function(){
	        if( (!this.cache.svg) || this.cache.svg == 'undefined'){ //bug in shapes interface
	            var res = ''; this.path.map(function(item){ res += item.join(' '); });
	            this.cache.svg = res;
	        }
	        return this.cache.svg;
	    }
	    
    });
})();

