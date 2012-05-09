//global js here
function panelData(){

	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', onSuccess: function(data){
        this.dataRequest = data.data;
	    // this.totalFunds = this.dataRequest['funds'].length;
	    // this.totalDepartments = this.dataRequest['departments'].length;
	    // this.totalCategories = this.dataRequest['categories'].length;
	    this.populatePanel('funds');
		this.populatePanel('departments');
		this.populatePanel('categories');
		
	}.bind(this)}).get();
	
	// onclick
	// return all 3 in an object (current selection)
	// var selection add to it with the click events.
	var selectionRequest = new Request.JSON({url : '/data/categorization_dependencies', onSuccess: function(data){
        var dataSelect = data.data;
        console.log(data);
	}.bind(this)});
	//.get({'fund':'Capital Fund:Capital Improvement Fund'});
	
	var dataSelect = {
		'funds': [
			'Enterprise:Water',
			'Debt Service Funds',
			'Debt Service Funds:Civic Center Debt 01-02'
		],
		'departments': [
			'Capital Fund:Capital Improvement',
			'City Attorney:Consultation and Advisory',
			'City Attorney:Litigation and Dispute Resolution'
		],
		'categories': [
			'Revenue',
			'Revenue:Sales Taxes'
		]
	};

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

	this.populatePanel = function(panel) {
		this.dataRequest[panel].each(function(element) {
		
			if (panel == 'funds') {
				var panelId = document.id('fund');
			} else if (panel == 'departments') {
				var panelId = document.id('department');
			} else if (panel == 'categories') {
				var panelId = document.id('category');
			}
			
			var element = element.split(":");
			
			var panelLiClickFunction = function(event) {
					var data = {};
					switch (panel){
						case 'funds': 
							data['fund'] = panelSpan.get('itemIdentifier');
							break;
						case 'departments': 
							data['department'] = panelSpan.get('itemIdentifier');
							break;
						case 'categories': 
							data['category'] = panelSpan.get('itemIdentifier');
							break;
					}
					selectionRequest.get(data);
					console.log(selectionRequest);
					
			};
			
			if ((element[0]) && (!element[1])) {
				var panelLi = new Element('li', { class: ''+element[0].replace(/ /g, '')+'' });
				var panelSpan = new Element('span', { html: element[0] });
				panelSpan.set('itemIdentifier', element[0]);
				panelSpan.addEvent('click', panelLiClickFunction.bind(this));
				panelId.appendChild(panelLi);
				panelLi.appendChild(panelSpan);
				if (dataSelect[panel].contains(element[0])) {
					document.getElement('.'+element[0].replace(/ /g, '')+' span').addClass('colorbar').setStyles({'border':'1px solid blue'});
				} 
			} else if (element[1]) {
				var panelUl = new Element('ul');
				var panelLi = new Element('li', { class: ''+element[1].replace(/ /g, '')+'' });
				var panelSpan = new Element('span', { html: element[1] });
				
				panelSpan.set('itemIdentifier', element[1]);
				panelSpan.addEvent('click', function(){
					alert(element[1]);
				})
				panelSpan.addEvent('click', panelLiClickFunction.bind(this));
				var subItem = panelId.getElement('li.'+element[0].replace(/ /g, '')+'');
				subItem.appendChild(panelUl);
				panelUl.appendChild(panelLi);
				panelLi.appendChild(panelSpan);
				if (dataSelect[panel].contains(''+element[0]+':'+element[1]+'')) {
					document.getElement('.'+element[1].replace(/ /g, '')+' span').addClass('colorbar').setStyles({'border':'1px solid red'});
				} 
			}	
		}.bind(this));
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
