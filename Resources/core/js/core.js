//global js here
console.log('test1');
function panelData(){

    console.log('test2');
/*
	var dataRequest = (new Request.JSON({
	    url : '/data/unique_categories',
	    onSuccess :function(data){
	        this.dataRequest = data.data;
	        console.log(data);
	    }.bind(this);
	})).get();
*/
	
	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', onSuccess: function(data){
        this.dataRequest = data.data;
	    console.log(data);
	    this.populatePanel('funds');
		this.populatePanel('departments');
		this.populatePanel('categories');
}.bind(this)}).get();

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
	
/*
	this.dataRequest = {
		'Fund': [
			'General',
			'Enterprise',
			'Enterprise:Electric',
			'Enterprise:Fiber Optic',
			'Enterprise:Gas',
			'Enterprise:Wastewater Collection',
			'Enterprise:Water',
			'Enterprise:Refuse',
			'Enterprise:Storm Drainage',
			'Enterprise:Wastewater Treatment',
			'Enterprise:Airport',
			'Internal Service',
			'Internal Service:Vehicle Replacement and Mainenance',
			'Internal Service:Technology',
			'Internal Service:Printing and Mailing',
			'Internal Service:General Benefits',
			'Internal Service:Workers Compensation',
			'Internal Service:General Liabilities',
			'Internal Service:Retiree Health Benefit',
			'Special Revenue',
			'Special Revenue:Community Development',
			'Special Revenue:Street Improvement',
			'Special Revenue:Federal &amp; State Revenue',
			'Special Revenue:Housing In-Lieu',
			'Special Revenue:Special Districts',
			'Special Revenue:Traffic Mitigation &amp; Parking In-Lieu',
			'Special Revenue:Public Benefits'
		],
		'Department': [
			'City Attorney',
			'City Attorney:Administration',
			'City Attorney:Consultation and Advisory',
			'City Attorney:Litigation and Dispute Resolution',
			'City Attorney:Official & Administration',
			'City Auditor',
			'City Auditor:Audit Services',
			'City Clerk',
			'City Clerk:Administration',
			'City Clerk:Public Information',
			'City Clerk:Council Support Services',
			'City Clerk:Election/Conflict of Interest',
			'City Clerk:Legislative Records',
			'City Clerk:Administrative Citations',
			'City Manager',
			'City Manager:Administration',
			'City Manager:City Management',
			'City Manager:Public Communication',
			'Administrative Services',
			'Administrative Services:Administration',
			'Administrative Services:Accounting',
			'Administrative Services:Purchasing',
			'Administrative Services:Real Estate',
			'Administrative Services:Treasury',
			'Administrative Services:Budget',
			'Administrative Services: Information Technology',
			'Administrative Services: Non-Departmental',
			'Community Services',
			'Community Services:Cubberley &amp; Human Services',
			'Community Services:Open Spaces',
			'Community Services:Recreation &amp; Youth Sciences',
			'Human Resources',
			'Human Resources:Administration'
		],
		'Category': [
			'Revenue',
			'Revenue:Net Sales',
			'Revenue:Sales Taxes',
			'Revenue:Property Taxes',
			'Revenue:Transient Occupancy Tax',
			'Revenue:Documentary Transfer Tax',
			'Revenue:Utility Users Tax',
			'Revenue:Other Taxes and Fines',
			'Revenue:Charges for Services',
			'Revenue:Permits and Licenses',
			'Revenue:Return on Investments',
			'Revenue:Rental Income',
			'Revenue:From Other Agencies',
			'Revenue:Charges to Other Funds',
			'Revenue:Other Revenue',
			'Expenditures',
			'Expenditures:Utility Purchases and Charges',
			'Expenditures:Salaries and Benefits',
			'Expenditures:Contract Services',
			'Expenditures:Supplies',
			'Expenditures:Facilities and Equipment Purchases',
			'Expenditures:General Expense',
			'Expenditures:Rents and Leases',
			'Expenditures:Allocated Charges',
			'Expenditures:Debt Service',
			'Expenditures:Capital Improvement Program'
		]
	};
*/
	
/*
	var dataSelect = {
			'funds': [
				'Enterprise:Water'
			],
			'departments': [
				'City Attorney:Consultation and Advisory',
				'City Attorney:Litigation and Dispute Resolution'
			],
			'categories': [
				'Revenue:Sales Taxes'
			]
	};
*/
	this.populatePanel = function(panel) {
		console.log(this.dataRequest[panel]);
		this.dataRequest[panel].each(function(element) {
		
			if (panel == 'funds') {
				this.panelId = document.id('fund');
			} else if (panel == 'departments') {
				this.panelId = document.id('department');
			} else if (panel == 'categories') {
				this.panelId = document.id('category');
			}
			
			this.element = element.split(":");
			if ((this.element[0]) && (!this.element[1])) {
				//this.panelUl = new Element('ul');
				this.panelLi = new Element('li', { class: ''+this.element[0].replace(/ /g, '')+'' });
				this.panelSpan = new Element('span', { html: this.element[0], class: 'colorbar' });
				//this.panelId.appendChild(this.panelUl);
				this.panelId.appendChild(this.panelLi);
				this.panelLi.appendChild(this.panelSpan);
			} else {
				this.subPanelUl = new Element('ul');
				this.subPanelLi = new Element('li');
				this.subPanelSpan = new Element('span', { html: this.element[1], class: ''+this.element[1].replace(/ /g, '')+'' });
				this.subItem = this.panelId.getElement('li.'+this.element[0].replace(/ /g, '')+'');
				this.subItem.appendChild(this.subPanelUl);
				this.subPanelUl.appendChild(this.subPanelLi);
				this.subPanelLi.appendChild(this.subPanelSpan);
			}	
/*
			dataSelect[panel].each(function(elementSelect) {
				this.selectedElement = elementSelect.split(":");
				if ((selectedElement[0]) && (this.selectedElement[0] == this.element[0])) {
					document.getElement('.'+this.element[0].replace(/ /g, '')+'').setStyles({'border':'1px solid red'});
				}
			});
*/
		});
	};
}

/*
	Set SomeFunction(legalReturn) {
		documents.getElements('.funds li').each(function(item,key)) {
			if(!legalReturn.funds.contains(item.get('node-name')))
				//item.disable();
				//.removeClass()
				item.setStyles({'border': '1px solid red'});
			else 
				//item.enable();
				//.addClass
				item.setStyles({'border': '1px solid blue'});
		}
	}
*/

document.addEvent('domready', function() {
	datatest = new panelData();
});
