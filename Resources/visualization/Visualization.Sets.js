/*
---
name: Fx.Step
description: "It ♥s ART, over time"
requires: [Fx, Fx/CSS, Color/Color, ART]
provides: [Fx/Step]
...
*/

(function(){
    Visualization.Sets = new Class({
        data : {},
        setName : 'set',
        listeners : {
            'change' : [],
            'add' : [],
            'remove' : [],
            'ready' : []
        },
        initialize : function(){
            //todo: init from flat set
        },
        series : function(){
            return Object.keys(this.data);
        },
        eachSeries : function(callback){
            this.series().each(function(seriesName, position){
                callback(this.data[seriesName], seriesName);
            }.bind(this));
        },
        addEvent : function(setName, type, callback){
            //console.log(['evv', setName, type, callback]);
            if(!this.data[setName]) throw('Trying to operate on nonexistent set: '+setName);
            return this.data[setName].addEvent(type, callback);
        },
        position : function(setName, id){
            if(!this.data[setName]) throw('Trying to operate on nonexistent set: '+setName);
            return this.data[setName].position(id);
        },
        order : function(setName, axis, direction){
            if( (!axis) && (!direction)){
                axis = setName;
                delete setName; //this is where readability trumps efficiency
                this.series().each(function(seriesName, position){
                    var data = this.data[seriesName];
                    data.order(axis);
                }.bind(this));
            }else{
                if(!this.data[setName]) throw('Trying to operate on nonexistent set: '+setName);
                return this.data[setName].order(axis, direction);
                //todo: with and without set name order(setName, axis, direction), order(axis, direction), order(setName, axis), order(axis)
            }
        },
        filter : function(setName, axis, minimum, maximum){
            //drop down to internal set filter (buffer full set internally);
            
        },
        minimum : function(setName, axis){
            if(setName && !axis){
                var res = Number.MAX_VALUE;
                axis = setName;
                Object.each(this.data, function(currentSet, setName){
                    var value = currentSet.minimum(axis);
                    if(res > value) res = value;
                });
                return res;
            }
            if(!this.data[setName]) throw('Trying to operate on nonexistent set: '+setName);
            return this.data[setName].minimum(axis);
            //todo: global on 1 arg
        },
        each : function(setName, callback, ordering){
            if(arguments.length != 3){
                if(arguments.length == 1){
                    callback = arguments[0];
                    delete setName;
                }
                // 2args
                if(typeOf(arguments[0]) == 'function'){ //fn, ordering
                    callback = arguments[0];
                    ordering = arguments[1];
                    delete setName;
                }//else setName, fn
            }
            if(ordering && (typeOf(ordering) == 'string') ) ordering = {axis:ordering};
            if(setName){
                if(ordering) Object.each(this.data, function(data, series){
                    data.ordered(ordering.axis, ordering.direction).each(callback);
                });
                else Object.each(this.data, function(data, series){
                    data.each(callback);
                });
            }else{
                if(ordering) this.data.ordered(ordering.axis, ordering.direction).each(callback);
                else this.data.each(callback);
            }
        },
        maximum : function(setName, axis){
            if(setName && !axis){
                var res = Number.MIN_VALUE;
                axis = setName;
                Object.each(this.data, function(currentSet, setName){
                    var value = currentSet.maximum(axis);
                    if(res < value) res = value;
                });
                return res;
            }
            if(!this.data[setName]) throw('Trying to operate on nonexistent set: '+setName);
            return this.data[setName].maximum(axis);
            //todo: global on 1 arg
        },
        alter: function(setName, item, position){
            if(!this.data[setName]) throw('Trying to operate on nonexistent set: '+setName);
            return this.data[setName].alter(item, position);
        },
        add: function(setName, item){
            if( (!item) && typeOf(setName) == 'array'){
                setName.each(function(setItem){
                    this.add(setItem);
                });
            }else{
                if(typeOf(item) == 'array'){
                    
                }else{
                    if(item instanceof Visualization.Set){
                        this.data[setName] = item;
                    }else{
                        if(!this.data[setName]) throw('Trying to operate on nonexistent set: '+setName);
                        return this.data[setName].add(item);
                    }
                }
            }
        },
        remove: function(setName, item){
            if(!this.data[setName]) throw('Trying to operate on nonexistent set: '+setName);
            return this.data[setName].remove(item);
        }
    });
})();

