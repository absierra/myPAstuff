

var BudgetGraph = new Class({
    Implements: Options,
    options: {
        color: '#fff',
        size: {
            width: 100,
            height: 100
        }
    },
    initialize : function(element, options){
        this.element = element;
        this.setOptions(options);
    }
})