var BudgetGraph = new Class({
    Implements: Options,
    options: {
        color: '#fff',
        size: {
            width: 100,
            height: 100
        },
        type : 'none',
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
        //this.fetch();
    },
    fetch : function(data, type){
        if(type) this.options.type = type;
        var requestData = Object.clone(data);
        if(Object.equivalent(BudgetGraph.lastSelection, requestData)){
            
        }else{
            BudgetGraph.lastSelection = requestData;
            requestData.type = this.options.type;
            this.options.requestor.get(requestData);
        }
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
        /*
        Object.each(this.data, function(data, name){
            var xs = [];
            var ys = [];
            Object.each(data, function(item, year){
                xs.push(year);
                ys.push((item[metric]?item[metric]:0));
            });
            xSet.push(xs);
            ySet.push(ys);
        });
        */
        //console.log(['diz', xSet, ySet]);
        if(this.options.bar){
            this.lines = this.raphael.barchart(75, 10, 570, 400, xSet, ySet, {
                shade: true,
                nostroke: false,
                axis: "0 0 1 1",
                colors:this.options.colors
            });
        }else if (this.options.pie){
           /*
            window.totalChartValue = 0;
            var totalValues = [];
            ySet.each(function(element, key) {
                totalValues.push(Math.floor(element.pop()/10000));
            });
            xSet.each(function(element, key) {
                if (key == 0) {
                    element.each(function(elementValue, keyValue) {
                        if (keyValue == 0) {
                            //console.log("Element: "+elementValue); // Year
                        }
                    });
                };
            });
            console.log(totalValues.clone());
            this.lines = this.raphael.piechart(320, 215, 185, totalValues, {
                colors:this.options.colors
            });
            */
        }else{
            this.lines = this.raphael.linechart(75, 10, 570, 400, xSet, ySet, {
                shade: true,
                nostroke: false,
                axis: "0 0 1 1",
                axisxstep : 4,
                colors:this.options.colors,
                stacked:this.options.stacked,
                percent:this.options.percent
            });
        }
    }
})
BudgetGraph.lastSelection = {};