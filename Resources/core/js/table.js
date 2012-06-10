var BudgetTable = new Class({
    Implements: Options,
    options: {
        size: {
            width: 100,
            height: 100
        },
        type : 'none',
        dataset : 'test',
        target : false,
        name : 'Debt Service Funds',
        //we really need to switch graph types to 1 option, rather than a bunch of weirdly intersecting booleans
        metric : 'revenue'
    },
    initialize : function(element, options){
        this.element = element;
        this.setOptions(options);
        
        if(!this.options.requestor) this.options.requestor = new Request.JSON({
            url: '/data/graph',
            onSuccess: function(payload){
                this.data = payload.data;
                this.display();
                this.fetching = false;
                if(this.fetchCallback){
                    this.fetchCallback(this.data);
                    delete this.fetchCallback;
                }
            }.bind(this)
        });
        if(this.options.id) BudgetGraph.graphs[this.options.id] = this;
        if(this.options.select) this.options.select = this.options.select.bind(this)
    },
    fetch : function(data, type, callback){
        if(typeOf(type) == 'function'){
            callback = type;
            delete type;
        }
        if(type) this.options.type = type;
        var requestData = Object.clone(data);
        BudgetGraph.lastSelection = requestData;
        BudgetGraph.lastSelectionType = this.options.type;
        requestData.type = this.options.type;
        if(this.options.target) requestData.target = this.options.target;
        requestData.dataset = this.options.dataset;
        this.fetching = true;
        this.options.requestor.get(requestData);
        if(callback) this.fetchCallback = callback;
    },
    setColors : function(colors) {
    },
    select : function(colors) {
        window.selectedGraph = this;
    },
    getKeyElements : function(){
		return [];
    },
    getLegendItems : function(){
        return null;
    },
    setKeys : function(){
        
    },
    setLegend : function(){
       
    },
    display : function(metric){
		
    	var table = new ScrollableTable('employee_type_table');
		var tbody = $(table).getElement('tbody');
		var tr = tbody.getFirst();
		
		tbody.empty();
				
		Object.each(this.data, function(data, name){
			var cl = tr.clone();
			cols = cl.getChildren();
			cols[0].set('html', name);
			cols[1].set('html', this.data[name]['2009']['fte']);
			cols[2].set('html', this.data[name]['2010']['fte']);
			cols[3].set('html', this.data[name]['2011']['fte']);
			cols[4].set('html', this.data[name]['2012']['fte']);
			cols[5].set('html', this.data[name]['2013']['fte']);
			cols[6].set('html', this.data[name]['2013']['salary']);
			cl.inject(tbody);
		}.bind(this));
				
		table.update();
	}
})
BudgetGraph.LastSelectionYearsData = {};
BudgetGraph.lastSelection = {};
BudgetGraph.graphs = {};

BudgetGraph.select = function(name){
    if(BudgetGraph.graphs[name]){
        window.currentGraph = BudgetGraph.graphs[name];
        BudgetGraph.graphs[name].select();
        if(BudgetGraph.graphs[name].options.select) BudgetGraph.graphs[name].options.select(name);
    }
};
BudgetGraph.deselect = function(){
    delete window.currentGraph;
    BudgetGraph.clearLegend();
};
