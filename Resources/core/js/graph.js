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
        stacked : true,
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
                this.display();
            }.bind(this)
        });
        this.raphael = Raphael(element);
<<<<<<< HEAD
        this.fetch();
        a = this;
=======
        //this.fetch();
>>>>>>> 4967edb9b432cfdd8527dae3dfe0251f167327a0
    },
    fetch : function(data, type){
        if(type) this.options.type = type;
        var requestData = Object.clone(data);
        /*if(
            BudgetGraph.lastSelectionType == this.options.type && 
            Object.equivalent(BudgetGraph.lastSelection, requestData)
        ){
            this.options.requestor.onSuccess(this.data);
        }else{*/
            BudgetGraph.lastSelection = requestData;
            BudgetGraph.lastSelectionType = this.options.type;
            requestData.type = this.options.type;
            if(this.options.target) requestData.target = this.options.target;
            this.options.requestor.get(requestData);
            
        //}
    },
    setColors : function(colors) {
        this.options.colors = colors;
    },
    display : function(metric){
        if(this.lines) this.lines.remove();
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
        if(this.options.bar){
            this.lines = this.raphael.barchart(75, 10, 570, 400, xSet, ySet, {
                shade: true,
                nostroke: false,
                axis: "0 0 1 1",
                colors:this.options.colors
            });
        }else if (this.options.pie){
           
            //window.totalChartValue = 0;

            var totalValues = [];
            ySet.each(function(arraySet, key) {
                totalValues.push(Math.floor(arraySet.pop()/10000));
            });
            console.log(totalValues);

            /* Year Values
            xSet.each(function(element, key) {
                if (key == 0) {
                    element.each(function(elementValue, keyValue) {
                        if (keyValue == 0) {
                            //console.log("Element: "+elementValue); // Year
                        }
                    });
                };
            });
            */
            //console.log(totalValues.clone());

            this.lines = this.raphael.piechart(320, 215, 185, totalValues, {
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
                shade: this.options.stacked,
                nostroke: false,
                axis: "0 0 1 1",
                axisxstep : 4,
                colors:this.options.colors,
                stacked:this.options.stacked,
                percent:this.options.percent
            }).hover(function() {
            			this.attr("opacity",1);
            			this.marker = this.marker || a.raphael.popup(this.x, this.y, this.value, "up", 5).insertBefore(this);
            			this.marker.show();
    				}, function() {
        				// hide the popup element with an animation and remove the popup element at the end
        				this.attr("opacity",0);
        				this.marker && this.marker.hide();}
        	);
        }
    }
})
BudgetGraph.lastSelection = {};
