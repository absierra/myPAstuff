{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
{literal}
<script type="text/javascript">
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
		
        window.tabSettings = {
            emp_type: function(event){
                //yearSlider('hide');
                tableFormat(true);
                document.id('stacked_graph').show();
                document.id('percentage_graph').show();
                document.id('pie_chart').show();
                document.id('standard_graph').show();
            },
            emp_dep: function(event){
                tableFormat(false, true);
                document.id('stacked_graph').hide();
                document.id('percentage_graph').hide();
                document.id('standard_graph').hide();
                document.id('pie_chart').show();
                changeCurrentGraphType('pie', document.id('pie_chart'));
                document.id('graph_fiscal_year').set('text', 'Fiscal Year 2013');
                document.id('graph_breakdown').empty();
            },
            fin_fund: function(event){
            	if(!in_negative_state){
                	tableFormat(false, false);
                	document.id('stacked_graph').show();
                	document.id('percentage_graph').show();
                	document.id('pie_chart').show();
                	document.id('standard_graph').show();
                }
            },
            fin_dep: function(event){
            	if(!in_negative_state){
					tableFormat(false, false);
					document.id('stacked_graph').show();
					document.id('percentage_graph').show();
					document.id('pie_chart').show();
					document.id('standard_graph').show();
				}
            },
            fin_exp: function(event){
            	if(!in_negative_state){
					tableFormat(false, false);
					document.id('stacked_graph').show();
					document.id('percentage_graph').show();
					document.id('pie_chart').show();
					document.id('standard_graph').show();
				}
            },
            fin_rev: function(event){
            	if(!in_negative_state){
					tableFormat(false, false);
					document.id('stacked_graph').show();
					document.id('percentage_graph').show();
					document.id('pie_chart').show();
					document.id('standard_graph').show();
				}
            },
            fin_feerev: function(event){
                if(!in_negative_state){
					tableFormat(false, false);
					document.id('stacked_graph').show();
					document.id('percentage_graph').show();
					document.id('pie_chart').show();
					document.id('standard_graph').show();
				}
            },
            fin_expfee: function(event){
                tableFormat(false, false);
                changeCurrentGraphType('line', document.id('standard_graph'));
                document.id('stacked_graph').hide();
                document.id('percentage_graph').hide();
                document.id('pie_chart').hide();
                document.id('standard_graph').show();
            }
        }
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
			var lastYear = '';
			//CITY SWITCH
			if(window.city == 'palo_alto' || window.city == 'salinas' || window.city == 'saratoga'){
   	   			var lastYear = '2013';
   	   		}
   	   		else if(window.city == 'lafayette'){
   	   			var lastYear = '2012';
   	   		}
			document.id('graph_fiscal_year').set('text', 'Fiscal Year '+lastYear);
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
					tableFormat(false, false);
					document.id('stacked_graph').show();
					document.id('percentage_graph').show();
					document.id('pie_chart').show();
				}
			 }
		});

		// this snippet makes the description_tooltip (on the "Fund" and "Department" columns) white when you mouseover anywhere in the header
		document.getElements("#left_column ul h3").each(function(headerElement){
			headerElement.addEvent('mouseover', function(){
				this.getElement("a").setStyle('background', 'url(\'Resources/core/img/info_active.png\') no-repeat 4px 0');
			});
			
			headerElement.addEvent('mouseleave', function(){
				this.getElement("a").setStyle('background', 'url(\'Resources/core/img/info_inactive.png\') no-repeat 5px 0');
			});
		});

		
		// this is kind of a dirty hack, but it's to clear the DIV element that we're using for mouseover expansion of ellipsis-shortened legend items. because the underlying LI is sometimes bigger than the DIV element, its mouseenter event is triggered, and there's no elegant way to clear it. so we're going to create an event on the legend canvas itself to clear it.
		/*
		var legendCanvas = document.getElement('#legend');
		legendCanvas.addEvent('mouseover', function(){
			
			var DIVelement = document.getElement('#secondLevelMouseOver');
			
			DIVelement.set('html', '');
			DIVelement.setStyles({
				'display': 'none',
				'width': 'auto'
			});

		});
		*/

		// this resizes the graph based on the window size
		rightPanelSizing();
		
		// this dynamically resizes the graph when the window resizes
		window.incrementalResize(45, function(){
			rightPanelSizing();
			Object.each(window.graphs, function(graph){
					graph.display();
			});
		});
		
	});
</script>
{/literal}
<div id="content_wrapper">
    <div id="left_column">
        <ul>
        	<h3 id="default_fund">Fund<a class="description_tooltip"></a></h3>
            <div class="panel_description">Think of a fund like a bank account. Revenue flows into a city in the form of taxes and fees and is held in various funds. These funds have rules about how their money can be used, and they are drawn on by specific departments and divisions.<br /><br />Click on a fund or category of funds to see what departments and divisions receive money from it.</div>
            <ul id="fund"></ul>
        </ul>
        <ul>
        	<h3 id="default_department">Department<a class="description_tooltip"></a></h3>
            <div class="panel_description">Every department is a broad function performed by the city. Each department has its own divisions, which draw money from one or more funds.<br /><br />Click on a department or division to see what funds it draws on.</div>
        	<ul id="department"></ul>
        </ul>
    </div>
    <div id="content">
    	<ul id="tabs" class="graph_tabs">
            <fieldset id="financial_breakdown">
                <legend><span>Financial Breakdown</span></legend>
            	<li id = "fin_fund" class="tab fund_tab" graph="fund">Fund</li>
            	<li id = "fin_dep" class="tab department_tab" graph="department">Department</li>
                <li id = "fin_exp" class="tab expenditure_tab" graph="expenses">Expenses</li>
                <li id = "fin_rev" class="tab revenue_tab" graph="revenue">Revenue</li>
                <li id = "fin_feerev" class="tab fee_revenue_tab" graph="fee_revenue">Revenue</li>
                <li id = "fin_expfee" class="tab exp_vs_fee_rev_tab" graph="revenue_expenses">Expenditure vs Revenue</li>
            </fieldset>
            <fieldset id="employee_breakdown">
                <legend><span>Employee Breakdown</span></legend>
    			<li id = "emp_dep" class="tab employee_department_tab" graph="employee_department">Department</li>
    			<li id = "emp_type" class="tab employee_type_tab" graph="employee_type">Job Type</li>
            </fieldset>
        </ul>
        <div id="graph_container">
            <h1 id="graph_title"></h1>
            <h2 id="graph_breakdown">Dollars per Year</h2>
            <ul id="graph_types">
            	<li id="percentage_graph" class="percentage icon"></li>
            	<li id="stacked_graph" class="stacked icon"></li>
            	<li id="standard_graph" class="line icon active"></li>
                <li id="pie_chart" class="pie icon"></li>
            </ul>
            <div id="graphs">
                <div id="graph_spinner"></div>
				<div id="fund_graph" class="graph"></div>
				<div id="department_graph" class="graph"></div>
				<div id="expenditure_graph" class="graph"></div>
				<div id="revenue_graph" class="graph"></div>
				<div id="fee_revenue_graph" class="graph"></div>
				<div id="exp_vs_fee_rev_graph" class="graph"></div>
				<div id="employee_department_graph" class="graph"></div>
				<div id="employee_type_graph" class="graph">
                    <div id="employee_type_container">
        				<table id="employee_type_table_titles">
        					<thead>
        						<tr>
        						<th>Job Title</th>
        						<th>2009 FTEs</th>
        						<th>2010 FTEs</th>
        						<th>2011 FTEs</th>
        						<th>2012 FTEs</th>
        						<th>2013 FTEs</th>
        						<th>2013 Salary</th>
        						</tr>
        					</thead>
                        </table>
                        <div id="employee_type_table_container">
                            <table id="employee_type_table">
            					<tbody>
                					<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            					</tbody>
            				</table>
                        </div>
                    </div>
				</div>
            </div>
            <div id="years_container">
                {*<ul id="years_text"></ul>
            	<input id="years_slider" type="range" upper="" lower="" step="25" value="2013" onchange="javascript:yearSliderUpdate(this, this.value);"/>*}
            </div>
            <h2 id="graph_fiscal_year">Fiscal Year</h2>
            <ul id="legend"></ul>
			<div id="delphilogo"></div>
        </div>
    </div>
    <div id="load_spinner"><div class="spinner"></div></div>
</div>
<div id="secondLevelMouseOver"></div>
