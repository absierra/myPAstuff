//global js here
var graphs_initialized = false;
var financial_state = true;
var loadTimer = 0;
var refreshGUI = function(includeData){
    BudgetGraph.timer(1);
    DelphiGraphTabs.filter();
    window.currentGraph.setKeys();
    window.currentGraph.setLegend();
    if( includeData || (!graphs_initialized) ){
        graphs_initialized = true;
        cascade = 200;
        (function(){
            Object.each(window.graphs, function(graph, graphType){

                if(graph != window.currentGraph) graph.fetch.delay(cascade, graph, [window.selected, window.lastSelectedColumn, function(){ }]);
                //cascade += 800;
            });
        })(); //don't let offscreen graphs choke the onscreen one
        
	}
    BudgetGraph.timer(-1);
}

var initGraphs = function(){
    window.graphs.fund = new BudgetGraph('fund_graph', {
    	dataset : 'financial',
        type : 'fund',
        metric : 'expenses',
        target : 'funds',
        column : 'fund',
        id : 'fund',
        select : function(){
            //(this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            //this.setKeys();
            //this.setLegend();
            window.graphTabs.showSlide(0);
        }
    });
    window.graphs.department = new BudgetGraph('department_graph', {
    	dataset : 'financial',
        type : 'departments',
        target : 'department',
        metric : 'expenses',
        column : 'department',
        id : 'department',
        select : function(){
            //(this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            //this.setKeys();
            //this.setLegend();
            window.graphTabs.showSlide(1);
        }
    });
    window.graphs.expenditures = new BudgetGraph('expenditure_graph', {
    	dataset : 'financial',
        type : 'categories',
        target : 'category',
        metric : 'expenses',
        id : 'expenses',
        select : function(){
            //(this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            //this.setKeys();
            //this.setLegend();
            window.graphTabs.showSlide(2);
        }
    });
    window.graphs.expenses_vs_fee_revenue = new BudgetGraph('exp_vs_fee_rev_graph', {
    	dataset : 'financial',
        type : 'rev_exp',
        target : 'revenue_expense',
        metric : 'revenue_expense',
        id : 'revenue_expenses',
        select : function(){
            //(this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            //this.setKeys();
            //this.setLegend();
            window.graphTabs.showSlide(3);
        }
    });
    window.graphs.fee_revenue = new BudgetGraph('fee_revenue_graph', {
    	dataset : 'financial',
        type : 'categories',
        target : 'category',
        metric : 'fee_revenue',
        id : 'fee_revenue',
        select : function(){
            //(this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            //this.setKeys();
            //this.setLegend();
            window.graphTabs.showSlide(4);
            
        }
    });
    window.graphs.revenue = new BudgetGraph('revenue_graph', {
    	dataset : 'financial',
        type : 'categories',
        target : 'category',
        metric : 'revenue',
        id : 'revenue',
        select : function(){
            //(this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            //this.setKeys();
            //this.setLegend();
            window.graphTabs.showSlide(5);
            
        }
    });
	window.graphs.employee_department = new BudgetGraph('employee_department_graph', {
		dataset : 'employee',
        type : 'departments',
        target : 'department',
        column : 'department',
        id : 'employee_department',
        select : function(){
            //(this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            //this.setKeys();
            //this.setLegend();
            window.graphTabs.showSlide(6);
            
        }
    });
    window.graphs.employee_type = new BudgetTable('employee_type_graph', {
		dataset : 'employee',
        type : 'titles',
        target : 'title',
        id : 'employee_type',
        select : function(){
            //(this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            //this.setKeys();
            //this.setLegend();
            window.graphTabs.showSlide(7);
            
        }
    });
};

var loadDefaultGraph = function(type){
    if (!type) type = 'fund';
    window.selected = {}; // start: reset
    window.panelSelection = {};
    var financialBreakdown = document.id('financial_breakdown');
    var employeeBreakdown = document.id('employee_breakdown');
    financialBreakdown.show();
    employeeBreakdown.hide();
    document.getElements('.selected').removeClass('selected');
    document.getElements('.colorkey').removeClass('colorkey');
    document.getElements('.disabled').removeClass('disabled');
    document.getElements('.expanded').removeClass('expanded');
    var sublist = document.getElements('li ul.sublist');
    if ((sublist) && (sublist.hasClass('expanded'))) {
        sublist.set('morph', { unit:'px' });
        sublist.morph({height:0});
        sublist.removeClass('expanded');
    }
    document.id('graph_title').set('text', type);
    BudgetGraph.deselect(); // end: reset
    if(window.graphs[type]) window.graphs[type].fetch({}, type, function(d){
        BudgetGraph.select(type);
        refreshGUI();
    });
}

var initialized = false;
function panelData(){
	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', 
    onRequest: function(){
        BudgetGraph.timer(1);
    },
    onComplete: function(){
        BudgetGraph.timer(-1);
    },
    onSuccess: function(data){
        this.dataRequest = data.data;
        window.dataRequest = this.dataRequest;
	    this.populatePanel('funds');
		this.populatePanel('departments');
		if(!initialized){
            loadDefaultGraph('fund');
            initialized = true;
        }
	}.bind(this)}).get();
    
	var panelFilter = function(data){
        document.getElements('#fund li span').each(function(listItem){
            if (data.funds.contains(listItem.retrieve('item_identifier'))) listItem.removeClass('disabled');
            else listItem.addClass('disabled');
		});
        document.getElements('#department li span').each(function(listItem){
            if (data.departments.contains(listItem.retrieve('item_identifier'))) listItem.removeClass('disabled');
            else listItem.addClass('disabled');
		});
	}

	var selectionRequest = new Request.JSON({url : '/data/categorization_dependencies', 
    onRequest: function(){
        BudgetGraph.timer(1);
    },
    onComplete: function(){
        BudgetGraph.timer(-1);
    },
    onSuccess: function(payload){
        var dataSelect = payload.data;
        panelFilter(payload.data);
        refreshGUI(true);
	}.bind(this)});
	
    window.selected = {};
    window.panelSelection = {};
	this.populatePanel = function(panel) {
		this.dataRequest[panel].each(function(element) {
            BudgetGraph.timer(1);
            var parts = element.split(":");
            var index;
			switch (panel){
				case 'funds' : index = 'fund', selectedPanel = 'funds'; break;
				case 'departments' : index = 'department', selectedPanel = 'funds'; break;
			}
			var panelId = document.id(index);
            
			var panelSpanClickFunction = function(event) {
				tableFormat(false, false);
                var titleText = this.get('text');
                if (panelId.hasClass('panelSelected')) window.selected = {}, window.panelSelection={};
                if (this.hasClass('disabled')) { 
                    document.getElements('.selected').removeClass('selected');
                    window.selected = {};
                    window.panelSelection = {};
                }      

                document.getElements('.expanded').removeClass('expanded');
                document.getElements('li ul.sublist').morph({height:0});
           
                if (this.hasClass('selected')) {
                    this.removeClass('selected');
                    this.getElements('a.expanded').removeClass('expanded');
                    
                    sublist = this.getSiblings('ul.sublist');
                    sublistHeight = sublist.getScrollSize();
                    sublist.morph({height:sublistHeight.y});
                    
                    var selectedItems = document.getElements('ul li span.selected');
                    if (selectedItems.length > 0) {

                        window.selected = {};
                        window.panelSelection={};
                                        
                        selectedIndex = selectedItems.getParent().getParent().get('id');
                        prevSelectedItem = selectedItems.get('text');
                        document.id('graph_title').set('text', prevSelectedItem);

                        document.getElements('.colorkey').removeClass('colorkey');
                        document.getElements('.expanded').removeClass('expanded');
                        document.getElements('.selected').removeClass('selected');
                       
                        selectedItems.addClass('selected');
                        selectedItems.addClass('colorkey');
                        
                        lastIndex = selectedIndex[0];
                        window.selected[lastIndex] = prevSelectedItem[0];
                        window.lastSelectedColumn = selectedIndex[0];
                        window.lastSelectedItem = prevSelectedItem[0];
                        
                        sublist = selectedItems[0].getParent('li ul.sublist');
                        sublistHeight = sublist.getScrollSize();
                        sublist.morph({height:sublistHeight.y});

                        //return; // being used to prevent the page from locking up after deselection/reselection of an item.

                        if (!sublistCheck) window.panelSelection[lastIndex] = 1; else window.panelSelection[lastIndex] = 2;
                        selectionRequest.get(window.selected);
                        if(window.graphs[lastIndex]) window.graphs[lastIndex].fetch({}, lastIndex, function(d){
                            BudgetGraph.select(lastIndex);
                            //refreshGUI();
                        });
                    } else {
                        loadDefaultGraph(panelId.get('id'));
                    }
                } else {
                    if (!this.hasClass('disabled')) { 
                        panelId.getElements('.selected').removeClass('selected');
                    }
                    
                    window.selected[index] = panelSpan.retrieve('item_identifier');
                    window.lastSelectedPanel = selectedPanel;
                    window.lastSelectedColumn = index;
                    window.lastSelectedItem = element;
                    document.getElements('.colorkey').removeClass('colorkey');
                    this.addClass('selected');
                    this.getElements('a').addClass('expanded');
                    sublistCheck = this.getParent('ul.sublist');
                    if (!sublistCheck) window.panelSelection[index] = 1; else window.panelSelection[index] = 2;
                    sublist = this.getParent('li ul.sublist');
                    sublistHeight = sublist.getScrollSize();
                    sublist.morph({height:sublistHeight.y});
                    selectionRequest.get(window.selected);
                    document.id('graph_title').set('text', titleText);
                    if(window.graphs[index]) window.graphs[index].fetch(window.selected, index, function(d){
                        BudgetGraph.select(index);
                        //refreshGUI(true);
                    });
                }
			};
            var panelArrowClickFunction = function(event) {
                var expanded = this.getParent('li span a')
                var sublist = this.getParent('li ul.sublist');
                    if (!expanded.hasClass('expanded')) { // expand item
                        sublistHeight = sublist.getScrollSize();
                        sublist.morph({height:sublistHeight.y});
                        expanded.addClass('expanded');
                    } else { // collapse item
                        sublist.morph({height:0});
                        expanded.removeClass('expanded');
                    }
                event.stopPropagation();
            };

            var name = (parts.length == 1)?parts[0]:parts[1];
            //notice there are the same lines in both these branches: fix me
            if (parts.length == 1) { //top level
       			var panelLi = new Element('li', { class: parts[0].replace(/ /g, '') });
                var panelSpan = new Element('span', { html: name });
                var panelArrow = new Element('a');
                panelSpan.store('item_identifier', element);
                panelSpan.addEvent('click', panelSpanClickFunction);
                panelArrow.addEvent('click', panelArrowClickFunction);
                panelSpan.appendChild(panelArrow);
                panelLi.appendChild(panelSpan);
                panelId.appendChild(panelLi);
            } else { // 2nd level
                var panelSet = panelId.getElement('li.'+parts[0].replace(/ /g, ''));
                var panelUl = panelId.getElement('li.'+parts[0].replace(/ /g, '')+' ul');
                var panelLi = new Element('li', { class: parts[1].replace(/ /g, '') });
                var panelSpan = new Element('span', { html: name });
                panelSpan.store('item_identifier', element);
                panelSpan.addEvent('click', panelSpanClickFunction);		
                 if(!panelUl){
			        panelUl = new Element('ul', {
			            class: 'sublist'
			        });
			        panelSet.appendChild(panelUl);
			    }
                panelLi.appendChild(panelSpan);
                panelUl.appendChild(panelLi);
                panelSet.appendChild(panelUl);
            }
            BudgetGraph.timer(-1);
		}.bind(this));
	};
}

/*
var yearSlider = function(display){
    var yearsContainer = document.id('years_container');
    if (display == 'hide') { yearsContainer.hide(); return; }
    var graphYears = document.id('years_text');
    var years = BudgetGraph.LastSelectionYearsData;
    var yearsSliderBar = document.id('years_slider');
    graphYears.getElements('li').destroy(); 
    if(!years) years = ['2009', '2010', '2011', '2012', '2013'];
    years.each(function(year){
        var yearElement = new Element('li', {
            html : year
        });
        graphYears.adopt(yearElement);
    }); 
    yearsSliderBar.setAttribute('upper', years.clone().pop());
    yearsSliderBar.setAttribute('lower', years.clone().shift());
    yearsContainer.show();
}

var yearSliderUpdate = function(element, value){
    var upperLimit = element.getAttribute('upper');
    var lowerLimit = element.getAttribute('lower');
    var increment = element.getAttribute('step');
    var totalYears = upperLimit - lowerLimit;
    for (var i = 0, j = 0; i <= totalYears; i++, j = j + increment.toInt()){
        if (j == value) {
            var year = lowerLimit.toInt() + i;
            window.currentGraph.options.year = year;
            changeCurrentGraphType('pie', element);
        }        
    }    
}
*/

var tableFormat = function(yes, employee){
	if(yes){
		document.id('graph_types').hide();
		document.id('graph_breakdown').hide();
		document.id('legend').hide();
		document.id('graph_fiscal_year').hide();
	}
	else{
		if(employee){
			document.id('graph_breakdown').set('text', 'Number of Employees');
		}else{
			document.id('graph_breakdown').set('text', 'Dollars per Year');
		}
		document.id('graph_types').show();
		document.id('graph_breakdown').show();
		document.id('legend').show();
		document.id('graph_fiscal_year').show();
	}
}
		

var changeCurrentGraphType = function(type, el){
    el.getSiblings().removeClass('active');
    el.addClass('active');
    Object.each(window.graphs, function(graph){
        graph.options.mode = type;
        graph.display();
    });
}

var rightPanelSizing = function(){
	var leftColumnWidth = 600;
	var verticalElementsHeight = 210;
	var graph_container_min_width = 775;
	var graph_container_min_height = 500;
	var graph_container_width = 0;
	var graph_container_height = 0;
	var graph_container_ratio = graph_container_min_width / graph_container_min_height;

	// if the window size is big enough to accomodate the graph being bigger than its minimum size
	if (window.getSize().x - leftColumnWidth > graph_container_min_width && window.getSize().y - verticalElementsHeight > graph_container_min_height)
	{
		// if, given our required aspect ratio, the horizontal is the limiting factor, fill the horizontal, and then set the vertical according to the ratio
		if ((window.getSize().x - leftColumnWidth) / (window.getSize().y - verticalElementsHeight) < graph_container_ratio)
		{
			graph_container_width = window.getSize().x - leftColumnWidth;
			graph_container_height = graph_container_width / graph_container_ratio;
			//console.log('horizontal was limiting: ' + graph_container_width + ' x ' + graph_container_height);
		}
		// else (i.e., the remaining vertical space is the limiting factor), fill the vertical, and then set the horizontal according to the ratio
		else
		{
			graph_container_height = window.getSize().y - verticalElementsHeight;
			graph_container_width = graph_container_height * graph_container_ratio;
			//console.log('vertical was limiting: ' + graph_container_width + ' x ' + graph_container_height);
		}
	}
	else
	{
		graph_container_width = graph_container_min_width;
		graph_container_height = graph_container_min_height;
	}
	
	document.id('graph_container').setStyle('width', graph_container_width + 'px');
	document.id('graph_container').setStyle('height', graph_container_height + 'px');
	
	document.id('graphs').setStyle('width', graph_container_width + 'px');
	document.id('graphs').setStyle('height', (graph_container_height - 180) + 'px');
		
	document.getElements('#graphs .graph svg').setStyle('width', graph_container_width + 'px');
	document.getElements('#graphs .graph svg').setStyle('height', (graph_container_height - 180) + 'px');
	
	
	
	//document.getElements('#graphs .graph').setStyle('border', '1px solid red');
	
	//window.currentGraph.options.height = 1234;
	//window.currentGraph.options.width = 1234;
	//console.log('window.currentGraph: ' + window.currentGraph);

}

window.incrementalResize = function(options, callback){
    if(typeOf(options) == 'number') options = {number:options};
    if(typeOf(options) == 'function') options = {isCallable:options};
    var sizes = window.getSize();
    if(!options.lastX) options.lastX = sizes.x;
    if(!options.lastY) options.lastY = sizes.y;
    if(options.number && !options.isCallable){
        options.isCallable = function(x, y){
            
            xDiff = Math.abs(options.lastX - x);
            yDiff = Math.abs(options.lastY - y);
            if(options.number <= xDiff || options.number <= yDiff){
                options.lastX = x;
                options.lastY = y;
                return true;
            }
            return false;
        }
    }
    window.addEvent('resize', function(event){
         var dim = window.getSize();
         if(options.isCallable(dim.x, dim.y)) callback();
    });
}
document.addEvent('domready', function() { 
    window.graphs = {};
    initGraphs();
    new panelData();
    DelphiGraphTabs.initialize({
        select : function(event){
            BudgetGraph.select(event.target.getAttribute('graph').toLowerCase());
            refreshGUI();
        }
    });
	document.id('emp_type').addEvent('click', function(event){
		//yearSlider('hide');
		tableFormat(true);
	});
	document.id('emp_dep').addEvent('click', function(event){
		tableFormat(false, true);
	});
	document.id('fin_fund').addEvent('click', function(event){
		tableFormat(false, false);
	});
	document.id('fin_dep').addEvent('click', function(event){
		tableFormat(false, false);
	});
	document.id('fin_exp').addEvent('click', function(event){
		tableFormat(false, false);
	});
	document.id('fin_rev').addEvent('click', function(event){
		tableFormat(false, false);
	});
	document.id('fin_feerev').addEvent('click', function(event){
		tableFormat(false, false);
	});
	document.id('fin_expfee').addEvent('click', function(event){
		tableFormat(false, false);
	});
    document.id('standard_graph').addEvent('click', function(event){
        changeCurrentGraphType('line', this);
        //yearSlider('hide');
        document.id('graph_breakdown').set('text', 'Dollars per Year');
        document.id('graph_fiscal_year').set('text', 'Fiscal Year');
    });
    document.id('stacked_graph').addEvent('click', function(event){
        changeCurrentGraphType('stacked-line', this);
        //yearSlider('hide');
        document.id('graph_breakdown').set('text', 'Dollars per Year');
        document.id('graph_fiscal_year').set('text', 'Fiscal Year');
    });
    document.id('percentage_graph').addEvent('click', function(event){
        changeCurrentGraphType('percentage-line', this);
        //yearSlider('hide');
        document.id('graph_breakdown').set('text', 'Percent of Budget');
        document.id('graph_fiscal_year').set('text', 'Fiscal Year');
    });
    document.id('pie_chart').addEvent('click', function(event){
        changeCurrentGraphType('pie', this);
        document.id('graph_fiscal_year').set('text', 'Fiscal Year 2013');
        //yearSlider('show');
        document.id('graph_breakdown').empty();
    });
    document.id('default_department').addEvent('click', function(event){
        loadDefaultGraph('department');
    });
    document.id('default_fund').addEvent('click', function(event){
        loadDefaultGraph('fund');
    });
    new Fx.Reveal(('#legend'), {duration: 500, mode: 'horizontal'});  
    var descriptionTooltip = document.getElements('.description_tooltip');
        descriptionTooltip.addEvents({
        mouseover: function(){
            this.getParent().getSiblings('.panel_description').reveal();
        },
        mouseout: function(){
            this.getParent().getSiblings('.panel_description').dissolve();
        }
    });
    new Fx.Reveal(('.panel_description'), {duration: 500, mode: 'horizontal'});
    var keys = new Keyboard({
        defaultEventType: 'keyup',
        events: {
            'esc': function(){
                loadDefaultGraph();
            }
         }
    });
	
	rightPanelSizing();
	
	var chainContainer = new Class({ Implements: Chain });
	
	window.incrementalResize(45, function(){
		rightPanelSizing();
		Object.each(window.graphs, function(graph){
					graph.display();
		});
	});
});
