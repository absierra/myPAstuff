//files with city switch: core.js, graph.js, graph-tabs.js, graph-utils.js, header.controller.php, graph.controller.php, index.panel.tpl


//global js here
var graphs_initialized = false;
var financial_state = true;
var in_negative_state = false;
var loadTimer = 0;
var first_load = true;
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
    //CITY SWITCH
    if(window.city == 'palo_alto' || window.city == 'saratoga'){
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
		if(window.city == 'palo_alto'){
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
		}
	}
};

var loadDefaultGraph = function(type){
    if (!type) type = 'fund';
    window.selected = {}; // start: reset
    window.panelSelection = {};
    var financialBreakdown = document.id('financial_breakdown');
    var employeeBreakdown = document.id('employee_breakdown');
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
    graphTitle = 'Citywide';
    document.id('graph_title').set('text', graphTitle);
    BudgetGraph.deselect(); // end: reset
    if(window.graphs[type]) window.graphs[type].fetch({}, type, function(d){
        BudgetGraph.select(type);
        refreshGUI(true);
    });
    
    /*if(first_load){
		console.log('this happened');
		window.graphTabs.showSlide(1);
		document.getElement('li.GeneralFunds span').fireEvent('click');
		first_load = false;
	}*/
}

var isSuper = function(name){
	//CITY SWITCH
	if(window.city == "palo_alto"){
		var supers = ['Enterprise Funds', 'General Funds', 'Internal Services Funds', 'Special Revenue Funds', 'Capital Funds', 'Debt Service Funds', 'Non-Departmental', 'Utilities', 'Public Works', 'Police', 'Planning', 'Library', 'Information Technology', 'Human Resources', 'Fire', 'Community Services', 'City Manager', 'City Council', 'City Clerk', 'City Auditor', 'FIR', 'City Attorney', 'Capital Fund', 'Administrative Services', 'Airport'];
	}
	else if(window.city == "salinas"){
		var supers = ['General Government','Assessment and Maintenance','Block Grants and Home Prgm','Debt Service','Enterprise Operations','Grants Trusts and Agencies','Internal Services','Redevelopment Agency','Police Department','Fire Department','Administration Department','City Attorney Department','City Council Department','Comm and Econ Development','Finance Department','Library and Comm Services','Non-Departmental','Public Works Department','Assess and Maint Districts','Enterprise Operations Dept','Internal Services Department'];
	}
	else if(window.city == 'lafayette'){
		var supers = ['Assessment District Funds','Capital Improvement Funds','Enterprise Funds','General Fund','Governmental Funds','Redevelopment Agency','Public Works','Administration','Parks & Recreation','Senior Services','Police','Commissions and Committees','Council & Commissions','Engineering','Planning','School Bus Program'];
	}
	else if(window.city == 'saratoga'){
		var supers = ['Debt Service Fund','General Fund','Internal Service Fund','Internal Service Funds','Special Revenue Fund','Special Revenue Funds','Trust Fund','Non Departmental','Administrative Services','City Manager','Community Development','Council and Commissions','Public Safety','Public Works','Recreation'];
	}
	return (supers.indexOf(name) != -1);
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
		}.bind(this)
	});
	
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
				if(!in_negative_state || index == 'fund' || this.hasClass('disabled')){
					document.id('stacked_graph').show();
					document.id('percentage_graph').show();
					document.id('pie_chart').show();
					document.id('standard_graph').show();
				}
				
				tableFormat(false, false);
                
                if (panelId.hasClass('panelSelected')) window.selected = {}, window.panelSelection={};
                if (this.hasClass('disabled')) { 
                    document.getElements('.selected').removeClass('selected');
                    window.selected = {};
                    window.panelSelection = {};
                    document.getElements('span:not(.selected)').each(function(disabledItem){
                        disabledItem.getElements('.expanded').removeClass('expanded');
                        disabledItem.getSiblings('ul.sublist').morph({height:0});
                    });
                }      
           
                if (this.hasClass('selected')) {
                    this.removeClass('selected');
                    panelId.getElements('a.expanded').removeClass('expanded');
                    if (this.getSiblings('ul.sublist')) this.getSiblings('ul.sublist').morph({height:0});
                    if (this.getParent('li ul.sublist')) this.getParent('li ul.sublist').morph({height:0});

                    var selectedItems = document.getElements('ul li span.selected');
                    if (selectedItems.length > 0) {
                    
                    	if(this.get('text') == 'Capital Funds' || this.get('text') == 'Capital Improvement Fund'){
							in_negative_state = false;
							document.id('stacked_graph').show();
							document.id('percentage_graph').show();
							document.id('pie_chart').show();
							document.id('standard_graph').show();
						}

                        window.selected = {};
                        window.panelSelection={};
                                                
                        selectedIndex = selectedItems.getParent().getParent().get('id')[0] != null ? selectedItems.getParent().getParent().get('id') : selectedItems.getParent().getParent().getParent().getParent().get('id');
                        
                                                
                        if(isSuper(selectedItems[0].get('text') || selectedItems[0].innerHTML)){
                        	prevSelectedItem = (selectedItems[0].get('text') || selectedItems[0].innerHTML);
                        }else{
                        	prevSelectedItem = selectedItems.getParent().getParent().getParent().getElements('span')[0][0].get('text')+':'+(selectedItems[0].get('text') || selectedItems[0].innerHTML);
                        }
						                        
                        document.id('graph_title').set('text', prevSelectedItem.indexOf(':')==-1?prevSelectedItem:prevSelectedItem.split(":")[1]);
                        document.getElements('.colorkey').removeClass('colorkey');
                        document.getElements('.selected').removeClass('selected');
                       
                        selectedItems.addClass('selected');
                        selectedItems.addClass('colorkey');

                        lastIndex = selectedIndex[0];

                        window.selected[lastIndex] = prevSelectedItem;
                        window.lastSelectedColumn = selectedIndex[0];
                        window.lastSelectedItem = prevSelectedItem[0];
                        
                        sublist = selectedItems[0].getParent('li ul.sublist');
                        sublistHeight = sublist.getScrollSize();
                        sublist.morph({height:sublistHeight.y});

                        if (!sublistCheck) window.panelSelection[lastIndex] = 1; else window.panelSelection[lastIndex] = 2;

                        selectionRequest.get(window.selected);

                        if(window.graphs[lastIndex]) window.graphs[lastIndex].fetch(window.selected, lastIndex, function(d){
                            BudgetGraph.select(lastIndex);
                            refreshGUI();
                        });
                    } else {
                        loadDefaultGraph();
                    }
                } else {
                	//CITY SWITCH
                	if(window.city == 'palo_alto'){
						if(this.get('text') == 'Capital Funds' || this.get('text') == 'Capital Improvement Fund'){
							document.id('stacked_graph').hide();
							document.id('percentage_graph').hide();
							document.id('pie_chart').hide();
							changeCurrentGraphType('line', document.id('standard_graph'));
							in_negative_state = true;
						}
					}
					
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
                    
                    var titleText; // Graph Title
                    if(window.selected.department) var windowDepartment = window.selected.department.indexOf(':')==-1?window.selected.department:window.selected.department.split(":")[1];
                    if(window.selected.fund) var windowFund = window.selected.fund.indexOf(':')==-1?window.selected.fund:window.selected.fund.split(':')[1];
                    
                    if (window.selected.fund && window.selected.department) {
                        titleText = windowDepartment+' within '+windowFund;
                    } else if (window.selected.fund) {
                        titleText = windowFund;
                    } else if (window.selected.department) {
                        titleText = windowDepartment;
                    } else {
                        titleText = this.get('text').capitalize();
                    }
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
                        expanded.addClass('expanded'); // moved up by 2 lines by Arthur 2012-06-14 to accomodate checking of "expanded" class inside of the function that deals with the overflow tooltip before the morphing (so as to fix fast mouse movement by user)
						sublistHeight = sublist.getScrollSize();
                        sublist.morph({height:sublistHeight.y});
                        
                    } else { // collapse item
                        expanded.removeClass('expanded'); // moved up by 1 line by Arthur 2012-06-14 to accomodate checking of "expanded" class inside of the function that deals with the overflow tooltip before the morphing (so as to fix fast mouse movement by user)
						sublist.morph({height:0});
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
				
				// to account for some weird mouse-moving-too-fast action, which doesn't ever register the mouse as being in the DIV element (so it can never leave, and thus clear the DIV element by triggering the mouseleve event), we'll just clear the DIV if the mouse hits any adjacent elements, which can conveniently be captured here
				/*
				panelSpan.addEvent('mouseenter', function(){
					var DIVelement = document.getElement('#secondLevelMouseOver');
					DIVelement.set('html', '');
					if (!DIVelement.hasClass('hidden'))
						DIVelement.addClass('hidden');
				});
				*/
            } else { // 2nd level
                var panelSet = panelId.getElement('li.'+parts[0].replace(/ /g, ''));
                var panelUl = panelId.getElement('li.'+parts[0].replace(/ /g, '')+' ul');
                var panelLi = new Element('li', { class: parts[1].replace(/ /g, '') });
                var panelSpan = new Element('span', { html: name });
                panelSpan.store('item_identifier', element);
                panelSpan.addEvent('click', panelSpanClickFunction); // if this is changed, make sure to change it below as well

				// grab the DIV that's supposed to hold the cloned span -- we're doing this in this scope (instead of the if condition below) because we need the next snippet of code
				/*
				var DIVelement = document.getElement('#secondLevelMouseOver');				
				panelSpan.addEvent('mouseenter', function(){
					// This is necessary to account for certain mouse-moving-too-fast bugs. we want to clear the DIV at the outset so as to avoid the "mouseleave" function never getting called. this lets us for sure start with a clean slate.
					DIVelement.set('html', '');
					if (!DIVelement.hasClass('hidden'))
						DIVelement.addClass('hidden');
				
					// this next if condition is necessary because we don't want this mouseover to fire if the parent group is collapsed. usually, this wouldn't even be a problem, but without this if condition, it's possible to get a bug where the DIV element activates as the group is collapsing (since it's an animation), and then if the mouse stays in the DIV element, it will persist after the group is collapsed
					if (panelUl.getParent('li span a').hasClass('expanded'))
					{
						
						// get the position of the existing LI element
						mouseoverDIVpos = this.getParent().getPosition();
						
						//create a copy of the current span into the div element we created for this
						var newSpan = this.clone().inject('secondLevelMouseOver', 'bottom');
						
						// shove the style of the previous span into the new span (this is to mimic the selected/deselected state)
						newSpan.setStyles(this.getStyles('background-color', 'color'));

						// make the DIV element visible and set its position on top of the current LI
						DIVelement.removeClass('hidden');
						DIVelement.setStyles({
							'display': 'block',
							'cursor': 'pointer',
							'top': mouseoverDIVpos.y,
							'left': mouseoverDIVpos.x
						});
						
						// this next if-else condition makes the width of the DIV element no less than the width of the LI/span that it's sitting on top of
						if (DIVelement.getSize().x < (this.getParent().getSize().x - 45 + 23))
						{
							DIVelement.setStyle('width', this.getParent().getSize().x - 45 + 30 + 'px');
						}
						else
						{
							DIVelement.setStyle('width', 'auto');
						}
						
						// for some reason, it seems like we sometimes need this. weird.
						DIVelement.setStyle('width', DIVelement.getSize().x - 30 + 'px');

						
						// add the click event that the span it's on top of had, and make it look like panelSpan had called it
						newSpan.addEvent('click', function(event){
							panelSpanClickFunction.call(panelSpan, event);
							
							// let's also hide the DIV element, since we don't need it after a click (especially since other groups may collapse)
							DIVelement.set('html', '');
							if (!DIVelement.hasClass('hidden'))
								DIVelement.addClass('hidden');
						});
						
						// clear the contents of the DIV and make it invisible when the mouse leaves *it* (not the original span)
						DIVelement.addEvent('mouseleave', function(){
							this.set('html', '');
							this.setStyles({
								'display': 'none',
								'width': 'auto',
								'padding': '0px',
								'margin': '0px',
								'background-color': 'transparent'							
							});
						});
						//newSpan.cloneEvents(this);

					}
				});
				*/
				try{
                 if(!panelUl){
			        panelUl = new Element('ul', {
			            class: 'sublist'
			        });
			        panelSet.appendChild(panelUl);
			    }
			    
                panelLi.appendChild(panelSpan);
                panelUl.appendChild(panelLi);
                panelSet.appendChild(panelUl);
                }catch(e){}
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
	var graph_container_min_width = 680; //775
	var graph_container_min_height = 485; //500
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
		}
		// else (i.e., the remaining vertical space is the limiting factor), fill the vertical, and then set the horizontal according to the ratio
		else
		{
			graph_container_height = window.getSize().y - verticalElementsHeight;
			graph_container_width = graph_container_height * graph_container_ratio;
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
	//document.getElements('#graphs .graph svg').setStyle('padding-top', '20px');

	
	//document.getElements('#graphs .graph').setStyle('border', '1px solid red');
	
	//window.currentGraph.options.height = 1234;
	//window.currentGraph.options.width = 1234;

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
