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
                this.colors = hueShiftedColorSet(Object.getLength(this.data), 'hex');
                this.setColors(this.colors);
                this.display();
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
            }.bind(this)
        });
        if(this.options.id) BudgetGraph.graphs[this.options.id] = this;
        if(this.options.select) this.options.select = this.options.select.bind(this)
	    this.raphael = Raphael(element);
        a = this; //?
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
        var keys = [];
        target = this.options.target;
        metric = this.options.metric;
        Object.each(this.data, function(value, key){
        	key = key.indexOf(":")==-1?key:key.split(":")[1];
        	if(target == 'category'){
        		if(value['2013'][metric] != undefined){
        			keys.push(key);
        		}
        	}
        	else{
        		keys.push(key);
        	}
        });
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
                if(keys.contains(el.innerHTML.trim())){
                    result.push(el.innerHTML);
                    keys.erase(el.innerHTML);
                }
            });
        }
        //return result;*/
        keys.each(function(key){
            result.push(key);
        });
        return result;
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
            this.colors = hueShiftedColorSet(Object.getLength(this.data), 'hex');
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
        legendElement.getElements('li').destroy();
        var items = this.getLegendItems();
        if(items.length > this.colors.length){
            this.colors = hueShiftedColorSet(items.length, 'hex');
        }
        if(items && items.length > 0){
        	items.sort();
            items.each(function(item, lcv) {
                var legendItem = new Element('span', {
                    html : item
                });
                PseudoDOM.before(legendItem, {
                    'background-color' : this.colors[lcv]
                });
                var legendLi = new Element('li');
                legendElement.appendChild(legendLi);
                legendLi.appendChild(legendItem);
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

		if(!this.options.target){
			window.dataRequest[key].each(function(data, index){
				if(this.data[data]){
					var xs = [];
					var ys = [];
					var keys = Object.keys(this.data[data]).sort();
					keys.each(function(key){
						xs.push(year);
						ys.push((this.data[data][key][metric]?this.data[data][key][metric]:0));
					});
					xSet.push(xs);
					ySet.push(ys);
				}
			}.bind(this));
		}else{
			var keys;
			Object.each(this.data, function(data, name){
				var xs = [];
				var ys = [];
				if( (!keys) || this.data[name].length > keys.length) keys = Object.keys(this.data[name]).sort();
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
		}
		console.log(this.options.target);
		console.log(ySet);
		if(this.options.mode == 'bar'){
			this.lines = this.raphael.barchart(75, 10, 570, 400, xSet, ySet, {
				shade: true,
				nostroke: false,
				axis: "0 0 1 1",
				colors:this.options.colors
			});
		}else if (this.options.mode == 'pie'){
		   console.log('pie');
			//window.totalChartValue = 0;
			var graphSize = document.id('graphs').getScrollSize();
			var xGraph = graphSize.x / 2 - 45;
			var yGraph = graphSize.y / 2 - 5;
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
					totalValues.push(Math.floor(arraySet[yearKey]));
				});
			} else {
				ySet.each(function(arraySet, key) {
					totalValues.push(Math.floor(arraySet.pop()));
				});
			}
			var a = this;
			this.lines = this.raphael.piechart(xGraph, yGraph + 10, yGraph, totalValues, {
				shade: true,
				nostroke: false,
				axis: "0 0 1 1",
				axisxstep : 4,
				colors:this.options.colors,
				stacked:this.options.stacked,
				percent:this.options.percent
			}).hover(function () {
				this.sector.stop();
				this.sector.scale(1.1, 1.1, this.cx, this.cy);
				this.marker = this.marker || a.raphael.popup(this.mx, this.my, '$'+this.value, "up", 5);
				this.marker.show();
			},function (){
				this.sector.animate({transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, 'bounce');
				this.marker.hide();
			});
		}else{
			var graphSize = document.id('graphs').getScrollSize();
			var xGraph = graphSize.x - 240;
			if (xGraph > 700) xGraph = 700;
			var yGraph = graphSize.y - 41;
			
			var a = this;
			this.lines = this.raphael.linechart(75, 20, xGraph, yGraph, xSet, ySet, {
				shade: (this.options.mode == 'stacked-line' || this.options.mode == 'percentage-line'),
				nostroke: false,
				axis: "0 0 1 1",
				axisxstep : 4,
				colors:this.options.colors,
				stacked:(this.options.mode == 'stacked-line' || this.options.mode == 'percentage-line'),
				percent:(this.options.mode == 'percentage-line')
			}).hover(function() {
						this.attr("opacity",1);
						this.marker = this.marker || a.raphael.popup(this.x, this.y, '$'+this.value, "up", 5).insertAfter(this);
						this.marker.show();
					}, function() {
						// hide the popup element with an animation and remove the popup element at the end
						this.attr("opacity",0);
						this.marker && this.marker.hide();}
			);
		}
	}
})


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
