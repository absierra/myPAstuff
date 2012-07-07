var BudgetGraph = new Class({
   Implements: Options,
   options: {
       color: '#fff',
       size: {
           width: 100,
           height: 100
       },
       type : 'none',
       dataset : 'test',
       target : false,
       name : 'Debt Service Funds',
       //we really need to switch graph types to 1 option, rather than a bunch of weirdly intersecting booleans
       stacked : false,
       percent : false,
       bar : false,
       pie : false,
       metric : 'revenue'
   },
   initialize : function(element, options){
   		//CITY SWITCH
   	   if(window.city == 'palo_alto' || window.city == 'salinas' || window.city == 'saratoga'){
   	   		var lastYear = '2013';
   	   }
   	   else if(window.city == 'lafayette'){
   	   		var lastYear = '2012';
   	   }
       this.element = element;
       this.setOptions(options);
       if(!this.options.requestor) this.options.requestor = new Request.JSON({
           url: '/data/graph',
           onRequest: function(){
              BudgetGraph.timer(1);
           },
           onComplete: function(){
              BudgetGraph.timer(-1);
           },
           onSuccess: function(payload){
               this.data = payload.data;
               var column = document.id(this.options.column);
               var keys = Object.keys(this.data);
			   this.displayOrder = []; //The short name
			   this.dataOrder = []; //The full ':' delimited name
			   if(this.options.target != 'category'){
				   if(column){
						var isSelected = column.getElement('li span.selected');
						if(isSelected){
							elements = column.getElements('ul li span:not(.disabled)');
						}else {
							elements = column.getElements('> li > span:not(.disabled)');
						}
						result = [];
						elements.each(function(el){
							var notags = el.get('text');
							keys.each(function(value){
								var displayValue = value.split(':').pop();
								if(displayValue === notags){
									this.dataOrder.push(value);
									this.displayOrder.push(displayValue);
									keys.erase(notags);
								}
							}.bind(this));
						}.bind(this));
					}
				   this.dataOrder =  Object.merge(keys,this.dataOrder);
	
					// ♪♫ In the ghetto... ♫♪
				   this.displayOrder =  Object.merge(keys.map(function(value){return value.split(':').pop()}),this.displayOrder);
			   }
			   else{
			   		data = this.data;
					var dataOrderTemp = [];
					var displayOrderTemp = [];
					var metric = this.options.metric;
					b=this;
			   		Object.each(this.data, function(value, key){
			   		try
					  {
					  	if(data[key][lastYear][metric] || data[key][lastYear][metric] === 0){
			   				b.dataOrder.push(key);
			   				b.displayOrder.push(key);
			   			}
					  }
					catch(err)
					  {
					  	console.log(data);
					  	console.log(key);
					  	console.log(lastYear);
					  }		
			   		});
			   }
               if(this.options.target == 'revenue_expense'){
        			this.colors = hueShiftedColorSet(2, ['Expenses', 'Revenues']);
               }
               else if(this.options.target == 'category'){
            		var categories = [];
                    var metric = this.options.metric;
                    data = this.data;
                    Object.each(this.data, function(value, key){
                        if(data[key][lastYear][metric] || data[key][lastYear][metric] === 0) categories.push(key);
                    });
                    this.colors = hueShiftedColorSet(0, categories);
               }
               else{
                    this.colors = hueShiftedColorSet(Object.getLength(this.data));
				}
				this.setColors(this.colors);
		   
				this.fetching = false;
				if(this.setKeysOnLoad){
					this.setKeys();
					this.setKeysOnLoad = false;
				}
               if(this.setLegendOnLoad){
                   this.setLegend();
                   this.setLegendOnLoad = false;
               }
               if(this.fetchCallback){
                   this.fetchCallback(this.data);
                   delete this.fetchCallback;
               }
               if(window.currentGraph == this){
                       this.setKeys();
                       this.setLegend();
               }
               this.legendItems = this.getLegendItems();
               this.display();
               //this.options.watch('column', function(){
               //		throw('THERE HAS BEEN A CHANGE');
               //})
           }.bind(this)
       });
       if(this.options.id) BudgetGraph.graphs[this.options.id] = this;
       if(this.options.select) this.options.select = this.options.select.bind(this)
           this.raphael = Raphael(element);
       //a = this; //?
   },
   fetch : function(data, type, callback){
       if(typeOf(type) == 'function'){
           callback = type;
           delete type;
       }
       if(type) this.options.type = type;
       var requestData = Object.clone(data);
       BudgetGraph.lastSelection = requestData;
       BudgetGraph.lastSelectionType = this.options.type;
       requestData.type = this.options.type;
       if(this.options.target) requestData.target = this.options.target;
       requestData.dataset = this.options.dataset;
       this.fetching = true;
       this.displayOrder = []; //The short name
               this.dataOrder = []; //The full ':' delimited name
       this.options.requestor.get(requestData);
       if(callback) this.fetchCallback = callback;
   },
   setColors : function(colors) {
       this.options.colors = colors;
   },
   select : function(colors) {
       window.selectedGraph = this;
       this.setLegend();
       this.setKeys();
   },
   getKeyElements : function(){
       var column = document.id(this.options.column);
       if(column){
           var isSelected = column.getElement('li span.selected');
           if(isSelected){
               return column.getElements('ul li span:not(.disabled)');
           }else {
               return column.getElements('> li > span:not(.disabled)');
           }
       }else return [];
   },
   getLegendItems : function(){
   		//CITY SWITCH
   	   if(window.city == 'palo_alto' || window.city == 'salinas' || window.city == 'saratoga'){
   	   		var lastYear = '2013';
   	   }
   	   else if(window.city == 'lafayette'){
   	   		var lastYear = '2012';
   	   }
       var keys = [];
       target = this.options.target;
       metric = this.options.metric;

       var index = 0;
        
       Object.each(this.data, function(value, key){
		   key = key.indexOf(":")==-1?key:key.split(":")[1];
		   if(target == 'category'){

				if(value[lastYear][metric] != undefined){
					keys.push(key);
				}
		   }
		   else{
				keys.push(key);
		   }
       });


       if(target != 'category' && target != 'revenue_expense'){
			var result = [];
			var column = document.id(this.options.column);
			var elements;
			if(column){
				   var isSelected = column.getElement('li span.selected');
				   if(isSelected){
						elements = column.getElements('ul li span:not(.disabled)');
				   }else {
						elements = column.getElements('> li > span:not(.disabled)');
				   }
				   result = [];
				   elements.each(function(el){
					   notags = el.get('text');
					   if(keys.contains(notags)){
							   result.push(notags);
							   keys.erase(notags);
					   }
				   });
			}
			this.legendItems = result;
			return result;
        }else{
        	this.legendItems = keys;
        	return keys;
        }
   },
   setKeys : function(){
       if(this.fetching){
           this.setKeysOnLoad = true;
           return;
       }
       BudgetGraph.clearKeys();
       activeItems = this.getKeyElements();
       if(activeItems.length == 0) return;
       if(activeItems.length != this.colors.length){
           this.colors = hueShiftedColorSet(Object.getLength(this.data));
       }
       activeItems.each(function(item, lcv){
           item.addClass('colorkey');
           PseudoDOM.before(item, {
               'background-color' : this.colors[lcv]
           });
       }.bind(this));
   },
   setLegend : function(){
       if(this.fetching){
           this.setLegendOnLoad = true;
           return;
       }
       var column = document.id(this.options.column);
       var legendElement = document.getElement('#legend');
		

		//this is to deal with the mouse moving too fast, so that we clear the tooltip if it enters the legend area
	   var DIVelement = document.getElement('#secondLevelMouseOver');
	   legendElement.addEvent('mouseenter', function(){
			DIVelement.set('html', '');
			if (!DIVelement.hasClass('hidden'))
			{
				DIVelement.setStyle('display', 'none');
				DIVelement.addClass('hidden');
				document.getElements('#legend li span').each(function(legendSpan){
					legendSpan.setStyle('opacity', '1');
				});
			}
	   });
	   var graphElement = document.getElement('#graphs');
	   graphElement.addEvent('mouseenter', function(){
			DIVelement.set('html', '');
			if (!DIVelement.hasClass('hidden'))
			{
				DIVelement.addClass('hidden');
				DIVelement.setStyle('display', 'none');
				document.getElements('#legend li span').each(function(legendSpan){
					legendSpan.setStyle('opacity', '1');
				});
			}
	   });
	   
	   var contentElement = document.getElement('#content');
	   contentElement.addEvent('mouseover', function(){
			DIVelement.set('html', '');
			if (!DIVelement.hasClass('hidden'))
			{
				DIVelement.addClass('hidden');
				DIVelement.setStyle('display', 'none');
				document.getElements('#legend li span').each(function(legendSpan){
					legendSpan.setStyle('opacity', '1');
				});
			}
	   });
       legendElement.getElements('li').destroy();
       var items = this.getLegendItems();//this.getLegendItems();
       if(items.length > this.colors.length){
           this.colors = hueShiftedColorSet(items.length);
       }
       if(items && items.length > 0){
               //items.sort();
           items.each(function(item, lcv) {
            	// this next line added by Arthur so that it could be used in the legendItem.addevent('mouseenter' function below (2012-06-15)
                var legendDotColor = this.colors[lcv];

               var legendItem = new Element('span', {
                   html : item
               });
               PseudoDOM.before(legendItem, {
                   'background-color' : this.colors[lcv]
               });
               var legendLi = new Element('li');
               legendElement.appendChild(legendLi);
               legendLi.appendChild(legendItem);

			   // this is how we're going to show the text hidden by the ellipses (see a similar function in core.js for items in the columns that are too long)
			   legendItem.addEvent('mouseenter', function(e){
					   mouseoverDIVpos = this.getParent().getPosition();

					   var DIVelement = document.getElement('#secondLevelMouseOver');

					   // like in the columns, we need to start with a clean slate in case mouse movements happen too fast
					   DIVelement.set('html', '');
					   DIVelement.addClass('hidden');

					   var newSpan = this.clone().inject('secondLevelMouseOver', 'bottom');
					   var legendDot = new Element('div', {
							   styles: {
									   'position': 'absolute',
									   'left': '9px',
									   'top': '5px',
									   'content': '',
									   'display': 'block',
									   'height': '24px',
									   'width': '5px',
									   'z-index': '500',
									   'background-color': legendDotColor
							   }
					   });

					   legendDot.inject(DIVelement, 'bottom');

					   newSpan.setStyles(this.getStyles('color', 'margin', 'padding', 'font-size', 'display', 'position')); // might need to copy over a few more styles here
					   newSpan.setStyles({
							   'background-color': 'transparent',
							   'height': 'auto',
							   'line-height': '0.9em',
							   'width': 'auto',
							   'margin': '0px',
							   'padding': '0px 10px 0px 0px',
							   'cursor': 'default',
							   'top': '3px',
							   'left': '-1px',
							   'opacity': '1'
					   });
						DIVelement.removeClass('hidden');
					   DIVelement.setStyles(this.getParent().getStyles('background-color', 'color', 'margin', 'padding'));
					   DIVelement.setStyles({
							   'background-color': '#3B3B3C',
							   'opacity': '0.9',
							   'height': '24px',
							   'width': 'auto',
							   'margin': '0px',
							   'padding': '5px 0px 5px 24px',
							   'cursor': 'default',
							   'border': '1px solid #808285'
					   });
					   
					   document.getElements('#legend li span').each(function(legendSpan){
							legendSpan.setStyle('opacity', '0.3');
					   });

					   DIVelement.setStyles({
							   'display': 'block',
							   'top': (mouseoverDIVpos.y - 1),
							   'left': (mouseoverDIVpos.x - 10)
					   });

					   DIVelement.addEvent('mouseleave', function(){
							   this.set('html', '');
							   this.setStyle('display', 'none');
							   document.getElements('#legend li span').each(function(legendSpan){
									legendSpan.setStyle('opacity', '1');
								});
					   });


					   e.stop();
			   });
           }.bind(this));
           legendElement.reveal();
       }else{
           legendElement.dissolve();
       }
       var legendElements = document.getElements('#legend li span');
       legendElements.each(function(item, lcv){
           PseudoDOM.before(item, {
               'background-color' : this.colors[lcv]
           })
       }.bind(this));
   },
   display : function(metric){
       this.raphael.clear();
       if(!metric) metric = this.options.metric;
       xSet = [];
       ySet = [];
               var key;
               switch(this.options.type){
                       case 'fund': key = 'funds'; break;
                       case 'category': key = 'categories'; break;
                       case 'department': key = 'departments'; break;
               }


       var keys;
        this.dataOrder.each(function(name){
           var xs = [];
           var ys = [];

           if( (!keys) || this.data[name].length > keys.length) keys = Object.keys(this.data[name]);//.sort();
           keys.each(function(key){
               if(this.data[name][key][metric] != undefined){
                   xs.push(key);
                   var v;
                   if(this.data[name][key] && this.data[name][key][metric]) v = this.data[name][key][metric];
                   else v = 0;
                   ys.push(v);
               }
        }.bind(this));
        if(ys.length != 0){
            xSet.push(xs);
            ySet.push(ys);
        }
       }.bind(this)); //*/
               if(this.options.mode == 'bar'){
				   this.lines = this.raphael.barchart(75, 10, 570, 400, xSet, ySet, {
						   shade: true,
						   nostroke: false,
						   axis: "0 0 1 1",
						   colors:this.colors
				   });
               }else if (this.options.mode == 'pie'){
                       //window.totalChartValue = 0;
                       var graphSize = document.id('graphs').getScrollSize();
                       var xGraph = graphSize.x / 2 - 45;
                       var yGraph = graphSize.y / 2 - 20;
                       var totalValues = [];
                       var yearValues = [];
                       var year = this.options.year;
                       var yearKey;
                       this.availableYears = [];
                       xSet.each(function(yearsArray) {
                               yearsArray.each(function(value, key) {
                                       if (year == value) yearKey = key;
                                       if (!this.availableYears.contains(value)) this.availableYears.push(value);
                               }.bind(this));
                               BudgetGraph.LastSelectionYearsData = this.availableYears.sort();
                       }.bind(this));

                       if (year) {
                               ySet.each(function(arraySet, key) {
                                       val = arraySet[yearKey];
                                       val && totalValues.push(arraySet[yearKey]*1000);
                               });
                       } else {
                               ySet.each(function(arraySet, key) {
                                       var val = arraySet.pop()
                                       val && totalValues.push(arraySet.pop()*1000);
                               });
                       }
                       var a = this;
                       if(ySet.length != 0){
                               this.lines = this.raphael.piechart(xGraph, yGraph + 20, yGraph, totalValues, {
                                       shade: true,
                                       nostroke: false,
                                       axis: "0 0 1 1",
                                       axisxstep : 4,
                                       colors:this.colors,
                                       stacked:this.options.stacked,
                                       percent:this.options.percent,
                                       names: this.displayOrder
                               }).hover(function () {
                                   //this.sector.stop();
                                   //this.sector.scale(1.1, 1.1, this.cx, this.cy);
                                   var amountText;
                                   if (a.options.dataset == 'financial') {
                                       amountText = '$' + addCommas(this.value/1000);
                                   } else {
                                       amountText = addCommas(this.value/1000) + ' Employees';
                                   }
                                   var nameText = a.displayOrder[this.value.order] || '';
                                   var yearText = (year || yearKey) ? ('Year: ' + year) : '';

                                   text =  nameText + '\n' + yearText + '\n\n' + amountText;


                                   if (!this.marker) {
                                       this.marker = a.raphael.popup(this.mx, this.my, text, "up", 5);
                                   }
                                   this.marker.show();
                               },function (){
                                       this.marker.hide();
                                       //this.sector.animate({transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, 'bounce');
                               });
                       }else{ //zero data
                       		var graphSize = document.id('graphs').getScrollSize();
                       		var xGraph = graphSize.x - 240;
                       		var yGraph = graphSize.y - 41;
               				a.raphael.rect(xGraph - graphSize.x / 2 + 100, yGraph - graphSize.y / 2, 50, 50, 10).attr({
                  				stroke: "#A7A7A7",
                				fill: "#414042",
                				opacity: .6,
                   				height: 75,
                   				width: 200
               				});
               				a.raphael.text(xGraph - graphSize.x / 2 + 200, yGraph - graphSize.y / 2 + 37, 'This Selection Has No Data').attr({
                   				fill: "#FFF",
                   				'font-size': 13,
                   				'font-weight': 'bold'
               				});
                            //BudgetGraph.clearLegend();
                       }
               }else{
                       // this means we're doing a line or stacked graph
                       var graphSize = document.id('graphs').getScrollSize();
                       var xGraph = graphSize.x - 240;
                       //if (xGraph > 600) xGraph = 600;
                       var yGraph = graphSize.y - 61;
                       var a = this;
                       var steps = 0;
                       //CITY SWITCH
                       if(window.city == 'palo_alto' || window.city == 'salinas' || window.city == 'saratoga'){
                       		steps = 4;
                       }else if(window.city == 'saratoga'){
                       		steps = 5;
                       }else if(window.city == 'lafayette'){
                       		steps = 6;
                       }
                       if(ySet.length != 0){
								// the second parameter below, the y coordinate of the center (25 as of 2012-06-25) was modified from "20" to stop tooltips from being clipped. this doesn't seem to create any other spacing issues.
                               this.lines = this.raphael.linechart(75, 25, xGraph, yGraph, xSet, ySet, {
                                       shade: (this.options.mode == 'stacked-line' || this.options.mode == 'percentage-line'),
                                       nostroke: false,
                                       axis: "0 0 1 1",
                                       axisxstep : steps,
                                       colors:this.colors,
                                       stacked:(this.options.mode == 'stacked-line' || this.options.mode == 'percentage-line'),
                                       percent:(this.options.mode == 'percentage-line'),
                                       names: this.displayOrder//getLegendItems()
                               }).hover(function() {
                                   var text = this.name+'\nYear: '+this.year +'\n\n'+(a.options.dataset == 'financial'?'$'+addCommas(this.value):addCommas(this.value)+' Employees');
                                   if (a.options.mode == 'percentage-line') {
                                       text += '\n' + this.percent.toFixed(2) + ' %';
                                   }
                                   if (a.options.mode == 'stacked-line') {
                                       if (this.cumulativeTotal) {
                                          text += '\n\n Total: $' + addCommas(Math.floor(this.cumulativeTotal));
                                       }
                                   }

                                   //this.attr("opacity",1);
                                   this.marker = this.marker || a.raphael.popup(this.x + (this.x > xGraph * 4/5 ? -7 : 7), this.y, text, (this.x > xGraph * 4/5 ? "left" : "right"), 5).insertAfter(this).toFront();
								   console.log(this.marker[0]);
								   // 2012-06-26 by Arthur: the insertAfter(this) in the line above causes dots drawn on the canvas after the dot that's being hovered over to come out on top of the tooltip. perhaps the insertAfter should take the last dot as a parameter. the addition of "toFront()" brings it to the front.
                                   this.marker.show();
                                   this.scale(1.75, 1.75, this.x, this.y);
                               }, function() {
                                   // hide the popup element with an animation and remove the popup element at the end
                                   //this.attr("opacity",0);
                                   this.marker && this.marker.hide();
                                   this.animate({transform: 's1 1 ' + this.x + ' ' + this.y }, 150);
                                   }
                               );
                       }
                       else{ //zero data
               				a.raphael.rect(xGraph - graphSize.x / 2 + 100, yGraph - graphSize.y / 2, 50, 50, 10).attr({
                   				stroke: "#A7A7A7",
                   				fill: "#414042",
                   				opacity: .6,
                   				height: 75,
                   				width: 200
               				});
               				a.raphael.text(xGraph - graphSize.x / 2 + 200, yGraph - graphSize.y / 2 + 37, 'This Selection Has No Data').attr({
                   				fill: "#FFF",
                   				'font-size': 13,
                   				'font-weight': 'bold'
               				});				
                            //BudgetGraph.clearLegend();
                       }
               }
       }
})

function addCommas(nStr)
{
       nStr += '';
       x = nStr.split('.');
       x1 = x[0];
       x2 = x.length > 1 ? '.' + (x[1].length == 1 ? x[1] + '0' : x[1]) : '';
       var rgx = /(\d+)(\d{3})/;
       while (rgx.test(x1)) {
               x1 = x1.replace(rgx, '$1' + ',' + '$2');
       }
       return x1 + x2;
}

BudgetGraph.LastSelectionYearsData = {};
BudgetGraph.lastSelection = {};
BudgetGraph.graphs = {};
BudgetGraph.clearLegend = function(){
   var legendElement = document.getElement('#legend');
   legendElement.getElements('li').destroy();
   legendElement.dissolve();
};
BudgetGraph.clearKeys = function(){
   document.getElements('span.colorkey').removeClass('colorkey');
   //PseudoDOM.clear();
};
BudgetGraph.select = function(name){
   if(BudgetGraph.graphs[name]){
       window.currentGraph = BudgetGraph.graphs[name];
       BudgetGraph.graphs[name].select();
       if(BudgetGraph.graphs[name].options.select) BudgetGraph.graphs[name].options.select(name);
   }
};
BudgetGraph.deselect = function(){
   delete window.currentGraph;
   BudgetGraph.clearLegend();
};
BudgetGraph.timer = function(value){
   if (value == 1) {
       loadTimer++;
   } else if (value == -1) {
       loadTimer--;
   }
   loadSpinner = document.id('load_spinner');
   if (loadTimer <= 0) {
       loadSpinner.hide();
   } else {
       loadSpinner.show();
   }
}
