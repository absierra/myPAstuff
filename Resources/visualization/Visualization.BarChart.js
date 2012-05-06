/*
---
name: Fx.Step
description: "It ♥s ART, over time"
requires: [Fx, Fx/CSS, Color/Color, ART]
provides: [Fx/Step]
...
*/

(function(){

Visualization.BarChart = new Class({
    Extends : Visualization.TwoAxis,
    markers: {},
    path:{},
    bar:{},
    closed:{},
    initialize: function(element, options){
        this.data = new Visualization.Sets();
        if(!options) options = {};
        if(!options.x_axis) options.x_axis = 'x';
        if(!options.y_axis) options.y_axis = 'y';
        var size = element.getSize();
        var art = new ART(size.x, size.y);
        art.inject(element);
        this.art = art;
        if(!options.baseColor) options.baseColor = new Color('#660000');
        this.currentColor = 0;
        if(!options.colors) options.colors = [options.baseColor.setBrightness(35), options.baseColor.setBrightness(40), options.baseColor.setBrightness(50), options.baseColor.setBrightness(70), options.baseColor.setBrightness(90), options.baseColor.setBrightness(100)];
        this.options = options;
        this.parent(element, options);
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
    nextColor : function(){
        var result = this.options.colors[this.currentColor%this.options.colors.length];
        this.currentColor++;
        return result;
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
                this.bar[seriesName].repaint();
            }.bind(this));
            this.update();
        }.bind(this);
        this.element.makeResizable({
            onDrag : resize,
            snap : 100,
            limit : {x:[100, 500], y:[100, 500]}
        });
    },
    createElements : function(data, name){
        this.redraw();
        data.addEvent('change', function(changes){
            changes = Array.from(changes);
            changes.each(function(item, changePosition){
                shape = this.node(name, changePosition);
                graph = this;
                var seriesName = name;
                var offset = this.options.node.size/2;
                var effect = new Fx.Step(shape, {
                    link : 'chain',
                    setter : function(x, y){
                        var position = graph.data.position(seriesName, item);
                        var thisShape = graph.node(seriesName, changePosition);
                        //thisShape.centroidMoveTo(x, y);
                        //if(position == 0) graph.line[seriesName].alterSegment(changePosition, ['M', x, y]);
                        //else graph.line[seriesName].alterSegment(changePosition, ['L', x, y]);
                        graph.bar[seriesName].repaint();
                    },
                    args : ['x', 'y']
                });
                effect.start(
                    {x:shape.x, y:shape.y}, 
                    {x:(this.xScale(item.x)), y:(this.yScale(item.y))}
                );
                this.redraw();
            }.bind(this));
        }.bind(this));
    },
    xMin : function(){
        return 0;
    },
    yMin : function(){
        return 0;
    },
    xMax : function(){
        return 100;
    },
    yMax : function(){
        var max = 0;
        this.data.eachSeries(function(series, seriesName){
            val = 0;
            series.each(function(item){
                val += item['x'];
            });
            max = Math.max(max, val);
        }.bind(this));
        return max;
    },
    update : function(){ //global draw elements for the graph
        var size = this.element.getSize();
        var seriesValues = {};
        var total = 0;
        this.data.eachSeries(function(series, seriesName){
            seriesValues[seriesName] = 0;
            series.each(function(item){
                seriesValues[seriesName] += item['x'];
            });
            total++;
        }.bind(this));
        var pieceWidth = size.x/(total*2 + 2);
        var pos = 0;
        Object.each(seriesValues, function(seriesValue, seriesName){
            var x = pieceWidth*pos*2;
            var x1 = this.xScale(x);
            var y1 = this.yScale(0);
            var x2 = this.xScale(x+pieceWidth);
            var y2 = this.yScale(seriesValue);
            if(!this.path[seriesName]) this.path[seriesName] = new Visualization.MutablePath();
            this.path[seriesName].alterSegment(0, [ 'M', x1, y1 ]);
            this.path[seriesName].alterSegment(1, [ 'L', x1, y2 ]);
            this.path[seriesName].alterSegment(2, [ 'L', x2, y2 ]);
            this.path[seriesName].alterSegment(3, [ 'L', x2, y1 ]);
            if(!this.bar[seriesName]){
                this.bar[seriesName] = new ART.Shape(this.path[seriesName]);
                //console.log(['bar', x1, y1, x2, y2, size.x, (total*2 + 1)]);
                this.bar[seriesName].inject(this.art);
                var color = this.nextColor();
                this.bar[seriesName].element.setStyle('fill', 'rgb('+color+')');
            }else this.bar[seriesName].repaint();
            pos++;
            
        }.bind(this));
        this.parent();
    },
    select : function(node){
    
    }
});
Visualization.BarChart.simple = function(selector, sets){
        window.graph = new Visualization.BarChart(document.getElements(selector)[0], {
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

