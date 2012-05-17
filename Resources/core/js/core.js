//global js here
Array.implement({
  shuffle: function() {
    //destination array
    for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
  }
});
var PseudoDOM = {};
PseudoDOM.pseudo = function(element, properties, pseudo){
    var id = element.getAttribute('id');
    if(!id){
        id = 'pseudo-chop-'+Math.floor(Math.random()*6000);
        element.setAttribute('id', id);
    }
    var style = document.getElementById(id+'-rule');
    if(!style){
        style = new Element('style', {
            id : id+'-rule',
            class : 'pseudo-chop'
        });
    }
    var css = '#'+id+'::'+pseudo+'{\n';
    Object.each(properties, function(value, key){
        css += key+' : '+value+';\n';
    });
    css += '}';
    style.innerHTML = css;
    style.inject(document.head);
};
PseudoDOM.before = function(element, properties){
    return PseudoDOM.pseudo(element, properties, 'before');
};
PseudoDOM.after = function(element, properties){
    return PseudoDOM.pseudo(element, properties, 'after');
};
PseudoDOM.clear = function(element, properties){
    document.getElements('.pseudo-chop').destroy();
};

function hueShiftedColorSet(){
    var args = {};
    var arg;
    for(var lcv=0; lcv < arguments.length; lcv++){
        arg = arguments[lcv];
        if(typeOf(arg) == 'number') args.num = arg;
        else if(
            typeOf(arg) == 'array' ||
            (typeOf(arg) == 'string' && arg.match(/#?[0-9A-F]{6}/))
        ) args.color = arg;
        else if(typeOf(arg) == 'string') args.result = arg;
    };
    if(!args.num) args.num = 5;
    if(!args.color) args.color = '#00AEFF';
    var result = [];
    for(var lcv=0;lcv<args.num;lcv++){
        var newColor = new Color(args.color);
        var newColor = (newColor).setHue((newColor.hsb[0]+(359/args.num)*lcv)%359);
        if(args.result)result.push(newColor[args.result]);
        else result.push(newColor);
    }
    return result;
}

function panelData(){
	var dataRequest = new Request.JSON({url : '/data/unique_categorizations', onSuccess: function(data){
        this.dataRequest = data.data;
	    this.populatePanel('funds');
		this.populatePanel('departments');
		var target = document.getElement('.EnterpriseFunds span');
        if(target) target.fireEvent.delay(200, target, ['click']);
	}.bind(this)}).get();
    	
	var keys = new Keyboard({
	    defaultEventType: 'keyup',
	    events: {
	        'esc': function(){    
                window.selected = {};            
                document.getElements('.selected').removeClass('selected');
                document.getElements('.colorkey').removeClass('colorkey');
                document.getElements('.disabled').removeClass('disabled');
                document.getElements('.expanded').removeClass('expanded');
                var sublist = document.getElements('li ul.sublist');
                if ((sublist) && (sublist.hasClass('expanded'))) {
                    sublist.set('morph', { unit:'px' });
                    sublist.morph({height:0});
                    sublist.removeClass('expanded');
                }
                var target = document.getElement('.EnterpriseFunds span');
                if(target) target.fireEvent.delay(200, target, ['click']);
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
	
	var selectGraph = function(type, hexColors, legals){
	    if(legals){
	        //todo: enable/disable graphs
	    }
        //return;
	    switch(type){
	        case 'fund':
                window.graphs.fund.setColors(hexColors);
                //window.graphs.fund.display();
	            window.graphTabs.showSlide(0);
	            break;
	        case 'department':
                window.graphs.department.setColors(hexColors);
                //window.graphs.department.display();
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
        panelFilter(payload.data);
        // remove color key from all items
        document.getElements('span.colorkey').removeClass('colorkey');
        // add color key to all active items in the selected column
        var column = document.id(window.lastSelectedColumn);
        if(column){
            var columnNotDisabled = column.getElements('ul li span:not(.disabled)');
            columnNotDisabled.addClass('colorkey');
        }
        var hexColors = hueShiftedColorSet(columnNotDisabled.length, 'hex').shuffle();
        columnNotDisabled.each(function(item, lcv){
            PseudoDOM.before(item, {
                'background-color' : hexColors[lcv]
            })
        });
        switch(window.lastSelectedColumn){
            case 'fund':
                
                selectGraph('fund', hexColors);
                break;
            case 'department':
                
                selectGraph('department', hexColors);
                break;
        }

	}.bind(this)});
	
    window.selected = {};
	this.populatePanel = function(panel) {
		this.dataRequest[panel].each(function(element) {
            var parts = element.split(":");
            var index;
			switch (panel){
				case 'funds' : index = 'fund', selectedPanel = 'funds'; break;
				case 'departments' : index = 'department', selectedPanel = 'funds'; break;
			}
			var panelId = document.id(index);
            
			var panelSpanClickFunction = function(event) {
                if (panelId.hasClass('panelSelected')) window.selected = {};
                window.selected[index] = panelSpan.retrieve('itemIdentifier');
                window.lastSelectedPanel = selectedPanel;
                window.lastSelectedColumn = index;
                window.lastSelectedItem = element;
                panelId.getElements('.selected').removeClass('selected');
                document.getElements('.colorkey').removeClass('colorkey');
                this.addClass('selected');
                this.getElements('a').addClass('expanded');
                sublist = this.getParent('li ul.sublist');
                sublistHeight = sublist.getScrollSize();
                sublist.morph({height:sublistHeight.y});
                selectionRequest.get(window.selected);
                if(window.graphs[index]) window.graphs[index].fetch(window.selected, index);
			};
            var panelArrowClickFunction = function(event) {
                var expanded = this.getParent('li span a')
                var sublist = this.getParent('li ul.sublist');
                    if (!expanded.hasClass('expanded')) { // expand item
                        sublistHeight = sublist.getScrollSize();
                        sublist.morph({height:sublistHeight.y});
                        expanded.addClass('expanded');
                    } else { // collapse item
                        sublist.morph({height:0});
                        expanded.removeClass('expanded');
                    }
                event.stopPropagation();
            };

            var name = (parts.length == 1)?parts[0]:parts[1];
            //notice there are the same lines in both these branches: fix me
            if (parts.length == 1) { //top level
       			var panelLi = new Element('li', { class: parts[0].replace(/ /g, '') });
                var panelSpan = new Element('span', { html: name });
                var panelArrow = new Element('a');
                panelSpan.store('itemIdentifier', element);
                panelSpan.addEvent('click', panelSpanClickFunction);
                panelArrow.addEvent('click', panelArrowClickFunction);
                panelSpan.appendChild(panelArrow);
                panelLi.appendChild(panelSpan);
                panelId.appendChild(panelLi);
            } else { // 2nd level
                var panelSet = panelId.getElement('li.'+parts[0].replace(/ /g, ''));
                var panelUl = panelId.getElement('li.'+parts[0].replace(/ /g, '')+' ul');
                var panelLi = new Element('li', { class: parts[1].replace(/ /g, '') });
                var panelSpan = new Element('span', { html: name });
                panelSpan.store('itemIdentifier', element);
                panelSpan.addEvent('click', panelSpanClickFunction);		
                 if(!panelUl){
			        panelUl = new Element('ul', {
			            class: 'sublist'
			        });
			        panelSet.appendChild(panelUl);
			    }
                panelLi.appendChild(panelSpan);
                panelUl.appendChild(panelLi);
                panelSet.appendChild(panelUl);
            }
            /*var name = (parts.length == 1)?parts[0]:parts[1];
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
			}*/
		}.bind(this));
	};
}

document.addEvent('domready', function() { 
    window.graphs = {};
    window.graphs.fund = new BudgetGraph('fund_graph', {
        type : 'fund'
    });
    window.graphs.department = new BudgetGraph('department_graph', {
        type : 'department'
    });
    new panelData();
    window.graphTabs = new MGFX.Tabs('#tabs .tab', '#graph_types .graph');
});

