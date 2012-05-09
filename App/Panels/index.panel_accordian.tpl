{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header"}
{panel name="header"}
<div class="navigation">
	<ul class="four_col_1">
		<h3>Fund</h3>
		<ul>{*
	    	{foreach from="$areas" item="subareas" key="area"}
	    	<li>
	    		<span class="color">{$area}</span>
	    		<ul>
	            	{foreach from="$subareas" item="subarea"}
	        		<li>
	        			<span class="color">{$subarea}</span>
					</li>
	            	{/foreach}
	        	</ul>
	        </li>
	    	{/foreach}
	    	*}
	    	<li><span class="color">General</span></li>
	    	<li>
	    		<span class="color">Enterprise</span>
	    		<ul>
	        		<li><span class="color">Electric</span></li>
	        		<li><span class="color">Fiber Optic</span></li>
	        		<li><span class="color">Gas</span></li>
	        		<li><span class="color">Wastewater Collection</span></li>
	        		<li><span class="color">Water</span></li>
	        		<li><span class="color">Refuse</span></li>
	        		<li><span class="color">Storm Drainage</span></li>
	        		<li><span class="color">Wastewater Treatment</span></li>
	        		<li><span class="color">Airport</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">Internal Service</span>
	    		<ul>
	        		<li><span class="color">Vehicle Replacement and Maintenance</span></li>
	        		<li><span class="color">Technology</span></li>
	        		<li><span class="color">Printing and Mailing</span></li>
	        		<li><span class="color">General Benefits</span></li>
	        		<li><span class="color">Workers Compensation</span></li>
	        		<li><span class="color">General Liabilities Insurance</span></li>
	        		<li><span class="color">Retiree Health Benefit</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">Special Revenue</span>
	    		<ul>
	        		<li><span class="color">Community Development</span></li>
	        		<li><span class="color">Street Improvement</span></li>
	        		<li><span class="color">Federal &amp; State Revenue</span></li>
	        		<li><span class="color">Housing In-Lieu</span></li>
	        		<li><span class="color">Special Districts</span></li>
	        		<li><span class="color">Traffic Mitigation &amp; Parking In-Lieu</span></li>
	        		<li><span class="color">Public Benefits</span></li>
	        	</ul>
	        </li>
	    </ul>
    </ul>
    <ul class="four_col_2">
    	<h3>Department</h3>
    	<ul>
    		{*
	    	{foreach from="$categories" item="subcategories" key="category"}
	    	<li>
	    		<span class="color">{$category}</span>
	    		<ul>
	          		{foreach from="$subcategories" item="subcategory"}
	           		<li>
	            		<span class="color">{$subcategory}</span>
	            	</li>
	            	{/foreach}
	        	</ul>
	        </li>
	    	{/foreach}
	    	*}
	    	<li>
	    		<span class="color">City Attorney</span>
	    		<ul>
	        		<li><span class="color">Administration</span></li>
	        		<li><span class="color">Consultation and Advisory</span></li>
	        		<li><span class="color">Litigation and Dispute Resolution</span></li>
	        		<li><span class="color">Official &amp; Administration</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">City Auditor</span>
	    		<ul>
	        		<li><span class="color">Audit Services</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">City Clerk</span>
	    		<ul>
	        		<li><span class="color">Administration</span></li>
	        		<li><span class="color">Public Information</span></li>
	        		<li><span class="color">Council Support Services</span></li>
	        		<li><span class="color">Election/Conflict of Interest</span></li>
	        		<li><span class="color">Legislative Records</span></li>
	        		<li><span class="color">Administrative Citations</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">City Manager</span>
	    		<ul>
	        		<li><span class="color">Administration</span></li>
	        		<li><span class="color">City Management</span></li>
	        		<li><span class="color">Public Communication</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">Administrative Services</span>
	    		<ul>
	        		<li><span class="color">Administration</span></li>
	        		<li><span class="color">Accounting</span></li>
	        		<li><span class="color">Purchasing</span></li>
	        		<li><span class="color">Real Estate</span></li>
	        		<li><span class="color">Treasury</span></li>
	        		<li><span class="color">Budget</span></li>
	        		<li><span class="color">Information Technology</span></li>
	        		<li><span class="color">Non-Departmental</span></li>
	        		
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">Community Services</span>
	    		<ul>
	        		<li><span class="color">Cubberley &amp; Human Services</span></li>
	        		<li><span class="color">Open Spaces</span></li>
	        		<li><span class="color">Recreation &amp; Youth Sciences</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">Human Resources</span>
	    		<ul>
	        		<li><span class="color">Administration</span></li>
	        	</ul>
	        </li>
	    </ul>
	</ul>
    <ul class="four_col_3">
    	<h3>Category</h3>
    	<ul>
	    	<li>
	    		<span class="color">Revenue</span>
	    		<ul>
	        		<li><span class="color">Net Sales</span></li>
	        		<li><span class="color">Sales Taxes</span></li>
	        		<li><span class="color">Property Taxes</span></li>
	        		<li><span class="color">Transient Occupancy Tax</span></li>
	        		<li><span class="color">Documentary Transfer Tax</span></li>
	        		<li><span class="color">Utility Users Tax</span></li>
	        		<li><span class="color">Other Taxes and Fines</span></li>
	        		<li><span class="color">Charges for Services</span></li>
	        		<li><span class="color">Permits and Licenses</span></li>
	        		<li><span class="color">Return on Investments</span></li>
	        		<li><span class="color">Rental Income</span></li>
	        		<li><span class="color">From Other Agencies</span></li>
	        		<li><span class="color">Charges to Other Funds</span></li>
	        		<li><span class="color">Other Revenue</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="color">Expenditures</span>
	    		<ul>
	        		<li><span class="color">Utility Purchases and Charges</span></li>
	        		<li><span class="color">Salaries and Benefits</span></li>
	        		<li><span class="color">Contract Services</span></li>
	        		<li><span class="color">Supplies and Materials</span></li>
	        		<li><span class="color">Facilities and Equipment Purchases</span></li>
	        		<li><span class="color">General Expense</span></li>
	        		<li><span class="color">Rents and Leases</span></li>
	        		<li><span class="color">Allocated Charges</span></li>
	        		<li><span class="color">Debt Service</span></li>
	        		<li><span class="color">Capital Improvement Program</span></li>
	        	</ul>
	        </li>
		</ul>
    </ul>
    <ul class="four_col_4">
        <div id="graph_types">
        	<div id="graph_stage"></div>
        </div>
        <ol style="graphtabs">
        	<li>Breakdown 1</li>
        	<li>Breakdown 2</li>
        	<li>Breakdown 3</li>
        </ol>
		<script type="type/language">{literal}
		function colors(num){
		    if(!num) num = 5;
		    var result = [];
		    var increment = 359/num;
		    var color = new Color([255, 0, 0]);
		    for(var lcv=0; lcv < num; lcv++){
		        var val = increment*lcv;
		        result.push(color.setHue(val).hex);
		    };
		    return result;
		}
		{/literal}</script>
    	<p>Notes Section:
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<br />Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    	</p>
    </ul>
</div>
</div>
