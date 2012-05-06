/*
---
name: Fx.Step
description: "It ♥s ART, over time"
requires: [Fx, Fx/CSS, Color/Color, ART]
provides: [Fx/Step]
...
*/

(function(){
    function orderSet(unorderedSet, axis, direction){
        if(!direction) direction ='';
        if(unorderedSet.length == 0) return unorderedSet;
        //if(!(unorderedSet[0] && unorderedSet[0][axis])) console.log(unorderedSet); //throw('cannot sort on invalid axis');
        switch(direction.toLowerCase()){
            case 'descending':
            case 'desc':
                direction = Array.DESCENDING;
                break;
            case 'ascending':
            case 'asc':
            default:
                direction = 0;
        }
        if(typeOf(unorderedSet[0][axis]) == 'number') unorderedSet.sortOn(axis, Array.NUMERIC | direction);
        else unorderedSet.sortOn(axis, Array.CASEINSENSITIVE | direction);
        return unorderedSet;
    }
    Visualization.Set = new Class({
        data : [],
        groupings : {},
        listeners : {
            'change' : [],
            'add' : [],
            'remove' : [],
            'ready' : []
        },
        cache : {},
        orderingCache : {},
        initialize : function(data){
            if(data) this.add(data);
        },
        addEvent : function(type, callback){
            if(!this.listeners[type]) throw('Unsupported event type: '+type);
            this.listeners[type].push(callback);
        },
        position : function(id){
            if(typeOf(id) == 'object') id = id.id;
            var result = false;
            this.data.each(function(item, position){
                if(item.id == id) result = position;
            });
            return result;
        },
        each : function(fn, ordering){
            if(ordering){
                if(typeOf(ordering) == 'string') ordering = {axis:ordering};
                this.data.ordered(ordering.axis, ordering.direction).each(fn);
            }else this.data.each(fn);
        },
        ordered : function(axis, direction){
            var key = axis+':'+direction;
            if(!this.orderingCache[key]){
                this.orderingCache[key] = orderSet(this.data.clone(), axis, direction);
            }
            return this.orderingCache[key];
        },
        order : function(axis, direction){
            orderSet(this.data, axis, direction);
            this.listeners.change.each(function(listener){ listener(this.data); }.bind(this));
        },
        minimum : function(axis){
            if(!(this.cache[axis] && this.cache[axis].min)){
                var min = false;
                if(!this.cache[axis]) this.cache[axis] = {};
                this.data.each(function(item){
                    if((!min) || item[axis] < min) min = item[axis];
                });
                this.cache[axis].min = min;
            }
            return this.cache[axis].min;
        },
        maximum : function(axis){
            if(!(this.cache[axis] && this.cache[axis].max)){
                var max = false;
                if(!this.cache[axis]) this.cache[axis] = {};
                this.data.each(function(item){
                    if((!max) || item[axis] > max) max = item[axis];
                });
                this.cache[axis].max = max;
            }
            return this.cache[axis].max;
        },
        alter: function(item, position){
            var func = function(item, position){
                //console.log(['altering', item]);
                if( (!position) && (!item.id) ) throw('no identifier: ambiguous node alter!');
                if(!position) position = this.position(item.id);
                //delete item.id;
                this.cache[axis] ={};
                Object.each(item, function(value, key){
                    //console.log(['set', key, value]);
                    this.data[position][key] = value;
                }.bind(this));
            }.bind(this);
            if(typeOf(item) == 'array'){
                //console.log(['AAA', item]);
                item.each(function(obj){
                    func(obj);
                });
            }else func(item, position);
            this.orderingCache = {};
            this.listeners.change.each(function(listener){ listener(this.data[position]); }.bind(this));
        },
        uuid: function(){
            var s = [], itoh = '0123456789ABCDEF';
            for (var i = 0; i <36; i++) s[i] = Math.floor(Math.random()*0x10);
            s[14] = 4; s[19] = (s[19] & 0x3) | 0x8;
            for (var i = 0; i <36; i++) s[i] = itoh[s[i]];
            s[8] = s[13] = s[18] = s[23] = '-';
            return s.join('');
        },
        add: function(item){
            if(typeOf(item) == 'array'){
                item.each(function(member){
                    if(!member.id) member.id = this.uuid();
                    this.data.push(member);
                    
                }.bind(this));
            }else{
                if(!item.id) item.id = this.uuid();
                this.data.push(item);
            }
            this.listeners.add.each(function(listener){ listener(item); });
            this.listeners.change.each(function(listener){ listener(item); });
        },
        remove: function(item){
            if(typeOf(item) == 'array'){
                item.each(function(member){
                    this.data.remove(member);
                }.bind(this));
            }else{
                this.data.remove(item);
            }
            this.listeners.remove.each(function(listener){ listener(item); });
            this.listeners.change.each(function(listener){ listener(item); });
        }
    });
    Visualization.Set.random = function(){
        var result = [];
        var loopCount = 10 + Math.floor(Math.random()*11);
        var distance = 200/loopCount;
        var lastValue = 100;
        var current;
        for(var lcv=0; lcv < loopCount; lcv++){
            current = Math.floor(Math.random()*101)-50;
            result.push({x:(lcv*distance),y:(lastValue-current)});
        }
        return result;
    }
})();

