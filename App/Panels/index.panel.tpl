{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
<div id="content_wrapper">
    <header>
        <img src="/Resources/core/img/logo.png" alt="Delphi Budgets"/>
    </header>
    <div id="left_column">
        <ul>
        	<h3 id="default_fund">Fund<a class="description_tooltip" href="about/"></a></h3>
            <div class="panel_description">Think of a fund like a bank account. Revenue flows into a city in the form of taxes and fees, and is held in various funds. These funds have rules about how their money can be used, and they are drawn on by specific departments, divisions, and programs.<br /><br />Click on a fund to see what sub-funds it has and what departments receive money out of that fund.</div>
        	<ul id="fund"></ul>
        </ul>
        <ul>
        	<h3 id="default_department">Department<a class="description_tooltip" href="about/"></a></h3>
            <div class="panel_description">Every department is a broad function performed by the city. Each department has its own divisions and programs, which draw money from one or more funds.<br /><br />Click on a department, division, or program to see what funds it draws on.</div>
        	<ul id="department"></ul>
        </ul>
    </div>
    <div id="content">
    	<ul id="tabs" class="graph_tabs"> 
        	<li class="tab fund_tab" graph="fund">Breakdown by Fund</li>
        	<li class="tab department_tab" graph="department">Breakdown by Department</li>
        	<li class="tab fund_department_tab" graph="department">Breakdown by Fund/Department</li>
            <li class="tab expenditure_tab" graph="expenses">Breakdown by Expenditure</li>
            <li class="tab revenue_tab" graph="revenue">Breakdown by Revenue</li>
            <li class="tab fee_revenue_tab" graph="fee_revenue">Breakdown by Fee Rev.</li>
            <li class="tab exp_vs_fee_rev_tab" graph="expenses_vs_fee_revenue">Breakdown by Exp. vs. Fee Rev.</li>
			<li class="tab employee_department_tab" graph="employee_department">Breakdown by Department</li>
			<li class="tab employee_type_tab" graph="employee_type">Breakdown by Type</li>
			<li class="tab employee_salary_tab" graph="employee_salary">Breakdown by Salary</li>
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
				<div id="employee_type_graph" class="graph"></div>
				<div id="employee_salary_graph" class="graph"></div>
            </div>
            <div id="years_container">
                <ul id="years_text"></ul>
            	<input id="years_slider" type="range" upper="" lower="" step="25" onchange="javascript:yearSliderUpdate(this, this.value);"/>
            </div>
            <h2 id="graph_fiscal_year">Fiscal Year</h2>
            <ul id="legend"></ul>
        </div>
    </div>
    <div id="load_spinner"><div class="spinner"></div></div>
</div>
