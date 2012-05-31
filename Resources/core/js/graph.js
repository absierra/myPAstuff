var BudgetGraph = new Class({
    Implements: Options,
    options: {
        color: '#fff',
        size: {
            width: 100,
            height: 100
        },
        type : 'none',
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
            onSuccess: function(payload){
                this.data = payload.data;
                this.colors = hueShiftedColorSet(Object.getLength(this.data), 'hex');
                this.setColors(this.colors);
                this.display();
                if(this.fetchCallback){
                    this.fetchCallback(this.data);
                    delete this.fetchCallback;
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
                //console.log(['selected', column.getElements('li span.selected')]);
                return column.getElements('ul li span:not(.disabled)');
            }else {
                //console.log(['rer', column.getElements('> li > span:not(.disabled)')]);
                return column.getElements('> li > span:not(.disabled)');
            }
        }else return [];
    },
    getLegendItems : function(){
        //console.log(['sss', this.data]);
        var keys = Object.keys(this.data).map(function(value){
            return value.split(':').pop();
        });
        var result = [];
        /*var column = document.id(this.options.column);
        var elements = column.getElements('ul li span:not(.disabled)');
        elements.each(function(el){
            result.push(el.innerHTML);
        });
        return result;*/
        return keys;
    },
    setKeys : function(){
        document.getElements('span.colorkey').removeClass('colorkey');
        PseudoDOM.clear();
        activeItems = this.getKeyElements();
        if(activeItems.length != this.colors.length) console.log(['Data lengths do not match, something is wrong with the series!',this.data]);
        activeItems.each(function(item, lcv){
            item.addClass('colorkey');
            PseudoDOM.before(item, {
                'background-color' : this.colors[lcv]
            });
        }.bind(this));
    },
    setLegend : function(){
        var column = document.id(this.options.column);
        var legendElement = document.getElement('#legend');
        legendElement.getElements('li').destroy();
        var items = this.getLegendItems();
        //console.log(['items', items, this.colors]);
        if(items && items.length > 0){
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
                    Object.each(this.data[data], function(item, year){
                        xs.push(year);
                        ys.push((item[metric]?item[metric]:0));
                    });
                    xSet.push(xs);
                    ySet.push(ys);
                }
            }.bind(this));
        }else{
            Object.each(this.data, function(data, name){
                var xs = [];
                var ys = [];
                Object.each(data, function(item, year){
                    xs.push(year);
                    ys.push((item[metric]?item[metric]:0));
                });
                xSet.push(xs);
                ySet.push(ys);
            }); //*/
        }
        //console.log(['diz', xSet, ySet]);
        if(this.options.mode == 'bar'){
            this.lines = this.raphael.barchart(75, 10, 570, 400, xSet, ySet, {
                shade: true,
                nostroke: false,
                axis: "0 0 1 1",
                colors:this.options.colors
            });
        }else if (this.options.mode == 'pie'){
           
            //window.totalChartValue = 0;

            var totalValues = [];
            var yearValues = [];
            var year = this.options.year;
            var yearKey;

            xSet.each(function(yearsArray) {
                yearsArray.each(function(value, key) {
                    if (year == value) {
                        yearKey = key;
                    }
                });
                BudgetGraph.LastSelectionYearsData = yearsArray;
            });

            if (year) {
                ySet.each(function(arraySet, key) {
                    totalValues.push(Math.floor(arraySet[yearKey]/10000));
                });
            } else {
                ySet.each(function(arraySet, key) {
                    totalValues.push(Math.floor(arraySet.pop()/10000));
                });            
            }

            this.lines = this.raphael.piechart(335, 197, 175, totalValues, {
                shade: true,
                nostroke: false,
                axis: "0 0 1 1",
                axisxstep : 4,
                colors:this.options.colors,
                stacked:this.options.stacked,
                percent:this.options.percent
            });

        }else{
            this.lines = this.raphael.linechart(75, 10, 570, 400, xSet, ySet, {
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
BudgetGraph.select = function(name){
    if(BudgetGraph.graphs[name]){
        //console.log(['selecting', name, BudgetGraph.graphs[name]]);
        window.currentGraph = BudgetGraph.graphs[name];
        BudgetGraph.graphs[name].select();
        if(BudgetGraph.graphs[name].options.select) BudgetGraph.graphs[name].options.select(name);
    }
};
BudgetGraph.deselect = function(){
    delete window.currentGraph;
    BudgetGraph.clearLegend();
};
