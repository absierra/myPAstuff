var BudgetGraph = new Class({
    Implements: Options,
    options: {
        color: '#fff',
        size: {
            width: 100,
            height: 100
        },
        type : 'fund',
        name : 'Debt Service Funds'
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
        this.fetch();
    },
    fetch : function(data, type){
        if(type) this.options.type = type;
        var requestData = Object.clone(data);
        requestData.type = this.options.type;
        this.options.requestor.get(requestData);
    },
    setColors : function(colors) {
        this.options.colors = colors;
    },
    display : function(metric){
        if(this.lines) this.lines.remove();
        if(!metric) metric = 'revenue';
        xSet = [];
        ySet = [];
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
        //console.log(['diz', xSet, ySet]);
        this.lines = this.raphael.linechart(50, 0, 600, 400, xSet, ySet, {
            shade: true,
            nostroke: false,
            axis: "0 0 1 1",
            colors:this.options.colors,
            stacked:true
        });
    }
})