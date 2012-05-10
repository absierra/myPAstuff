//global js here
function panelData(){

	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', onSuccess: function(data){
        this.dataRequest = data.data;
	    this.populatePanel('funds');
		this.populatePanel('departments');
		this.populatePanel('categories');
		
	}.bind(this)}).get();
	
	var keys = new Keyboard({
	    defaultEventType: 'keyup',
	    events: {
	        'esc': function(){
				document.id('fund').removeClass('selected');
				document.id('department').removeClass('selected');
				document.id('category').removeClass('selected');
				
				document.getElements('#fund li span').each(function(item){
					item.removeClass('colorkey').removeClass('selected').removeClass('highlight').removeClass('disabled');
				});
				document.getElements('#department li span').each(function(item){
					item.removeClass('colorkey').removeClass('selected').removeClass('highlight').removeClass('disabled');
				});
				document.getElements('#category li span').each(function(item){
					item.removeClass('colorkey').removeClass('selected').removeClass('highlight').removeClass('disabled');
				});
	        }
	     }
	});
	
	var panelFilter = function(data) {
		//if (!(document.id('fund')).hasClass('selected')) {
			document.getElements('#fund li span').each(function(listItem){
				if (data.funds.contains(listItem.get('itemIdentifier'))){
					listItem.addClass('highlight');
				}else{
					if (!listItem.hasClass('selected')) listItem.removeClass('colorkey').addClass('disabled');
				}
			});
		//}
		//if (!(document.id('department')).hasClass('selected')) {
			document.getElements('#department li span').each(function(listItem){
				if (data.departments.contains(listItem.get('itemIdentifier'))){
					listItem.addClass('highlight');
				}else{
					if (!listItem.hasClass('selected')) listItem.removeClass('colorkey').addClass('disabled');
				}
			});
		//}
		//if (!(document.id('category')).hasClass('selected')) {
			document.getElements('#category li span').each(function(listItem){
				if (data.categories.contains(listItem.get('itemIdentifier'))){
					listItem.addClass('highlight');
				}else{
					if (!listItem.hasClass('selected')) listItem.removeClass('colorkey').addClass('disabled');
				}
			});
		//}
	}

	var selectionRequest = new Request.JSON({url : '/data/categorization_dependencies', onSuccess: function(data){
        var dataSelect = data.data;
        panelFilter(data.data);
	}.bind(this)});
	
	/*
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
	*/

	this.populatePanel = function(panel) {
		this.dataRequest[panel].each(function(element) {
		
			if (panel == 'funds') {
				var panelId = document.id('fund');
			} else if (panel == 'departments') {
				var panelId = document.id('department');
			} else if (panel == 'categories') {
				var panelId = document.id('category');
			}
			
			var elementSplit = element.split(":");
			
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
					if ((!panelId.hasClass('selected')) && (!this.hasClass('disabled'))) {
						selectionRequest.get(data);
						this.addClass('colorkey selected');
						panelId.addClass('selected');
					}
					
			};
			

			if ((elementSplit[0]) && (!elementSplit[1])) {
				var panelLi = new Element('li', { class: ''+elementSplit[0].replace(/ /g, '')+'' });
				var panelSpan = new Element('span', { html: elementSplit[0] });
				
				panelSpan.set('itemIdentifier', element);
				panelSpan.addEvent('click', panelLiClickFunction);			
				panelId.appendChild(panelLi);
				panelLi.appendChild(panelSpan);

			} else if (element[1]) {
				var panelUl = new Element('ul');
				var panelLi = new Element('li', { class: ''+elementSplit[1].replace(/ /g, '')+'' });
				var panelSpan = new Element('span', { html: elementSplit[1] });
				
				panelSpan.set('itemIdentifier', element);
				panelSpan.addEvent('click', panelLiClickFunction);
				
				var subItem = panelId.getElement('li.'+elementSplit[0].replace(/ /g, '')+'');
				subItem.appendChild(panelUl);
				panelUl.appendChild(panelLi);
				panelLi.appendChild(panelSpan);
			}	
		}.bind(this));
	};
}

document.addEvent('domready', function() { new panelData(); });
