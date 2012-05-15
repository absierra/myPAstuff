//global js here
function panelData(){

	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', onSuccess: function(data){
        this.dataRequest = data.data;
	    this.populatePanel('funds');
		this.populatePanel('departments');
		var target = document.getElement('.DebtServiceFunds span');
        if(target) target.fireEvent.delay(200, target, ['click']);
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
            if (data.funds.contains(listItem.retrieve('itemIdentifier'))) listItem.removeClass('disabled');
            else listItem.addClass('disabled');
		});
        document.getElements('#department li span').each(function(listItem){
            if (data.departments.contains(listItem.retrieve('itemIdentifier'))) listItem.removeClass('disabled');
            else listItem.addClass('disabled');
		});
	}
	
	var selectGraph = function(type, legals){
	    if(legals){
	        //todo: enable/disable graphs
	    }
	    switch(type){
	        case 'fund':
	            window.graphTabs.showSlide(0);
	            break;
	        case 'department':
	            window.graphTabs.showSlide(1);
	            break;
	        case 'expenditure':
	            window.graphTabs.showSlide(2);
	            break;
	        case 'revenue':
	            window.graphTabs.showSlide(3);
	            break;
	        case 'fee_revenue':
	            window.graphTabs.showSlide(4);
	            break;
	        case 'expenditure_vs_fee_revenue':
	            window.graphTabs.showSlide(5);
	            break;
	    }
	}

	var selectionRequest = new Request.JSON({url : '/data/categorization_dependencies', onSuccess: function(payload){
        var dataSelect = payload.data;
        switch(window.lastSelectedColumn){
            case 'fund':
                
                selectGraph('fund');
                break;
            case 'department':
                
                selectGraph('department');
                break;
        }
        panelFilter(payload.data);
        // remove color key from all items
        document.getElements('span.colorkey').removeClass('colorkey');
        // add color key to all active items in the selected column
        var column = document.id(window.lastSelectedColumn);
        if(column){
            column.getElements('ul li span:not(.disabled)').addClass('colorkey');
        }
	}.bind(this)});
	
    window.selected = {};
	this.populatePanel = function(panel) {
		this.dataRequest[panel].each(function(element) {
            var parts = element.split(":");
            var index;
			switch (panel){
				case 'funds' : index = 'fund'; break;
				case 'departments' : index = 'department'; break;
			}
			var panelId = document.id(index);
			var panelSpanClickFunction = function(event) {
                    if (panelId.hasClass('panelSelected')) window.selected = {};
                    window.selected[index] = panelSpan.retrieve('itemIdentifier');
                    window.lastSelectedColumn = index;
                    window.lastSelectedItem = element;
                    panelId.getElements('.selected').removeClass('selected');
                    document.getElements('.colorkey').removeClass('colorkey');
                    this.addClass('colorkey selected');

                    selectionRequest.get(window.selected);
                    if(window.graphs[index]) window.graphs[index].fetch(window.selected, index);
			};
			var name = (parts.length == 1)?parts[0]:parts[1];
			var panelLi = new Element('li', { class: ''+name.replace(/ /g, '')+'' });
            var panelSpan = new Element('span', { html: name });
            panelSpan.store('itemIdentifier', element);
            panelSpan.addEvent('click', panelSpanClickFunction);			
            panelLi.appendChild(panelSpan);
			if(parts.length == 2){ //2nd level
			    var ul = panelId.getElement('.sublist.'+parts[0]);
			    if(!ul){
			        ul = new Element('ul', {
			            class: 'sublist '+parts[0]
			        });
			        panelId.appendChild(ul);
			    }
			    ul.appendChild(panelLi);
			}else{ //top level
			    panelId.appendChild(panelLi);
			}
		}.bind(this));
	};
}

document.addEvent('domready', function() { 
    window.graphTabs = new MGFX.Tabs('#tabs .tab', '#graph_types .graph');
    new panelData();
});
