Array.implement({
  shuffle: function() {
    //destination array
    for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
  }
});
var PseudoDOM = {};
PseudoDOM.pseudo = function(element, properties, pseudo){
    var id = element.getAttribute('id');
    if(!id){
        id = 'pseudo-chop-'+Math.floor(Math.random()*6000);
        element.setAttribute('id', id);
    }
    var style = document.getElementById(id+'-rule');
    if(!style){
        style = new Element('style', {
            id : id+'-rule',
            class : 'pseudo-chop'
        });
    }
    var css = '#'+id+'::'+pseudo+'{\n';
    Object.each(properties, function(value, key){
        css += key+' : '+value+';\n';
    });
    css += '}';
    style.innerHTML = css;
    style.inject(document.head);
};
PseudoDOM.before = function(element, properties){
    return PseudoDOM.pseudo(element, properties, 'before');
};
PseudoDOM.after = function(element, properties){
    return PseudoDOM.pseudo(element, properties, 'after');
};
PseudoDOM.clear = function(element, properties){
    document.getElements('.pseudo-chop').destroy();
};
function hueShiftedColorSet(){
    var args = {};
    var arg;
    for(var lcv=0; lcv < arguments.length; lcv++){
        arg = arguments[lcv];
        if(typeOf(arg) == 'number') args.num = arg;
        else if(
            typeOf(arg) == 'array' ||
            (typeOf(arg) == 'string' && arg.match(/#?[0-9A-F]{6}/))
        ) args.color = arg;
        else if(typeOf(arg) == 'string') args.result = arg;
    };
    if(!args.num) args.num = 5;
    if(!args.color) args.color = '#336699';
    var result = [];
    for(var lcv=0;lcv<args.num;lcv++){
        var newColor = new Color(args.color);
        var newColor = (newColor).setHue((newColor.hsb[0]+(359/args.num)*lcv)%359);
        if(args.result)result.push(newColor[args.result]);
        else result.push(newColor);
    }
    return result;
}
/*
(function(context){
    function unwrapStringOrNumber(obj) {
        return (obj instanceof Number || obj instanceof String 
                ? obj.valueOf() 
                : obj);
    }
    function areEquivalent(a, b) {
        a = unwrapStringOrNumber(a);
        b = unwrapStringOrNumber(b);
        if (a === b) return true; //e.g. a and b both null
        if (a === null || b === null || typeof (a) !== typeof (b)) return false;
        if (a instanceof Date) 
            return b instanceof Date && a.valueOf() === b.valueOf();
        if (typeof (a) !== "object") 
            return a == b; //for boolean, number, string, xml
    
        var newA = (a.areEquivalent_Eq_91_2_34 === undefined),
            newB = (b.areEquivalent_Eq_91_2_34 === undefined);
        try {
            if (newA) a.areEquivalent_Eq_91_2_34 = [];
            else if (a.areEquivalent_Eq_91_2_34.some(
                function (other) { return other === b; })) return true;
            if (newB) b.areEquivalent_Eq_91_2_34 = [];
            else if (b.areEquivalent_Eq_91_2_34.some(
                function (other) { return other === a; })) return true;
            a.areEquivalent_Eq_91_2_34.push(b);
            b.areEquivalent_Eq_91_2_34.push(a);
    
            var tmp = {};
            for (var prop in a) 
                if(prop != "areEquivalent_Eq_91_2_34") 
                    tmp[prop] = null;
            for (var prop in b) 
                if (prop != "areEquivalent_Eq_91_2_34") 
                    tmp[prop] = null;
    
            for (var prop in tmp) 
                if (!areEquivalent(a[prop], b[prop]))
                    return false;
            return true;
        } finally {
            if (newA) delete a.areEquivalent_Eq_91_2_34;
            if (newB) delete b.areEquivalent_Eq_91_2_34;
        }
    }
    Object.equivalent = areEquivalent;
})(this);
*/
