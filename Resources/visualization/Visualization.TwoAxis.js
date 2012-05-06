/*
---
name: Fx.Step
description: "It ♥s ART, over time"
requires: [Fx, Fx/CSS, Color/Color, ART]
provides: [Fx/Step]
...
*/

(function(){
    function makeLine(x1, y1, x2, y2){
        var path = new Visualization.MutablePath();
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
        var result = new ART.Shape(path);
        result.element.setStyle('stroke', '#737477');
        result.element.setStyle('fill', 'none');
        return result;
    }
    Visualization.TwoAxis = new Class({
        Extends : Visualization,
        text : false,
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
        resize : function(){
            this.update();
        },
        bind : function(data){
            this.data = data;
            this.redraw();
        },
        xMin : function(){
            return this.data.minimum(this.options.x_axis);
        },
        yMin : function(){
            return this.data.minimum(this.options.y_axis) - (this.data.maximum(this.options.y_axis) - this.data.minimum(this.options.y_axis))*0.2;
        },
        xMax : function(){
            return this.data.maximum(this.options.x_axis);
        },
        yMax : function(){
            return this.data.maximum(this.options.y_axis) + (this.data.maximum(this.options.y_axis) - this.data.minimum(this.options.y_axis))*0.2;
        },
        xScale : function(x){
            var x_min = this.xMin();
            var x_max = this.xMax();
            var padSize = this.options.leftPadding + this.options.rightPadding;
            var range = x_max - x_min;
            var width = this.element.getSize().x;
            var result = this.options.leftPadding + (x-x_min)*(((width-padSize)/range));
            //console.log(['xs', result, (x-x_min), x_min, x, range, width-padSize, (((width-padSize)/range))]);
            return result;
        },
        yScale : function(y){
            var y_min = this.yMin();
            var y_max = this.yMax();
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
            var x_min = this.xMin();
            var x_max = this.xMax();
            var y_min = this.yMin();
            var y_max = this.yMax();
            var segments = 8;
            var size = this.element.getSize();
            //todo: only if diff
            if( this.options.grid &&
                ( 
                    (this.options.grid.minimum && size.x > this.options.grid.minimum)
                )
            ){
                var horizontal_range = x_max - x_min;
                var horizontal_padding = this.options.leftPadding + this.options.rightPadding;
                var vertical_range = y_max - y_min;
                var vertical_padding = this.options.topPadding + this.options.bottomPadding;
                horizontal_increment = ((horizontal_range)*((this.element.getSize().x-horizontal_padding)/horizontal_range))/(segments-1);
                horizontal_max = this.options.leftPadding + segments * horizontal_increment;
                vertical_increment = ((vertical_range)*((this.element.getSize().y-vertical_padding)/vertical_range))/(segments-1);
                vertical_max = this.options.topPadding + segments * vertical_increment;
                mincrement = Math.min(horizontal_increment, vertical_increment);
                for(var lcv=0; lcv < segments; lcv++){
                    var x = this.options.leftPadding + lcv * horizontal_increment;
                    var y = this.options.topPadding + lcv * vertical_increment;
                    var horizontal_line, vertical_line;
                    var label = Math.floor(y_min + (segments - lcv-1) * vertical_increment);
                    if(!this.graduations.horizontal[lcv]){
                        horizontal_line = (makeLine(this.xScale(x_min), y, this.xScale(x_max), y));
                        //*
                        horizontal_line.label = new ART.Text(label);
                        horizontal_line.label.moveTo(this.xScale(x_min), y);
                        horizontal_line.label.resizeTo(
                            (mincrement/8)*String.from(label).length,
                            mincrement/3
                        );
                        horizontal_line.label.element.setAttribute('fill', this.options.labelColor);
                        horizontal_line.label.inject(this.art);//*/
                        horizontal_line.inject(this.art);
                        this.graduations.horizontal[lcv] = horizontal_line;
                    }else{
                        this.graduations.horizontal[lcv].show();
                        //*
                        if(this.graduations.horizontal[lcv].label){
                            this.graduations.horizontal[lcv].label.show();
                            this.graduations.horizontal[lcv].label.moveTo(this.xScale(x_min), y);
                            this.graduations.horizontal[lcv].label.resizeTo((mincrement/8)*String.from(label).length, mincrement/3);
                            if(lcv == segments-1){
                                this.graduations.horizontal[lcv].label.move(0, -1*vertical_increment/2);
                                //console.log('surprise, you\'re dead')
                            }
                        }//*/
                        this.graduations.horizontal[lcv].path.alterSegment(0, ['M', this.xScale(x_min), y]);
                        this.graduations.horizontal[lcv].path.alterSegment(1, ['L', this.xScale(x_max), y]);
                        this.graduations.horizontal[lcv].repaint();
                    }
                    if(!this.graduations.vertical[lcv]){
                        vertical_line = (makeLine(x, this.yScale(y_min), x, this.yScale(y_max)));
                        /*vertical_line.label = new ART.Text(Math.floor(x_min + (lcv) * horizontal_increment));
                        vertical_line.label.moveTo(x, this.yScale(y_min));
                        vertical_line.label.resizeTo(
                            (mincrement/8)*String.from(label).length,
                            mincrement/3
                        );
                        vertical_line.label.element.setAttribute('fill', this.options.labelColor);
                        vertical_line.label.inject(this.art);*/
                        vertical_line.inject(this.art);
                        this.graduations.vertical[lcv] = vertical_line;
                    }else{
                        this.graduations.vertical[lcv].show();
                        /*if(this.graduations.vertical[lcv].label){
                            this.graduations.vertical[lcv].label.show();
                            this.graduations.vertical[lcv].label.moveTo(x, this.yScale(y_min)-mincrement/3);
                            this.graduations.vertical[lcv].label.resizeTo(
                                (mincrement/8)*String.from(label).length,
                                mincrement/3
                            );
                            if(lcv == 0){
                                this.graduations.vertical[lcv].label.move(horizontal_increment/2 - (mincrement/8)*String.from(label).length, 0);
                                //console.log('surprise, you\'re dead')
                            }
                            if(lcv == segments-1){
                                this.graduations.vertical[lcv].label.move((mincrement/8)*String.from(label).length-horizontal_increment/2, 0);
                            }
                            this.graduations.vertical[lcv].label.rotateTo(-45);
                        }*/
                        this.graduations.vertical[lcv].path.alterSegment(0, ['M', x, this.yScale(y_min)]);
                        this.graduations.vertical[lcv].path.alterSegment(1, ['L', x, this.yScale(y_max)]);
                        this.graduations.vertical[lcv].repaint();
                    }
                }
            }else{
                for(var lcv=0; lcv < segments; lcv++){
                    if(this.graduations.horizontal[lcv]) this.graduations.horizontal[lcv].hide();
                    if(this.graduations.horizontal[lcv] && this.graduations.horizontal[lcv].label) this.graduations.horizontal[lcv].label.hide();
                    if(this.graduations.vertical[lcv]) this.graduations.vertical[lcv].hide();
                    if(this.graduations.vertical[lcv] && this.graduations.vertical[lcv].label) this.graduations.vertical[lcv].label.hide();
                }
            }
        }
    });
})();

