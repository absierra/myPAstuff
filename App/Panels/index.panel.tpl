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
        {*<ol class="graphtabs">
        	<li id="percentage_graph">Percentage</li>
        	<li id="stacked_graph">Stacked</li>
        	<li id="standard_graph" class="active">Line</li>
            <li id="pie_chart">Pie</li>
        </ol>*}

        <ol id="tabs" class="graphtabs">
        	<li class="tab fund_tab">Breakdown by Fund</li>
        	<li class="tab department_tab">Breakdown by Department</li>
            <li class="tab expenditure_tab">Breakdown by Expenditure</li>
            <li class="tab revenue_tab">Breakdown by Revenue</li>
            <li class="tab fee_revenue_tab">Breakdown by Fee Revenue</li>
            <li class="tab exp_vs_fee_rev">Breakdown by Exp. vs. Fee Rev.</li>
        </ol>

        <div id="graph_types">
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
             <ol id="legend"></ol>
        </div>
    </div>
</div>