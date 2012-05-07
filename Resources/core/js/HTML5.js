if(!HTML5) var HTML5 = {};
if(!HTML5.Forms) HTML5.Forms = {};
HTML5.Forms.range = function(){
    //todo: use duck typing instead of recognizing the browser
    if(!(Browser.safari || Browser.chrome)) document.addEvent('domready', function() {
        var sliders = document.getElements("input[type='range']");
        sliders.each(function(input, index){
            var id = input.parentNode.getAttribute('id');
            if(!input.parentNode.getAttribute('id')){
                id = 'range_input_'+index;
                input.parentNode.set('id', id);
            }
            var knob = new Element('div', {
                width : '20px',
                height : '40px',
                id : id+'_knob'
            });
            var slide = new Element('div', {
                id : id+'_slide'
            });
            slide.setStyle('width', input.getStyle('width'));
            slide.setStyle('height', '6px');
            slide.setStyle('background-color', '#444444');
            slide.setStyle('-moz-border-radius', '3px 3px 3px 3px');
            slide.setStyle('margin-top', '-12px');
            slide.setStyle('-moz-box-shadow', 'inset 1px 1px 3px #000000');
            knob.setStyle('margin-top', '-20px');
            knob.setStyle('height', '14px');
            knob.setStyle('width', '14px');
            knob.setStyle('background-color', '#555555');
            knob.setStyle('border', '2px solid #777777');
            knob.setStyle('-moz-border-radius', '10px 10px 10px 10px');
            input.parentNode.adopt(knob);
            input.parentNode.adopt(slide);
            input.setStyle('opacity', .001);
            var mySlider = new Slider(id, id+'_knob', {
                range: [Number.from(input.getAttribute('min')), Number.from(input.getAttribute('max'))],
                wheel: true,
                snap: true,
                onChange: function(pos){
                    input.value = pos;
                    input.fireEvent('change', {event:{srcElement:input}});
                }.bind(this)
            });
        });
    });
};
HTML5.Forms.dualrange = function(){ //sometimes you want a range
    document.addEvent('domready', function() {
        var sliders = document.getElements("input[type='dualrange']");
        sliders.each(function(input, index){
            var id = input.getAttribute('id');
            if(!input.getAttribute('id')){
                id = 'dualrange_input_'+index;
                input.set('id', id);
            }
            var upperKnob = new Element('div', {
                'class' : 'knob upper',
                id : id+'_knob'
            });
            var lowerKnob = new Element('div', {
                'class' : 'knob lower',
                id : id+'_knob'
            });
            var payload = new Element('input', {
                type : 'hidden',
                id : id,
                name : input.getAttribute('name'),
            });
            var slide = new Element('div', {
                'class' : 'dualslider slider',
                id : id+'_slide'
            });
            upperKnob.setStyle('width', '10px');
            upperKnob.setStyle('height', '10px');
            lowerKnob.setStyle('width', '10px');
            lowerKnob.setStyle('height', '10px');
            slide.setStyle('height', '10px');
            slide.setStyle('margin', '0px');
            lowerKnob.inject(slide);
            upperKnob.inject(slide);
            slide.inject(input.getParent());
            input.dispose();
            
            var upperLimit = input.getAttribute('upper');
            var lowerLimit = input.getAttribute('lower');
            var width = Number.from(input.getAttribute('width'));
            var stretch = input.getAttribute('stretch');
            stretch = (stretch && stretch.toLower() == 'true')?true:false;
            slide.setStyle('width', width);
            slide.setStyle('line-height', slide.getStyle('height'));
            lowerKnob.setStyle('margin', '0px');
            upperKnob.setStyle('margin', '0px');
            slide.setStyle('position', 'relative');
            var makeLabel = function(knob, value, offset){
                if(!offset) offset = 15;
                var knobLabel = new Element('div', {
                    'class' : 'label',
                    id : id+'_knob_label'
                });
                knobLabel.setStyle('position', 'relative');
                knobLabel.setStyle('top', 10);
                var w = 10;
                knobLabel.setStyle('width', w);
                knobLabel.setStyle('left', -1 * (w/2 + offset));
                knobLabel.setStyle('font-size', '10px');
                knobLabel.setStyle('text-align', 'center');
                knobLabel.set('html', value);
                knobLabel.inject(knob);
                return knobLabel;
            };
            upperKnob.setStyle('position', 'relative');
            lowerKnob.setStyle('position', 'relative');
            input.hide();
            var options = {};
            var originalWidth = Number.from(lowerKnob.getStyle('width'));
            upperKnob.setStyle('left', width - originalWidth - Number.from(upperKnob.getStyle('width')));
            width -= Number.from(lowerKnob.getStyle('width'));
            var upper = Number.toInt(upperLimit);
            var lower = Number.toInt(lowerLimit);
            var lowerLabel = makeLabel(lowerKnob, lower, 30);
            var upperLabel = makeLabel(upperKnob, upper, 15);
            input.setAttribute('lowerValue', lower);
            input.setAttribute('upperValue', upper);
            var range = (upper-lower);
            var increment = width/range;
            if(!(upperLimit.contains('.') || lowerLimit.contains('.'))){ //ints
                options['grid'] = Math.ceil((width)/range);
            }
            var value = function(knob){
                var result =  Math.ceil(lower + ( (Number.from(knob.getStyle('left'))-1) /increment));
                if(result < lower) return lower;
                return result;
            };
            var leftDrag, rightDrag;
            leftDrag = new Drag(lowerKnob, Object.merge(options, {
                onDrag : function(){
                    var upperX = Number.from(upperKnob.getStyle('left'))
                    var lowerX = Number.from(lowerKnob.getStyle('left'));
                    var width = Number.from(upperKnob.getStyle('width'));
                    if(lowerX - width > upperX ){
                        upperKnob.setStyle('left', lowerX );
                        upperLabel.set('html', value(upperKnob));
                    }
                    var val = value(lowerKnob);
                    lowerLabel.set('html', val);
                    input.setAttribute('lowerValue', val);
                },
                onComplete : function(){
                    var logic = input.getAttribute('onrange');
                    var func = new Function(logic);
                    func.bind(input)();
                },
                limit : {
                    x: [0, width - Number.from(lowerKnob.getStyle('width'))],
                    y: [0, 0]
                }
            }));
            rightDrag = new Drag(upperKnob, Object.merge(options, {
                onDrag : function(){
                    var upperX = Number.from(upperKnob.getStyle('left'))
                    var lowerX = Number.from(lowerKnob.getStyle('left'));
                    var width = Number.from(upperKnob.getStyle('width'));
                    if(upperX - width < lowerX ){
                        lowerKnob.setStyle('left', upperX );
                        lowerLabel.set('html', value(lowerKnob));
                    }
                    var val = value(upperKnob);
                    upperLabel.set('html', val);
                    input.setAttribute('upperValue', val);
                },
                onComplete : function(){
                    var logic = input.getAttribute('onrange');
                    var func = new Function(logic);
                    func.bind(input)();
                },
                limit : {
                    x: [0, Math.floor(width-Number.from(upperKnob.getStyle('width')))],
                    y: [0, 0]
                }
            }));
        });
    });
};
HTML5.Forms.dualrange();
