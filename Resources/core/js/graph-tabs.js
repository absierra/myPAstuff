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
			if (window.panelSelection.fund && window.panelSelection.department){ //WTF is 'panelSelection' and why can't we use selection?
				document.id('fin_rev').hide();
				document.id('fin_feerev').show();
				if (window.panelSelection.fund == 1 && window.panelSelection.department == 1) {
					graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab']; // [Fund 1][Dept 1]
				} else if (window.panelSelection.fund == 1 && window.panelSelection.department == 2) {
					graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab']; // [Fund 1][Dept 2]
				} else if (window.panelSelection.fund == 2 && window.panelSelection.department == 1) {
					graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab']; // [Fund 2][Dept 1]
				} else if (window.panelSelection.fund == 2 && window.panelSelection.department == 2) {
					graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab'];  // [Fund 2][Dept 2]
				}
			} else if (window.panelSelection.fund){
				document.id('fin_rev').show();
				document.id('fin_feerev').hide();
				switch(window.panelSelection.fund){
					case 1: 
						graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab']; // [Fund 1][Dept 0]
					break;
					case 2:
						graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab']; // [Fund 2][Dept 0]
					break;
				}
			} else if (window.panelSelection.department){
				document.id('fin_rev').hide();
				document.id('fin_feerev').show();
				switch(window.panelSelection.department){
					case 1:
						graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab', 'exp_vs_fee_rev_tab', 'employee_department_tab', 'employee_type_tab', 'employee_salary_tab']; // [Fund 0][Dept 1]
					break;
					case 2:
						graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'fee_revenue_tab', 'exp_vs_fee_rev_tab', 'employee_department_tab', 'employee_type_tab', 'employee_salary_tab']; // [Fund 0][Dept 2]
					break;
				}
			} else {
				document.id('fin_rev').show();
				document.id('fin_feerev').hide();
				graphTabsSelect = ['fund_tab', 'department_tab', 'expenditure_tab', 'revenue_tab']; // [Fund 0][Dept 0]
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
