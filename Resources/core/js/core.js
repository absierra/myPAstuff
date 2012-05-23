//global js here
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

var initGraphs = function(){
    window.graphs.fund = new BudgetGraph('fund_graph', {
        type : 'fund',
        metric : 'expenses'
    });
    window.graphs.department = new BudgetGraph('department_graph', {
        type : 'departments',
        target : 'department',
        metric : 'expenses'
    });
    window.graphs.expenditures = new BudgetGraph('expenditure_graph', {
        type : 'categories',
        target : 'category',
        metric : 'expenses'
    });
    window.graphs.revenue = new BudgetGraph('revenue_graph', {
        type : 'categories',
        target : 'category',
        metric : 'revenue'
    });
};

function panelData(){
    var keys = new Keyboard({
        defaultEventType: 'keyup',
        events: {
            'esc': function(){    
                window.selected = {};
                window.panelSelection = {};
                window.graphs = {};          
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
                document.getElements('.graph svg').destroy();
                initGraphs();
                graphLegend();
                graphTabsFilter();
            }
         }
    });
	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', onSuccess: function(data){
        this.dataRequest = data.data;
        window.dataRequest = this.dataRequest;
	    this.populatePanel('funds');
		this.populatePanel('departments');
		var target = document.getElement('.EnterpriseFunds span');
        if(target) target.fireEvent.delay(50, target, ['click']);
	}.bind(this)}).get();
    
	var panelFilter = function(data) {
        
        document.getElements('#fund li span').each(function(listItem){
            if (data.funds.contains(listItem.retrieve('itemIdentifier'))) listItem.removeClass('disabled');
            else listItem.addClass('disabled');
		});
        document.getElements('#department li span').each(function(listItem){
            if (data.departments.contains(listItem.retrieve('itemIdentifier'))) listItem.removeClass('disabled');
            else listItem.addClass('disabled');
		});
	}
	
	var selectGraph = function(type, hexColors, legals){
	    if(legals){
	        //todo: enable/disable graphs
	    }
        //return;
	    switch(type){
	        case 'fund':
                if(hexColors) window.graphs.fund.setColors(hexColors);
                window.currentGraph = window.graphs.fund;
                graphTabsFilter(type);
	            window.graphTabs.showSlide(0);
	            break;
	        case 'department':
                if(hexColors) window.graphs.department.setColors(hexColors);
                window.currentGraph = window.graphs.department;
                graphTabsFilter(type);
	            window.graphTabs.showSlide(1);
	            break;
	        case 'expenditure':
                graphTabsFilter(type);
	            if(hexColors) window.graphs.department.setColors(hexColors);
                window.currentGraph = window.graphs.expenditure;
	            window.graphTabs.showSlide(2);
	            break;
	        case 'revenue':
	            graphTabsFilter(type);
	            if(hexColors) window.graphs.department.setColors(hexColors);
                window.currentGraph = window.graphs.revenue;
	            window.graphTabs.showSlide(3);
	            break;
	        case 'fee_revenue':
                graphTabsFilter(type);
	            window.graphTabs.showSlide(4);
	            break;
	        case 'exp_vs_fee_rev':
                graphTabsFilter(type);
	            window.graphTabs.showSlide(5);
	            break;
	    }
	    (function(){
	    Object.each(window.graphs, function(graph, graphType){
	        if(graph != graphType) graph.fetch(window.selected, window.lastSelectedColumn);
	    });
	    }).delay(200);
	}
    var graphLegend = function(data) {
        var legendElement = document.getElement('#legend');
        legendElement.getElements('li').destroy();
        
        if (data) {
            data.each(function(element, lcv) {
                var legendItem = element.clone().removeClass('colorkey');
                var legendLi = new Element('li');
                legendElement.appendChild(legendLi);
                legendLi.appendChild(legendItem);
            });
            legendElement.reveal();
        } else {
            legendElement.dissolve();
        }
    }
    var graphTabsFilter = function(selectedTab) {
        var graphTabsSelect = new Array();
        if (window.panelSelection.fund && window.panelSelection.department){
            if (window.panelSelection.fund == 1 && window.panelSelection.department == 1) {
                graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab']; // [Fund 1][Dept 1]
            } else if (window.panelSelection.fund == 1 && window.panelSelection.department == 2) {
                graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab']; // [Fund 1][Dept 2]
            } else if (window.panelSelection.fund == 2 && window.panelSelection.department == 1) {
                graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab']; // [Fund 2][Dept 1]
            } else if (window.panelSelection.fund == 2 && window.panelSelection.department == 2) {
                graphTabsSelect = ['fund_department_tab', 'expenditure_tab', 'fee_revenue_tab'];  // [Fund 2][Dept 2]
            }
        } else if (window.panelSelection.fund){
            switch(window.panelSelection.fund){
                case 1: 
                    graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab']; // [Fund 1][Dept 0]
                break;
                case 2:
                    graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab']; // [Fund 2][Dept 0]
                break;
            }
        } else if (window.panelSelection.department){
            switch(window.panelSelection.department){
                case 1:
                    graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab', 'exp_vs_fee_rev']; // [Fund 0][Dept 1]
                break;
                case 2:
                    graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab', 'exp_vs_fee_rev']; // [Fund 0][Dept 2]
                break;
            }
        } else {
            graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab']; // [Fund 0][Dept 0]
        }
        var tabsContainer = document.getElement('#tabs');
        var tabsLi = tabsContainer.getElements('#tabs li');
        tabsLi.removeClass('display').removeClass('roundedLeft').removeClass('roundedRight');
        var totalTabs = graphTabsSelect.length;
        graphTabsSelect.each(function(selectedTabElement, tabKey){
            var tabElement = tabsContainer.getElement('.'+selectedTabElement);
            if (tabElement) {
                tabElement.addEvent('click', function(event){
                    switch(selectedTabElement){
                        case 'fund_tab':
                            window.currentGraph = window.graphs.fund;
                            break;
                        case 'department_tab':
                            window.currentGraph = window.graphs.department;
                            break;
                        case 'expenditure_tab':
                            window.currentGraph = window.graphs.expenditure;
                            break;
                        case 'revenue_tab':
                            window.currentGraph = window.graphs.revenue;
                            break;
                        case 'fee_revenue_tab':
                            window.currentGraph = window.graphs.fee_revenue;
                            break;
                        case 'exp_vs_fee_rev':
                            window.currentGraph = window.graphs.exp_vs_fee_rev;
                            break;
                    }
                });
                tabElement.addClass('display');
                if (tabKey == 0) tabElement.addClass('roundedLeft');
                if (tabKey+1 == totalTabs) tabElement.addClass('roundedRight');
            }
        });
    }
	var selectionRequest = new Request.JSON({url : '/data/categorization_dependencies', onSuccess: function(payload){
        var dataSelect = payload.data;
        panelFilter(payload.data);
        // remove color key from all items
        document.getElements('span.colorkey').removeClass('colorkey');
        // add color key to all active items in the selected column
        var column = document.id(window.lastSelectedColumn);
        if(column){
            var columnNotDisabled = column.getElements('ul li span:not(.disabled)');
            columnNotDisabled.addClass('colorkey');
            graphLegend(columnNotDisabled);
        }
        var hexColors = hueShiftedColorSet(columnNotDisabled.length, 'hex').shuffle();
        columnNotDisabled.each(function(item, lcv){
            PseudoDOM.before(item, {
                'background-color' : hexColors[lcv]
            })
        });
        var legendElements = document.getElements('#legend li span');
        legendElements.each(function(item, lcv){
            PseudoDOM.before(item, {
                'background-color' : hexColors[lcv]
            })
        });
        switch(window.lastSelectedColumn){
            case 'fund':
                
                selectGraph('fund', hexColors);
                break;
            case 'department':
                
                selectGraph('department', hexColors);
                break;
        }

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
                //if (!sublistCheck) graphTabsFilter(index, 1); else graphTabsFilter(index, 2);
                sublist = this.getParent('li ul.sublist');
                sublistHeight = sublist.getScrollSize();
                sublist.morph({height:sublistHeight.y});
                selectionRequest.get(window.selected);
                if(window.graphs[index]) window.graphs[index].fetch(window.selected, index);
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
            /*var name = (parts.length == 1)?parts[0]:parts[1];
			var panelLi = new Element('li', { class: ''+name.replace(/ /g, '')+'' });
            var panelSpan = new Element('span', { html: name });
            panelSpan.store('itemIdentifier', element);
            panelSpan.addEvent('click', panelSpanClickFunction);			
            panelLi.appendChild(panelSpan);
			if(parts.length == 2){ //2nd level
			    var ul = panelId.getElement('.sublist.'+parts[0]);
			    if(!ul){
			        ul = new Element('ul', {
			            class: 'sublist '+parts[0]
			        });
			        panelId.appendChild(ul);
			    }
			    ul.appendChild(panelLi);
			}else{ //top level
			    panelId.appendChild(panelLi);
			}*/
		}.bind(this));
	};
}

document.addEvent('domready', function() { 
    window.graphs = {};
    /*window.graphs.fund = new BudgetGraph('fund_graph', {
        type : 'fund'
    });
    window.graphs.department = new BudgetGraph('department_graph', {
        type : 'department'
    });*/
    initGraphs();
    new panelData();
    window.graphTabs = new MGFX.Tabs('#tabs .tab', '#graph_types .graph');
    document.id('standard_graph').addEvent('click', function(event){
        //console.log(event);
        this.getSiblings().removeClass('active');
        this.addClass('active');
        window.currentGraph.options.stacked=false;
        window.currentGraph.options.percent=false;
        window.currentGraph.options.pie=false;
/*
        window.currentGraph.setOptions({
            stacked: false,
            percent: false,
            pie: false
        });
*/
        window.currentGraph.display();
    });
    document.id('stacked_graph').addEvent('click', function(event){
        this.getSiblings().removeClass('active');
        this.addClass('active');
        window.currentGraph.options.stacked=true;
        window.currentGraph.options.percent=false;
        window.currentGraph.options.pie=false;
        window.currentGraph.display();
    });
    document.id('percentage_graph').addEvent('click', function(event){
        this.getSiblings().removeClass('active');
        this.addClass('active');
        window.currentGraph.options.stacked=true;
        window.currentGraph.options.percent=true;
        window.currentGraph.options.pie=false;
        window.currentGraph.display();
    });
/*
    document.id('pie_chart').addEvent('click', function(event){
        this.getSiblings().removeClass('active');
        this.addClass('active');
        window.currentGraph.setOptions({
            pie: true
        });
        window.currentGraph.display();
    });
*/
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
});
