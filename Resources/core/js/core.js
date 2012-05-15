//global js here
function panelData(){

	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', onSuccess: function(data){
        this.dataRequest = data.data;
	    this.populatePanel('funds');
		this.populatePanel('departments');
		//this.populatePanel('categories');
        document.getElements('.DebtServiceFunds span')[0].fireEvent('click');
	}.bind(this)}).get();
	
	var keys = new Keyboard({
	    defaultEventType: 'keyup',
	    events: {
	        'esc': function(){
				document.id('fund').removeClass('selected');
				document.getElements('#fund li span').each(function(item){
					item.removeClass('colorkey').removeClass('selected').removeClass('highlight').removeClass('disabled');
				});
	        }
	     }
	});
	
	var panelFilter = function(data) {
        
        document.getElements('#fund li span').each(function(listItem){

            if (listItem.getParent('ul #fund').hasClass('panelSelected')) {
                 var tabs = new MGFX.Tabs('#tabs .tab', '#graph_types .graph').showSlide(0);
            }

            var listItemValue = listItem.retrieve('itemIdentifier');
            var listItemClass = listItemValue.replace(/ /g, '');
            var listItemMatch = listItemValue.match(/\:/);
            
            if (listItemMatch != null) { 
                listItemSplit = listItemClass.split(':');
                listItemClass = listItemSplit[0];
            }
            if (data.funds.contains(listItemValue)){
                document.getElement('#fund li.'+listItemClass+' span').removeClass('disabled').removeClass('colorkey');
                if (listItem.getParent('ul #fund').hasClass('panelSelected')) {
                    listItem.addClass('colorkey');
                    listItem.removeClass('disabled');
                }
			} else {
                listItem.addClass('disabled');
			}
		});
        document.getElements('#department li span').each(function(listItem){

            if (listItem.getParent('ul #department').hasClass('panelSelected')) {
                 var tabs = new MGFX.Tabs('#tabs .tab', '#graph_types .graph').showSlide(1);
            }

            var listItemValue = listItem.retrieve('itemIdentifier');
            var listItemClass = listItemValue.replace(/ /g, '');
            var listItemMatch = listItemValue.match(/\:/);
            
            if (listItemMatch != null) { 
                listItemSplit = listItemClass.split(':');
                listItemClass = listItemSplit[0];
            }
    
           if (data.departments.contains(listItemValue)){
                document.getElement('#department li.'+listItemClass+' span').removeClass('disabled').removeClass('colorkey');
                if (listItem.getParent('ul #department').hasClass('panelSelected') && !listItem.hasClass('disabled') ) {
                    listItem.addClass('colorkey');
                }
			} else {
                listItem.addClass('disabled');
			}
            
		});
        /*
        document.getElements('#category li span').each(function(listItem){

            if (listItem.getParent('ul #category').hasClass('panelSelected')) {
                 var tabs = new MGFX.Tabs('#tabs .tab', '#graph_types .graph').showSlide(2);
            }

            var listItemValue = listItem.retrieve('itemIdentifier');
            var listItemClass = listItemValue.replace(/ /g, '');
            var listItemMatch = listItemValue.match(/\:/);
            
            if (listItemMatch != null) { 
                listItemSplit = listItemClass.split(':');
                listItemClass = listItemSplit[0];
            }
    
           if (data.categories.contains(listItemValue)){
                document.getElement('#category li.'+listItemClass+' span').removeClass('disabled').removeClass('colorkey');
                if (listItem.getParent('ul #category').hasClass('panelSelected')) {
                    listItem.addClass('colorkey');
                }
			} else {
                listItem.addClass('disabled');
			}
            
		});
        */
	}

	var selectionRequest = new Request.JSON({url : '/data/categorization_dependencies', onSuccess: function(data){
        var dataSelect = data.data;
        panelFilter(data.data);
	}.bind(this)});
	
    window.selected = {};
	this.populatePanel = function(panel) {
		this.dataRequest[panel].each(function(element) {
            var elementSplit = element.split(":");
            var panelColumn = 0;
            var index;
            var panelId;
			switch (panel){
				case 'funds' : panelColumn = 0; index = 'fund'; panelId = document.id(index); break;
				case 'departments' : panelColumn = 1; index = 'department'; panelId = document.id(index); break;
            //  case 'categories' : panelColumn = 2; index = 'category'; panelId = document.id(index); break;
			}
			
			var panelSpanClickFunction = function(event) {
                    if (panelId.hasClass('panelSelected')) {
                        window.selected = {};
                        window.selected[index] = panelSpan.retrieve('itemIdentifier');
                    } else {
                        document.getElements('.panelSelected').removeClass('panelSelected');
                        panelId.addClass('panelSelected');
                        window.selected[index] = panelSpan.retrieve('itemIdentifier');
                    }

                    panelId.getElements('.selected').removeClass('selected');
                    document.getElements('.colorkey').removeClass('colorkey');
                    this.addClass('colorkey selected');

                    selectionRequest.get(window.selected);
                    if(window.graphs[index]) window.graphs[index].fetch(window.selected, index);
			};
			
			if ((elementSplit[0]) && (!elementSplit[1])) {
				var panelLi = new Element('li', { class: ''+elementSplit[0].replace(/ /g, '')+'' });
				var panelSpan = new Element('span', { html: elementSplit[0] });
				
				panelSpan.store('itemIdentifier', element);
				panelSpan.addEvent('click', panelSpanClickFunction);			
				panelId.appendChild(panelLi);
				panelLi.appendChild(panelSpan);

			} else if (element[1]) {
				var panelUl = new Element('ul');
				var panelLi = new Element('li', { class: ''+elementSplit[1].replace(/ /g, '')+'' });
				var panelSpan = new Element('span', { html: elementSplit[1] });
				
				panelSpan.store('itemIdentifier', element);
				panelSpan.addEvent('click', panelSpanClickFunction);
				
				var subItem = panelId.getElement('li.'+elementSplit[0].replace(/ /g, '')+'');
				subItem.appendChild(panelUl);
				panelUl.appendChild(panelLi);
				panelLi.appendChild(panelSpan);
			}	
		}.bind(this));
	};
}

document.addEvent('domready', function() { 
    var tabs = new MGFX.Tabs('#tabs .tab', '#graph_types .graph');
    new panelData();
});
