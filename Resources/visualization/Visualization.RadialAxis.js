/*
---
name: Fx.Step
description: "It ♥s ART, over time"
requires: [Fx, Fx/CSS, Color/Color, ART]
provides: [Fx/Step]
...
*/

(function(){
    Visualization.RadialAxis = new Class({
        Extends : Visualization,
        graduations : {vertical:{}, horizontal:{}},
        initialize: function(element, options){
            if(!options.rightPadding) options.rightPadding = 10;
            if(!options.leftPadding) options.leftPadding = 10;
            if(!options.topPadding) options.topPadding = 10;
            if(!options.bottomPadding) options.bottomPadding = 10;
            if(!options.labelColor) options.labelColor = '#bee3f9';
            this.parent(element, options);
            this.data.minimum = function(){
                var res;
                Object.each(this.data, function(currentSet, setName){
                    var value = currentSet.minimum();
                    if(res < value) value = res;
                });
                return res;
            };
            this.data.maximum = function(){
                var res;
                Object.each(this.data, function(currentSet, setName){
                    var value = currentSet.maximum();
                    if(res < value) value = res;
                });
                return res;
            };
        },
        computeBoundaries : function(){
            
        },
        bind : function(data){
            this.data = data;
            this.redraw();
        },
        xScale : function(x){
            var x_min = this.data.minimum('x');
            var x_max = this.data.maximum('x');
            var padSize = this.options.leftPadding + this.options.rightPadding;
            var range = x_max - x_min;
            var result = this.options.leftPadding + (x-x_min)*((this.element.getSize().x-padSize)/range);
            return result;
        },
        yScale : function(y){
            var y_min = this.data.minimum('y');
            var y_max = this.data.maximum('y');
            var padSize = this.options.topPadding + this.options.bottomPadding;
            var range = y_max - y_min;
            var height = this.element.getSize().y;
            var result = this.options.topPadding + (y-y_min)*((height-padSize)/range);
            return height-result;
        },
        redraw : function(){
            this.update();
            if( this.data instanceof Visualization.Sets){
                this.data.eachSeries(function(series, seriesName){
                    series.each(function(item, index){
                        if(this.options.node) 
                            if(!this.nodes[seriesName]) this.nodes[seriesName] = [];
                            if(!this.nodes[seriesName][index] && this.options.node.create) this.nodes[seriesName][index] = this.options.node.create(item, seriesName);
                    }.bind(this));
                }.bind(this));
            }else{
                this.data.data.each(function(item, position){
                    if(this.options.node && !this.nodes[position]){
                        this.nodes[position] = this.options.node.create(item);
                    }
                }.bind(this));
            }
        },
        update : function(){ //global draw elements for the graph
            var x_min = this.data.minimum('x');
            var x_max = this.data.maximum('x');
            var y_min = this.data.minimum('y');
            var y_max = this.data.maximum('y');
            var segments = 8;
            if(
                //( (!this.xMin) || x_min < this.xMin) ||
                //( (!this.yMin) || y_min < this.yMin) ||
                //( (!this.xMax) || x_max > this.xMax) ||
                //( (!this.yMax) || y_max > this.yMax)
                true
            ){
                
                this.xMin = x_min;
                this.yMin = y_min;
                this.xMax = x_max;
                this.yMax = y_max;
            }
        }
    });
})();

