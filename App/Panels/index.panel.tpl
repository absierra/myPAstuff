{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
<div id="contentWrapper">
    <header>
        <img src="/Resources/core/img/logo.png" alt="Delphi Performance"/><span class="logoText">Budgets</span>
    </header>
    <div id="leftColumn">
        <ul>
        	<h3 class="descriptionTooltip">Fund</h3>
            <div class="panelDescription">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        	<ul id="fund"></ul>
        </ul>
        <ul>
        	<h3 class="descriptionTooltip">Department</h3>
            <div class="panelDescription">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
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
        </ul>
        <div id="graphContainer">
            <h1 id="graphTitle"></h1>
            <h2 id="graphBreakdown">Dollars per Year</h2>
            <h2 id="graphFiscalYear">Fiscal Year</h2>
            <ul id="graphTypes">
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
            <div id="exp_vs_fee_rev" class="graph"></div>
            <div id="yearsContainer">
                <ul id="yearsText"></ul>
            	<input id="yearsSlider" type="range" upper="" lower="" step="25" onchange="javascript:yearSliderUpdate(this, this.value);"/>
            </div>
             <ul id="legend"></ul>
        </div>
    </div>
</div>