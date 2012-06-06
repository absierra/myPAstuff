{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
<div id="content_wrapper">
    <header>
        <img src="/Resources/core/img/logo.png" alt="Delphi Budgets"/>
    </header>
    <div id="left_column">
        <ul>
        	<h3>Fund<a class="description_tooltip"></a></h3>
            <div class="panel_description">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        	<ul id="fund"></ul>
        </ul>
        <ul>
        	<h3>Department<a class="description_tooltip"></a></h3>
            <div class="panel_description">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        	<ul id="department"></ul>
        </ul>
    </div>
    <div id="content">
        <ul id="tabs" class="graph_tabs">
        	<li class="tab fund_tab" graph="fund">Fund</li>
        	<li class="tab department_tab" graph="department">Department</li>
            <li class="tab expenditure_tab" graph="expenses">Expenditure</li>
            <li class="tab revenue_tab" graph="revenue">Revenue</li>
            <li class="tab fee_revenue_tab" graph="fee_revenue">Fee Rev.</li>
            <li class="tab exp_vs_fee_rev" graph="expenses_vs_fee_revenue">Exp. vs. Fee Rev.</li>
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
            	<div id="fund_graph" class="graph"></div>
            	<div id="department_graph" class="graph"></div>
                <div id="expenditure_graph" class="graph"></div>
                <div id="revenue_graph" class="graph"></div>
                <div id="fee_revenue_graph" class="graph"></div>
                <div id="exp_vs_fee_rev" class="graph"></div>
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