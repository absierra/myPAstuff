{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
<div class="navigation">
	<ul class="four_col_1"> {* ♫ In the ghetto ♫ *}
		<h3>Fund</h3>
		<ul id="fund"></ul>
    </ul>
    <ul class="four_col_2">
    	<h3>Department</h3>
    	<ul id="department"></ul>
   	</ul>
    {*<ul class="four_col_3">
    	<h3>Category</h3>
    	<ul id="category"></ul>
    </ul>*}
    <ul class="four_col_4">
        <ol style="graphtypes" class="graphtabs">
        	<li id="percentage_graph">Percentage</li>
        	<li id="stacked_graph" class="active">Stacked</li>
        	<li id="standard_graph">Line</li>
        	{* <li id="bar_graph">Bar</li> *}
        </ol>
        <div id="graph_types">
        	<div id="fund_graph" class="graph"></div>
        	<div id="department_graph" class="graph"></div>
        	{*<div id="category_graph" class="graph"></div>*}
            <div id="expenditure_graph" class="graph"></div>
            <div id="revenue_graph" class="graph"></div>
            <div id="fee_revenue_graph" class="graph"></div>
            <div id="exp_vs_fee_rev" class="graph"></div>
        </div>
        <ol id="legend"></ol>
        <ol id="tabs" style="graphtabs" class="graphtabs">
        	<li class="tab">Fund</li>
        	<li class="tab">Department</li>
            <li class="tab">Expenditure</li>
            <li class="tab">Revenue</li>
            <li class="tab">Fee Revenue</li>
            <li class="tab">Exp. vs. Fee Rev.</li>
        </ol>
    	{*<p>Notes Section:
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.*}
    </ul>
</div>
</div>