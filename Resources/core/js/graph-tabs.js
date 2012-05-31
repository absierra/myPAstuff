var DelphiGraphTabs = {
    selected : false,
    initialize : function(options){
        window.graphTabs = new MGFX.Tabs('#tabs .tab', '#graph_types .graph');
        var tabsContainer = document.getElement('#tabs');
        var tabsLi = tabsContainer.getElements('#tabs li');
        tabsLi.each(function(el, tabKey){
                el.addEvent('click', function(event){
                    options.select(event);
                });
        });
    },
    select : function(tab){
        DelphiGraphTabs.selected = tab;
        DelphiGraphTabs.filter();
    },
    filter : function(){
        var graphTabsSelect = new Array();
        if (window.panelSelection.fund && window.panelSelection.department){ //WTF is 'panelSelection' and why can't we use selection?
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
        //you know, show/hide is way better than shuffling custom classes, and you could use first/last to handle rounding
        var tabsContainer = document.getElement('#tabs');
        var tabsLi = tabsContainer.getElements('#tabs li');
        tabsLi.removeClass('display'); //.removeClass('roundedLeft').removeClass('roundedRight');
        var totalTabs = graphTabsSelect.length;
        graphTabsSelect.each(function(selectedTabElement, tabKey){
            var tabElement = tabsContainer.getElement('.'+selectedTabElement);
            if (tabElement) {
                /*tabElement.addEvent('click', function(event){
                    BudgetGraph.select(event.target.innerHTML.toLowerCase());
                    
                });*/
                tabElement.addClass('display');
                //if (tabKey == 0) tabElement.addClass('roundedLeft');
                //if (tabKey+1 == totalTabs) tabElement.addClass('roundedRight');
            }
        });
    }
};