{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
<div id="content_wrapper">
    <header>
        <img src="/Resources/core/img/logo.png" alt="Delphi Performance"/><span class="logo_text">Budgets</span>
    </header>
    <div id="left_column">
        <ul>
        	<h3 class="description_tooltip">Fund</h3>
            <div class="panel_description">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        	<ul id="fund"></ul>
        </ul>
        <ul>
        	<h3 class="description_tooltip">Department</h3>
            <div class="panel_description">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        	<ul id="department"></ul>
        </ul>
    </div>
    <div id="content">
    	<ul id="tabs" class="graphTabs"> 
        	<li class="tab fund_tab" graph="fund">Breakdown by Fund</li>
        	<li class="tab department_tab" graph="department">Breakdown by Department</li>
            <li class="tab expenditure_tab" graph="expenses">Breakdown by Expenditure</li>
            <li class="tab revenue_tab" graph="revenue">Breakdown by Revenue</li>
            <li class="tab fee_revenue_tab" graph="fee_revenue">Breakdown by Fee Rev.</li>
            <li class="tab exp_vs_fee_rev" graph="expenses_vs_fee_revenue">Breakdown by Exp. vs. Fee Rev.</li>
			<li class="tab employee_department_tab" graph="employee_department">Breakdown by Department</li>
			<li class="tab employee_type_tab" graph="employee_type">Breakdown by Type</li>
			<li class="tab employee_salary_tab" graph="employee_salary">Breakdown by Salary</li>
        </ul>
        <div id="graph_container">
            <h1 id="graph_title"></h1>
            <h2 id="graph_breakdown">Dollars per Year</h2>
            <h2 id="graph_fiscal_year">Fiscal Year</h2>
            <div id="loading_icon">
                <div class="spinner"></div>
            </div>
            <ul id="graph_types">
            	<li id="percentage_graph" class="percentage icon"></li>
            	<li id="stacked_graph" class="stacked icon"></li>
            	<li id="standard_graph" class="line icon active"></li>
                <li id="pie_chart" class="pie icon"></li>
            </ul>
        	<div id="fund_graph" class="graph"></div>
        	<div id="department_graph" class="graph"></div>
            <div id="expenditure_graph" class="graph"></div>
            <div id="revenue_graph" class="graph"></div>
            <div id="fee_revenue_graph" class="graph"></div>
            <div id="exp_vs_fee_rev_graph" class="graph"></div>
            <div id="employee_department_graph" class="graph"></div>
            <div id="employee_type_graph" class="graph"></div>
            <div id="employee_salary_graph" class="graph"></div>
            <div id="years_container">
                <ul id="years_text"></ul>
            	<input id="years_slider" type="range" upper="" lower="" step="25" onchange="javascript:yearSliderUpdate(this, this.value);"/>
            </div>
             <ul id="legend"></ul>
        </div>
    </div>
</div>