{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header"}
{panel name="header"}
<div class="navigation">
	<ul class="four_col_1">
		<h3>Fund</h3>
		<ul>{*
	    	{foreach from="$areas" item="subareas" key="area"}
	    	<li>
	    		<span class="icon">{$area}</span>
	    		<ul>
	            	{foreach from="$subareas" item="subarea"}
	        		<li>
	        			<span class="icon">{$subarea}</span>
					</li>
	            	{/foreach}
	        	</ul>
	        </li>
	    	{/foreach}
	    	*}
	    	<li><span class="icon">General</span></li>
	    	<li>
	    		<span class="icon">Enterprise</span>
	    		<ul>
	        		<li><span class="icon">Electric</span></li>
	        		<li><span class="icon">Fiber Optic</span></li>
	        		<li><span class="icon">Gas</span></li>
	        		<li><span class="icon">Wastewater Collection</span></li>
	        		<li><span class="icon">Water</span></li>
	        		<li><span class="icon">Refuse</span></li>
	        		<li><span class="icon">Storm Drainage</span></li>
	        		<li><span class="icon">Wastewater Treatment</span></li>
	        		<li><span class="icon">Airport</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">Internal Service</span>
	    		<ul>
	        		<li><span class="icon">Vehicle Replacement and Maintenance</span></li>
	        		<li><span class="icon">Technology</span></li>
	        		<li><span class="icon">Printing and Mailing</span></li>
	        		<li><span class="icon">General Benefits</span></li>
	        		<li><span class="icon">Workers Compensation</span></li>
	        		<li><span class="icon">General Liabilities Insurance</span></li>
	        		<li><span class="icon">Retiree Health Benefit</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">Special Revenue</span>
	    		<ul>
	        		<li><span class="icon">Community Development</span></li>
	        		<li><span class="icon">Street Improvement</span></li>
	        		<li><span class="icon">Federal &amp; State Revenue</span></li>
	        		<li><span class="icon">Housing In-Lieu</span></li>
	        		<li><span class="icon">Special Districts</span></li>
	        		<li><span class="icon">Traffic Mitigation &amp; Parking In-Lieu</span></li>
	        		<li><span class="icon">Public Benefits</span></li>
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
	    		<span class="icon">{$category}</span>
	    		<ul>
	          		{foreach from="$subcategories" item="subcategory"}
	           		<li>
	            		<span class="icon">{$subcategory}</span>
	            	</li>
	            	{/foreach}
	        	</ul>
	        </li>
	    	{/foreach}
	    	*}
	    	<li>
	    		<span class="icon">City Attorney</span>
	    		<ul>
	        		<li><span class="icon">Administration</span></li>
	        		<li><span class="icon">Consultation and Advisory</span></li>
	        		<li><span class="icon">Litigation and Dispute Resolution</span></li>
	        		<li><span class="icon">Official &amp; Administration</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">City Auditor</span>
	    		<ul>
	        		<li><span class="icon">Audit Services</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">City Clerk</span>
	    		<ul>
	        		<li><span class="icon">Administration</span></li>
	        		<li><span class="icon">Public Information</span></li>
	        		<li><span class="icon">Council Support Services</span></li>
	        		<li><span class="icon">Election/Conflict of Interest</span></li>
	        		<li><span class="icon">Legislative Records</span></li>
	        		<li><span class="icon">Administrative Citations</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">City Manager</span>
	    		<ul>
	        		<li><span class="icon">Administration</span></li>
	        		<li><span class="icon">City Management</span></li>
	        		<li><span class="icon">Public Communication</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">Administrative Services</span>
	    		<ul>
	        		<li><span class="icon">Administration</span></li>
	        		<li><span class="icon">Accounting</span></li>
	        		<li><span class="icon">Purchasing</span></li>
	        		<li><span class="icon">Real Estate</span></li>
	        		<li><span class="icon">Treasury</span></li>
	        		<li><span class="icon">Budget</span></li>
	        		<li><span class="icon">Information Technology</span></li>
	        		<li><span class="icon">Non-Departmental</span></li>
	        		
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">Community Services</span>
	    		<ul>
	        		<li><span class="icon">Cubberley &amp; Human Services</span></li>
	        		<li><span class="icon">Open Spaces</span></li>
	        		<li><span class="icon">Recreation &amp; Youth Sciences</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">Human Resources</span>
	    		<ul>
	        		<li><span class="icon">Administration</span></li>
	        	</ul>
	        </li>
	    </ul>
	</ul>
    <ul class="four_col_3">
    	<h3>Category</h3>
    	<ul>
	    	<li>
	    		<span class="icon">Revenue</span>
	    		<ul>
	        		<li><span class="icon">Net Sales</span></li>
	        		<li><span class="icon">Sales Taxes</span></li>
	        		<li><span class="icon">Property Taxes</span></li>
	        		<li><span class="icon">Transient Occupancy Tax</span></li>
	        		<li><span class="icon">Documentary Transfer Tax</span></li>
	        		<li><span class="icon">Utility Users Tax</span></li>
	        		<li><span class="icon">Other Taxes and Fines</span></li>
	        		<li><span class="icon">Charges for Services</span></li>
	        		<li><span class="icon">Permits and Licenses</span></li>
	        		<li><span class="icon">Return on Investments</span></li>
	        		<li><span class="icon">Rental Income</span></li>
	        		<li><span class="icon">From Other Agencies</span></li>
	        		<li><span class="icon">Charges to Other Funds</span></li>
	        		<li><span class="icon">Other Revenue</span></li>
	        	</ul>
	        </li>
	        <li>
	    		<span class="icon">Expenditures</span>
	    		<ul>
	        		<li><span class="icon">Utility Purchases and Charges</span></li>
	        		<li><span class="icon">Salaries and Benefits</span></li>
	        		<li><span class="icon">Contract Services</span></li>
	        		<li><span class="icon">Supplies and Materials</span></li>
	        		<li><span class="icon">Facilities and Equipment Purchases</span></li>
	        		<li><span class="icon">General Expense</span></li>
	        		<li><span class="icon">Rents and Leases</span></li>
	        		<li><span class="icon">Allocated Charges</span></li>
	        		<li><span class="icon">Debt Service</span></li>
	        		<li><span class="icon">Capital Improvement Program</span></li>
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
