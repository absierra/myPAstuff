//global js here


var graphs_initialized = false;
var refreshGUI = function(includeData){
    DelphiGraphTabs.filter();
    window.currentGraph.setLegend();
    if( includeData || (!graphs_initialized) ){
        graphs_initialized = true;
        (function(){
            Object.each(window.graphs, function(graph, graphType){
                if(graph != window.currentGraph) graph.fetch(window.selected, window.lastSelectedColumn, function(){});
            });
        })(); //don't let offscreen graphs choke the onscreen one
	}
}

var initGraphs = function(){
    window.graphs.fund = new BudgetGraph('fund_graph', {
        type : 'fund',
        metric : 'expenses',
        target : 'funds',
        column : 'fund',
        id : 'fund',
        select : function(){
            (this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            window.graphTabs.showSlide(0);
        }
    });
    window.graphs.department = new BudgetGraph('department_graph', {
        type : 'departments',
        target : 'department',
        metric : 'expenses',
        column : 'department',
        id : 'department',
        select : function(){
            (this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            window.graphTabs.showSlide(1);
        }
    });
    window.graphs.expenditures = new BudgetGraph('expenditure_graph', {
        type : 'categories',
        target : 'category',
        metric : 'expenses',
        id : 'expenses',
        select : function(){
            (this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            window.graphTabs.showSlide(2);
        }
    });
    window.graphs.revenue = new BudgetGraph('revenue_graph', {
        type : 'categories',
        target : 'category',
        metric : 'revenue',
        id : 'revenue',
        select : function(){
            (this.options.mode == 'pie') ? yearSlider('show') : yearSlider('hide');
            window.graphTabs.showSlide(3);
            
        }
    });
};


var initialized = false;
function panelData(){
	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', onSuccess: function(data){
        this.dataRequest = data.data;
        window.dataRequest = this.dataRequest;
	    this.populatePanel('funds');
		this.populatePanel('departments');
		if(!initialized){
            var target = document.getElement('.EnterpriseFunds span');
            if(target) target.fireEvent.delay(50, target, ['click']);
            initialized = true;
        }
	}.bind(this)}).get();
    
	var panelFilter = function(data){
        document.getElements('#fund li span').each(function(listItem){
            if (data.funds.contains(listItem.retrieve('itemIdentifier'))) listItem.removeClass('disabled');
            else listItem.addClass('disabled');
		});
        document.getElements('#department li span').each(function(listItem){
            if (data.departments.contains(listItem.retrieve('itemIdentifier'))) listItem.removeClass('disabled');
            else listItem.addClass('disabled');
		});
	}

	var selectionRequest = new Request.JSON({url : '/data/categorization_dependencies', onSuccess: function(payload){
        var dataSelect = payload.data;
        panelFilter(payload.data);
	}.bind(this)});
	
    window.selected = {};
    window.panelSelection = {};
	this.populatePanel = function(panel) {
		this.dataRequest[panel].each(function(element) {
            var parts = element.split(":");
            var index;
			switch (panel){
				case 'funds' : index = 'fund', selectedPanel = 'funds'; break;
				case 'departments' : index = 'department', selectedPanel = 'funds'; break;
			}
			var panelId = document.id(index);
            
			var panelSpanClickFunction = function(event) {
                if (panelId.hasClass('panelSelected')) window.selected = {}, window.panelSelection={};
                if (this.hasClass('disabled')) { 
                    document.getElements('.selected').removeClass('selected');
                    window.selected = {};
                    window.panelSelection = {};
                } else {
                    panelId.getElements('.selected').removeClass('selected');
                }
                window.selected[index] = panelSpan.retrieve('itemIdentifier');
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
                if(window.graphs[index]) window.graphs[index].fetch(window.selected, index, function(d){
                    BudgetGraph.select(index);
                    //console.log('click');
                    refreshGUI(true);
                });
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
                panelSpan.store('itemIdentifier', element);
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
                panelSpan.store('itemIdentifier', element);
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
		}.bind(this));
	};
}

var yearSlider = function(display){
    var yearsContainer = document.id('yearsContainer');
    if (display == 'hide') { yearsContainer.hide(); return; }
    var graphYears = document.id('yearsText');
    var getYears = BudgetGraph.LastSelectionYearsData;
    var yearsSliderBar = document.id('yearsSlider');
    graphYears.getElements('li').destroy();
    getYears.each(function(year){
        var yearElement = new Element('li', {
            html : year
        });
        graphYears.adopt(yearElement);
    });
    yearsSliderBar.setAttribute('upper', getYears.clone().pop());
    yearsSliderBar.setAttribute('lower', getYears.clone().shift());
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

var changeCurrentGraphType = function(type, el){
    el.getSiblings().removeClass('active');
    el.addClass('active');
    Object.each(window.graphs, function(graph){
        graph.options.mode = type;
        graph.display();
    });
}

document.addEvent('domready', function() { 
    window.graphs = {};
    initGraphs();
    new panelData();
    DelphiGraphTabs.initialize({
        select : function(event){
            BudgetGraph.select(event.target.innerHTML.toLowerCase());
            refreshGUI();
        }
    });
    document.id('standard_graph').addEvent('click', function(event){
        changeCurrentGraphType('line', this);
        yearSlider('hide');
    });
    document.id('stacked_graph').addEvent('click', function(event){
        changeCurrentGraphType('stacked-line', this);
        yearSlider('hide');
    });
    document.id('percentage_graph').addEvent('click', function(event){
        changeCurrentGraphType('percentage-line', this);
        yearSlider('hide');
    });
    document.id('pie_chart').addEvent('click', function(event){
        changeCurrentGraphType('pie', this);
        yearSlider('show');
    });
    new Fx.Reveal(('#legend'), {duration: 500, mode: 'horizontal'});  
    var descriptionTooltip = document.getElements('.descriptionTooltip');
        descriptionTooltip.addEvents({
        mouseover: function(){
            this.getSiblings('.panelDescription').reveal();
        },
        mouseout: function(){
            this.getSiblings('.panelDescription').dissolve();
        }
    });
    new Fx.Reveal(('.panelDescription'), {duration: 500, mode: 'horizontal'});
    var keys = new Keyboard({
        defaultEventType: 'keyup',
        events: {
            'esc': function(){    
                window.selected = {};
                window.panelSelection = {}; 
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
                BudgetGraph.deselect();
            }
         }
    });
});