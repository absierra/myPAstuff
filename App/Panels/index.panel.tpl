{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header,graphael,tabs,scrollabletable"}
{panel name="header"}
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
		<div id="column_header_divider_horizontal"></div>
		<div id="column_header_divider_vertical"></div>
    </div>
    <div id="content">
    	<ul id="tabs" class="graph_tabs">
            <fieldset id="financial_breakdown">
                <legend><span>Financial Breakdown</span></legend>
            	<li id = "fin_fund" class="tab fund_tab" graph="fund">Fund</li>
            	<li id = "fin_dep" class="tab department_tab" graph="department">Department</li>
            	<li id = "fin_fund_dep" class="tab fund_department_tab" graph="fund_department">Fund/Department</li>
                <li id = "fin_exp" class="tab expenditure_tab" graph="expenses">Expenditure</li>
                <li id = "fin_rev" class="tab revenue_tab" graph="revenue">Revenue</li>
                <li id = "fin_feerev" class="tab fee_revenue_tab" graph="fee_revenue">Fee Revenue</li>
                <li id = "fin_expfee" class="tab exp_vs_fee_rev_tab" graph="revenue_expenses">Exp. vs. Fee Rev.</li>
            </fieldset>
            <fieldset id="employee_breakdown">
                <legend><span>Employee Breakdown</span></legend>
    			<li id = "emp_dep" class="tab employee_department_tab" graph="employee_department">Department</li>
    			<li id = "emp_type" class="tab employee_type_tab" graph="employee_type">Type</li>
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
				<div id="fund_department_graph" class="graph"></div>
				<div id="expenditure_graph" class="graph"></div>
				<div id="revenue_graph" class="graph"></div>
				<div id="fee_revenue_graph" class="graph"></div>
				<div id="exp_vs_fee_rev_graph" class="graph"></div>
				<div id="employee_department_graph" class="graph"></div>
				<div id="employee_type_graph" class="graph">
					<table id="employee_type_table" class="employee_table">
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
						<tbody>
        					<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    					</tbody>
					</table>
				</div>
            </div>
            <div id="years_container">
                {*<ul id="years_text"></ul>
            	<input id="years_slider" type="range" upper="" lower="" step="25" value="2013" onchange="javascript:yearSliderUpdate(this, this.value);"/>*}
            </div>
            <h2 id="graph_fiscal_year">Fiscal Year 2013</h2>
            <ul id="legend"></ul>
        </div>
		<div id="delphilogo"></div>
    </div>
    <div id="load_spinner"><div class="spinner"></div></div>
</div>
