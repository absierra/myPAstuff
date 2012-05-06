//todo: implement optional decay on interval with delay
//todo: implement auto index of all traits ('introspect' mode)
Element.Probe = new Class({
	Implements: [Options,Events],
	options: {
		interval: 100
	},
	running: false,
	styles: {},
	attributes: {},
	properties: {},
	eventTypes: {},
	initialize: function(element, options) {
	    if(!options) options = {};
		this.setOptions(options);
		this.element = document.id(element);
		this.worker = function(){
		    Object.each(this.styles, function(style, name){
		        var value = this.element.getStyle(name);
		        if(value != style.value){
		            var payload = {
		                name :  name,
                        original : styles.value,
                        current : value,
                        type : 'style'
                    };
		            if(this.eventTypes.change) this.fireEvent('change', payload);
		            if(this.styles[name].callback) this.styles[name].callback(payload);
		            this.styles[name].value = value;
		        }
		    }.bind(this));
		    Object.each(this.attributes, function(attribute, name){
		        var value = this.element.getAttribute(name);
		        if(value != attribute.value){
		            var payload = {
		                name :  name,
                        original : attribute.value,
                        current : value,
                        type : 'attribute'
                    };
		            if(this.eventTypes.change) this.fireEvent('change', payload);
		            if(this.attributes[name].callback) this.attributes[name].callback(payload);
		            this.attributes[name].value = value;
		        }
		    }.bind(this));
		    Object.each(this.properties, function(property, name){
		        var value = this.element[name];
		        if(value != property.value){
		            var payload = {
		                name :  name,
                        original : property.value,
                        current : value,
                        type : 'property'
                    };
		            if(this.eventTypes.change) this.fireEvent('change', payload);
		            if(this.properties[name].callback) this.properties[name].callback(payload);
		            this.properties[name].value = value;
		        }
		    }.bind(this));
		}.bind(this);
	},
	monitor: function(type, field, callback){
	    var handledNatively = false;
        switch(type.toLowerCase()){
            case 'attribute':
                if(document.mutable){
                    this.element.addEventListener("DOMAttrModified", function(event){
                        var payload = {
                            name :  event.attrName,
                            original : event.attrChange,
                            current : event.newValue,
                            type : 'attribute'
                        };
                        if(this.eventTypes.change) this.fireEvent('change', payload);
                        if(this.attributes[name].callback) this.attributes[name].callback(payload);
                    });
                    handledNatively = true;
                }
                break;
            case 'property':
                if(this.element.watch){
                    this.element.watch(field, function(field, original, current){
                        var payload = {
                            name :  field,
                            original : original,
                            current : current,
                            type : 'attribute'
                        };
                        if(this.eventTypes.change) this.fireEvent('change', payload);
                        if(this.attributes[name].callback) this.attributes[name].callback(payload);
                    }.bind(this));
                    handledNatively = true;
                }
                break;
            case 'style':
                //nothing native
                break;
        }
	    if(!handledNatively){
            switch(type.toLowerCase()){
                case 'attribute':
                    this.attributes[field] = {
                        callback : callback,
                        value : this.element.getAttribute(field)
                    };
                    if(!this.running) this.start();
                    break;
                case 'property':
                    this.properties[field] = {
                        callback : callback,
                        value : this.element[field]
                    };
                    if(!this.running) this.start();
                    break;
                case 'style':
                    this.styles[field] = {
                        callback : callback,
                        value : this.element.getStyle(field)
                    };
                    if(!this.running) this.start();
                    break;
            }
	    }
	    return true;
	},
	start: function() {
		this.interval = this.worker.periodical(this.options.interval);
		this.running = true;
		return this;
	},
	stop: function() {
		clearInterval(this.interval);
		this.running = false;
		return this;
	}
});

document.mutable = (function(){
    var dummy = new Element('div');
    return dummy.addEventListener ?
        (function() {
            var e, l, f = false;
            l = dummy.id;
            e = function() {
                dummy.removeEventListener('DOMAttrModified', e, false);
                document.mutable = true;
                dummy.id = l;
            }.bind(this);
            dummy.addEventListener('DOMAttrModified', e, false);
            dummy.id = 'nw';
            f = dummy.id != 'nw';
            dummy.id = l;
            return f;
        }.bind(this))() : false;
})();

Element.implement({
    monitor : function(type, value, callback){
        if(!this.probe) this.probe = new Element.Probe(this);
        this.monitor = this.probe.monitor.bind(this.probe);
        return this.monitor(type, value, callback);
    }
});
/*if(!Element.prototype.watch) Element.implement({
    watch : function(value, callback){
        return this.monitor('property', value, callback);
    }
});*/
