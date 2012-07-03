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
function hueShiftedColorSet(num, categories){
    //var args = {};
    //var arg;
    
    /*for(var lcv=0; lcv < arguments.length; lcv++){
        arg = arguments[lcv];
        if(typeOf(arg) == 'number') args.num = arg;
        else if(
            typeOf(arg) == 'array' ||
            (typeOf(arg) == 'string' && arg.match(/#?[0-9A-F]{6}/))
        ) args.color = arg;
        else if(typeOf(arg) == 'string') args.result = arg;
    };*/
    //if(!args.num) args.num = 5;
    //if(!args.color) args.color = '#336699';
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
    
    //CITY SWITCH
    if(window.city == 'palo alto'){
    	var colorMap = {'Expenses':'#F3715B', 'Revenues':'#00B039', 'Allocated Charges':'#5578B4', 'Contract Services':'#AB72A6', 'Debt Service':'#F3715B', 'General Expense':'#00B039', 'Rents & Leases':'#F79750', 'Salaries & Benefits':'#A9CEEC', 'Supplies & Materials':'#CACEC3', 'Facilities & Equip Purchases':'#AAA7CA', 'Wastewater Treatment':'#66C190', 'Utility Purchases & Charges':'#DF8B96', 'Capital Improvement':'#68B3E2', 'Charges for Services':'#5578B4', 'Net Sales':'#AB72A6', 'Other Income':'#F3715B', 'Other Revenue':'#00B039', 'Return on Investments':'#F79750', 'Charges to Other Funds':'#A9CEEC', 'From Other Agencies':'#CACEC3', 'Permits and Licenses':'#AAA7CA', 'Other Taxes and Fines':'#66C190', 'Property Taxes':'#DF8B96', 'Rental Income':'#68B3E2', 'Sales Taxes':'#FFDB4E', 'Documentary Transfer Tax':'#FFDB4E', 'Transient Occupancy Tax':'#96D4C3', 'Utility Users Tax':'#A7A9AC', 'Trans In':'#BBBA59', 'Trans Out':'#E7A7CB', 'Trans to CIP':'#996633'};
    }else if(window.city == 'salinas'){
    	var colorMap = {'Expenses':'#F3715B', 
    					'Revenues':'#00B039', 
    					'Administration/Contingencies':'#5578B4', 
    					'Utilities':'#AB72A6', 
    					'Contract Maintenance Services':'#F3715B', 
    					'Training/Conferences/Meetings':'#00B039', 
    					'Advertising':'#F79750', 
    					'Special Dept Supplies':'#A9CEEC', 
    					'Employee Services':'#CACEC3', 
    					'Bond-Principal':'#AAA7CA', 
    					'Paying Agent Fees':'#66C190', 
    					'Professional Services':'#DF8B96', 
    					'Contribution to Other Agencies':'#68B3E2', 
    					'Communications':'#5578B4', 
    					'Rents & Leases':'#AB72A6', 
    					'Capital Outlay':'#F3715B', 
    					'Office Supplies & Materials':'#00B039', 
    					'Outside Services':'#F79750', 
    					'Public Assistance':'#A9CEEC', 
    					'Small Tools & Equipment':'#CACEC3', 
    					'Membership & Dues':'#AAA7CA', 
    					'Books and Publications':'#66C190', 
    					'Financial Assistance':'#DF8B96', 
    					'Bldg/Veh/Equip Maint/Supplies':'#68B3E2', 
    					'Taxes':'#FFDB4E', 
    					'Clothing & Personal Equip':'#FFDB4E', 
    					'Vehicle Fuels & Lubricants':'#96D4C3', 
    					'Impvt Other Than Buildings':'#A7A9AC', 
    					'Chemicals':'#BBBA59', 
    					'Insurance and Bonds':'#E7A7CB', 
    					'Recognition-Award-Protocol':'#996633',
    					'Street Materials':'#F3715B', 
    					'Refunds & Reimb Damages':'#00B039', 
    					'Stores Sales':'#5578B4', 
    					'Buildings':'#AB72A6', 
    					'Stores Purchases':'#F3715B', 
    					'Relocation Payments':'#00B039',
    					'Bond-Interest':'#FFDB4E'};
    }
    if (categories){
    	var catColors = [];
    	Object.each(categories, function(category){
    		catColors.push(colorMap[category]);
    	});
    	return catColors;
    }

    //var colors = ['#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099', '#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099', '#00CCFF', '#FF9900', '#99CC00', '#FF33FF', '#FFFF66', '#FF3333', '#3333FF', '#996633', '#339933', '#FF6600', '#FF0099','#CB0077', '#A2EF00', '#699B00', '#84004D', '#00A580', '#35D2AF', '#FF6200', '#FF8940', '#1046AA', '#4577D4', '#FFA500', '#FFBC40', '#640BAC', '#9240D5', '#FFF500', '#FFF840', '#F10026', '#F83E5B', '#3BDA00', '#6BED3B', '#FF6400', '#FF8B40', '#00A483', '#34D1B3', '#FF8700', '#FFA540', '#024A69', '#0773A1', '#FFC200', '#FFDD73', '#0C0847', '#7672D9', '#FFE800', '#FFF273', '#330571', '#996AD6', '#E2FA00', '#EFFD72', '#58026E', '#BE63D4', '#92EC00', '#C2F56E', '#890043', '#E969A8', '#009A9A', '#5CCCCC', '#A64B00', '#FFB273', '#0B5FA5', '#66A1D2', '#A66000', '#FFAE40', '#1435AE', '#061D71', '#FFD473', '#BF9430', '#530EAE', '#330571', '#FFEE40', '#BFB230'];
	var colors = ['#5578B4', '#AB72A6', '#F3715B', '#00B039', '#F79750', '#A9CEEC', '#CACEC3', '#AAA7CA', '#66C190', '#DF8B96', '#68B3E2', '#FFDB4E', '#96D4C3', '#A7A9AC', '#BBBA59', '#E7A7CB', '#A3643B','#3AA091', '#E8A43B', '#C89E7A'];
    return colors.slice(0, num);
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
