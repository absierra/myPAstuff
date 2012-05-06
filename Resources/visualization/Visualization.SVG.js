/*
---
name: ART.SVG++
description: "I munge ART for the good of the many"
provides: [ART.SVG++]
requires: [ART, ART.Element, ART.Container, ART.Transform, ART.Path, ART.SVG]
...
*/

(function(){
    //code duplication, like fecal aerosol 
    var NS = 'http://www.w3.org/2000/svg', XLINK = 'http://www.w3.org/1999/xlink', XML = 'http://www.w3.org/XML/1998/namespace',
        UID = 0,
        createElement = function(tag){
            return document.createElementNS(NS, tag);
        }; 
    // end duplication
    var modifications = {
        initialize : function(path, width, height){
            //copied from ART.SVG.Shape.initialize
            this.parent('path');
            this.element.setAttribute('fill-rule', 'evenodd');
            this.width = width;
            this.height = height;
            if (path != null) this.draw(path);
            //end copied code
            this.path = path;
            return this; //copied chaining :P
        },
        centroidScaleTo: function(x, y){
            if(!y) y = x;
            var xx = this.xx;
            var yy = this.yy;
            this.scaleTo(x, y);
            this.move( (xx - this.xx) * this.width / 2 , (yy - this.yy) * this.height / 2 );
        },
        centroidMoveTo: function(x, y){
            this.moveTo( x-(this.width/2), y-(this.height/2)  );
        },
        repaint : function(){
            if(this.path && this.path.changed){
                this.draw(this.path.toSVG(), this.width, this.height);
            }else{
            
            }
        }
    };
	ART.SVG.Shape = Class.refactor(ART.SVG.Shape, modifications);
})();