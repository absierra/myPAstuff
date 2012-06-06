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
    /*var result = [];
    for(var lcv=0;lcv<args.num;lcv++){
    	console.log(args.color);
        var newColor = new Color(args.color);
        var newColor = (newColor).setHue((newColor.hsb[0]+(359/args.num)*lcv)%359);
        if(args.result)result.push(newColor[args.result]);
        else result.push(newColor);
    }
    console.log(result);
    return result;*/

    var colors = ['#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099', '#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099', '#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099','#CB0077', '#A2EF00', '#699B00', '#84004D', '#00A580', '#35D2AF', '#FF6200', '#FF8940', '#1046AA', '#4577D4', '#FFA500', '#FFBC40', '#640BAC', '#9240D5', '#FFF500', '#FFF840', '#F10026', '#F83E5B', '#3BDA00', '#6BED3B', '#FF6400', '#FF8B40', '#00A483', '#34D1B3', '#FF8700', '#FFA540', '#024A69', '#0773A1', '#FFC200', '#FFDD73', '#0C0847', '#7672D9', '#FFE800', '#FFF273', '#330571', '#996AD6', '#E2FA00', '#EFFD72', '#58026E', '#BE63D4', '#92EC00', '#C2F56E', '#890043', '#E969A8', '#009A9A', '#5CCCCC', '#A64B00', '#FFB273', '#0B5FA5', '#66A1D2', '#A66000', '#FFAE40', '#1435AE', '#061D71', '#FFD473', '#BF9430', '#530EAE', '#330571', '#FFEE40', '#BFB230'];

    //var colors = ['#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099', '#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099', '#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099'];
    //var colors = ['#2E67B2', '#99CA3C', '#673466', '#FFCD32', '#EE1D3A', '#603913', '#FFCD05', '#8C3694', '#996632', '#50C3C6', '#F89838', '#991C20', '#39B54A', '#F26837', '#EE2A66'];
    return colors.slice(0, args.num);
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
