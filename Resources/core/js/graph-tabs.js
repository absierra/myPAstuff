var DelphiGraphTabs = {
    selected : false,
    initialize : function(options){
        var tabsContainer = document.getElement('#tabs');
        window.graphTabs = new MGFX.Tabs( '#tabs .tab'
                                        , '#graph_container .graph'
                                        , { clickable: '.display'
                                          , callback: function () {
                                              var g = BudgetGraph.graphs[event.target.getAttribute('graph')];
                                              g.setLegend();
                                              g.setKeys();
                                              window.tabSettings[this.get('id')]();
                                          }
                                        });
    },
    select : function(tab){
        DelphiGraphTabs.selected = tab;
        DelphiGraphTabs.filter();
    },
    filter : function(finance){
        var financialBreakdown = document.id('financial_breakdown');
        var employeeBreakdown = document.id('employee_breakdown');
        var graphTabsSelect = new Array();
        //CITY SWITCH
        if(window.city == 'palo_alto'){
			if (window.panelSelection.fund && window.panelSelection.department){ //WTF is 'panelSelection' and why can't we use selection?
				document.id('fin_rev').hide();
				document.id('fin_feerev').show();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab'];
				
			} else if (window.panelSelection.fund){
				document.id('fin_rev').show();
				document.id('fin_feerev').hide();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab'];
				
			} else if (window.panelSelection.department){
				document.id('fin_rev').hide();
				document.id('fin_feerev').show();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab', 'exp_vs_fee_rev_tab', 'employee_department_tab', 'employee_type_tab', 'employee_salary_tab']; // [Fund 0][Dept 1]
				
			} else {
				document.id('fin_rev').show();
				document.id('fin_feerev').hide();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab'];
			}
		}else if(window.city == 'saratoga'){
			if (window.panelSelection.fund && window.panelSelection.department){ //WTF is 'panelSelection' and why can't we use selection?
				document.id('fin_rev').hide();
				document.id('fin_feerev').show();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab'];
				
			} else if (window.panelSelection.fund){
				document.id('fin_rev').show();
				document.id('fin_feerev').hide();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab'];
				
			} else if (window.panelSelection.department){
				document.id('fin_rev').hide();
				document.id('fin_feerev').show();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab', 'exp_vs_fee_rev_tab']; // [Fund 0][Dept 1]
				
			} else {
				document.id('fin_rev').show();
				document.id('fin_feerev').hide();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab'];
			}
		}else if(window.city == 'salinas' || window.city == 'lafayette'){
			if (window.panelSelection.fund && window.panelSelection.department){ //WTF is 'panelSelection' and why can't we use selection?
				document.id('fin_rev').hide();
				document.id('fin_feerev').show();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab'];
				
			} else if (window.panelSelection.fund){
				document.id('fin_rev').show();
				document.id('fin_feerev').hide();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab'];
				
			} else if (window.panelSelection.department){
				document.id('fin_rev').hide();
				document.id('fin_feerev').show();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab']; // [Fund 0][Dept 1]
				
			} else {
				document.id('fin_rev').show();
				document.id('fin_feerev').hide();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab'];
			}
		}
        //you know, show/ is way better than shuffling custom classes, and you could use first/last to handle rounding
        var tabsContainer = document.getElement('#tabs');
        var tabsLi = tabsContainer.getElements('#tabs li');
        tabsLi.removeClass('display'); //.removeClass('roundedLeft').removeClass('roundedRight');
        var totalTabs = graphTabsSelect.length;
        graphTabsSelect.each(function(selectedTabElement, tabKey){
            var tabElement = tabsContainer.getElement('.'+selectedTabElement);
            if (tabElement) {
                /*tabElement.addEvent('click', function(event){
                	console.log(event.target.getAttribute('graph'));
                    BudgetGraph.select(event.target.getAttribute('graph'));
                    
                });*/
                tabElement.addClass('display');
                //if (tabKey == 0) tabElement.addClass('roundedLeft');
                //if (tabKey+1 == totalTabs) tabElement.addClass('roundedRight');
            }
        });
    }
};
