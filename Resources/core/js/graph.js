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
    fetch : function(name, type){
        if(name) this.options.name = name;
        if(type) this.options.type = type;
        
        this.options.requestor.get({
            type : this.options.type,
            name : this.options.name,
        });
    },
    display : function(metric){
        if(this.lines) this.lines.remove();
        if(true){
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
            console.log(['diz', xSet, ySet]);
            this.lines = this.raphael.linechart(40, 20, 360, 260, xSet, ySet, {
                shade: true,
                nostroke: false,
                axis: "0 0 1 1",
                stacked:true
            });
        }else{
        
        }
    }
})