/*
---
name: Fx.Step
description: "It ♥s ART, over time"
requires: [Fx, Fx/CSS, Color/Color, ART]
provides: [Fx/Step]
...
*/

(function(){

Visualization.PieChart = new Class({
    Extends : Visualization.RadialAxis,
    markers: {},
    wedge:{},
    wedgeShape:{},
    closed:{},
    initialize: function(element, options){
        this.data = new Visualization.Sets();
        if(!options) options = {};
        if(!options.x_axis) options.x_axis = 'x';
        if(!options.y_axis) options.y_axis = 'y';
        if(!options.baseColor) options.baseColor = new Color('#660000');
        if(!options.padding) options.padding = 30;
        this.currentColor = 0;
        if(!options.colors) options.colors = [options.baseColor.setBrightness(20), options.baseColor.setBrightness(35), options.baseColor.setBrightness(50), options.baseColor.setBrightness(70), options.baseColor.setBrightness(90), options.baseColor.setBrightness(100)];
        this.parent(element, options);
        var size = element.getSize();
        var art = new ART(size.x, size.y);
        art.inject(element);
        this.art = art;
        if(options.node){
            if(!options.node.size) options.node.size = 8;
            if(!options.node.mouseover_scale) options.node.mouseover_scale = 2;
        }
        this.parent(element, options);
    },
    nextColor : function(){
        var result = this.options.colors[this.currentColor%this.options.colors.length];
        this.currentColor++;
        return result;
    },
    node : function(seriesName, id){
        if(typeOf(id) == 'string'){
            var result = false;
            this.markers[seriesName].each(function(marker){ if(marker.id == id) result = marker; });
            return result;
        }else{ //by position
            return this.markers[seriesName][id];
        }
    },
    bind : function(data, name){
        if(data instanceof Visualization.Sets){
            this.data = data;
            this.data.eachSeries(function(series, name){
                this.createElements(series, name);
            }.bind(this));
        }else{
            this.data.add(name, data);
            this.createElements(data, name);
        }
    },
    makeDraggable : function(){
        var viz = this.element.getChildren()[0];
        var resize = function(){
            if(this.element.getStyle('height') > this.element.getStyle('width')) this.element.setStyle('width', this.element.getStyle('height'));
            else this.element.setStyle('height', this.element.getStyle('width'));
            viz.setStyle('height', this.element.getStyle('height'));
            viz.setStyle('width', this.element.getStyle('width'));
            this.data.eachSeries(function(series, seriesName){
                this.wedge[seriesName].repaint();
            }.bind(this));
            this.update();
        }.bind(this);
        this.element.makeResizable({
            onDrag : resize,
            grid : 100,
            limit : {x:[100, 500], y:[100, 500]}
        });
    },
    createElements : function(data, name){
        this.redraw();
    },
    update : function(){ //global draw elements for the graph
        var size = this.element.getSize();
        var seriesValues = {};
        var total = 0;
        this.data.eachSeries(function(series, seriesName){
            seriesValues[seriesName] = 0;
            series.each(function(item){
                seriesValues[seriesName] += item['x'];
                total += item['x'];
            });
        }.bind(this));
        var startAngle = 0;
        Object.each(seriesValues, function(seriesValue, seriesName){
            var fraction = seriesValue/total;
            var angle = Math.floor(fraction * 360);
            var size = this.element.getSize();
            var min_size = Math.min(size.x, size.y);
            var radius = min_size/2 - this.options.padding;
            if(!this.wedge[seriesName]){
                this.wedge[seriesName] = new ART.Wedge(0, radius, Math.floor(startAngle), Math.floor(startAngle+angle));
                this.wedge[seriesName].moveTo(this.options.padding, this.options.padding);
                this.wedge[seriesName].inject(this.art);
                var color = this.nextColor();
                this.wedge[seriesName].element.setStyle('fill', 'rgb('+color+')');
                var graph = this;
                var offset = radius*0.2;
                var x = graph.wedge[seriesName].x;
                var y = graph.wedge[seriesName].y;
                var effect = new Fx.Step(graph.wedge[seriesName], {
                    link : 'cancel',
                    setter : function(scale, direction){
                        graph.wedge[seriesName].scaleTo(scale);
                        var delta = scale-1;
                        graph.wedge[seriesName].moveTo(x + -1*delta*radius, y + -1*delta*radius);
                    },
                    args : ['scale', 'direction']
                });
                this.wedge[seriesName].element.addEvent('mouseover', function(){
                    effect.start(
                        {scale:1}, 
                        {scale:1.1}
                    );
                    this.wedge[seriesName].element.setAttribute('stroke', 'rgb('+this.options.baseColor.setBrightness(100)+')');
                    this.wedge[seriesName].element.setAttribute('stroke-width', '2');
                }.bind(this));
                this.wedge[seriesName].element.addEvent('mouseout', function(){
                    effect.start(
                        {scale:1.1}, 
                        {scale:1}
                    );
                    this.wedge[seriesName].element.setAttribute('stroke', 'none');
                }.bind(this));
                startAngle += angle;
            }else{
                this.wedge[seriesName].draw(0, radius, startAngle, startAngle+angle);
                startAngle += angle;
            }
        }.bind(this));
        this.parent();
    },
    select : function(node){
    
    }
});
Visualization.PieChart.simple = function(selector, sets){
        window.graph = new Visualization.PieChart(document.getElements(selector)[0], {
            node : {
                size : 8,
                events :{
                    create : function(shape){
                        shape.effect = new Fx.Step(shape, {
                            link : 'cancel'
                        });
                        shape.element.setStyle('fill', '#CCCCFF');
                    },
                    mouseover : function(shape){
                        shape.element.setAttribute('class', 'node selected');
                        shape.effect.start(1.0, 2.0);
                    },
                    mouseout : function(shape){
                        shape.element.setAttribute('class', 'node');
                        shape.effect.start(2.0, 1.0);
                    },
                    click : function(shape){
                        this.select(marker);
                    },
                    change : function(shape){
                        
                    },
                    select : function(shape){
                        
                    }
                }
            },
            events :{
                create : function(shape, line){
                    shape.element.setStyle('stroke', nextColor());
                    if(!shape.closed) shape.element.setStyle('fill', 'none');
                    else shape.element.setStyle('fill', '#246592');
                }
            }
        });
        sets.order('x');
        graph.closed['line1'] = true;
        graph.bind(sets);
        //graph.makeDraggable();
        return graph;
    };
})();

