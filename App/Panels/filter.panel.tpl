{page wrapper="application" title="China Solutions" meta_description="China is big"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
{literal}
<script type="text/javascript">
	window.onload = function(){
		var testButton = new Element('input', {
			value: "btn",
			type: "button",
			events: {
				click: function(){
					new Ajax('ajaxTest.php', function(text){ display.innerHTML = text; });
				}
			}
		});
		//$("content_wrapper").adopt(testButton);
		var display = $("testDiv")
		convertTrees();
		
		//expandToItem("tree1",null,"3");
		for (var i=1;i<6;i++) {
			addButtons("buttonDiv1","tree1",""+i);
			addButtons("buttonDiv2","tree2",""+i);
		}
	};
	
	var slideOrder = ['chooseCityDiv','chooseDepDiv','dummy1','dummy2','dummy3'];

	var howtops = new Array();
	howtops[0] = 'The interface is organized into two main panels. The panel on the left contains two columns: one for Fund and the other for Department. These panels filter one another as you make selections, indicating which departments recieve money from which funds, or, conversely, which funds grant money to which departments. You can select a fund first or a department first&mdash;it all depends on what information you need.';
	howtops[1] = 'The right panel displays the data that represents the selections you made in the left panel. Financial data is vizualized in graph form, while employee data (available when only a department is selected) is presented in both graph and tabular forms.';
	howtops[2] = 'Above the graph, you\'ll notice selector buttons that allow you to change the graph breakdown. For example, if you want the graph lines (or pie slices) to represent the different funds, select "Funds", or if you want them to represent different expense types, select "Expenses". This is also where you can choose between financial and employee breakdowns.';
	howtops[3] = 'You can also choose different graph types. There are the traditional pie and line charts, as well as a stacked (or area) chart to illustrate each component\'s contribution to the total, in both absolute numbers and percentages.';
	howtops[4] = 'Hover your mouse over graph data points to get more information.';
	//howworks = ['a','b','c','d','e'];
	//howtops = ['1','2','3','4','5'];
	
	// these next two variables will let us know which way we want to swipe the slideshow, by letting functions know where we are now (since where we're going is passed in as arguments)
	var currentSection = -1;
	var currentSlide = -1;
	var numSlides = 0;
	
	// we assume that the howto images are of the form Resources/core/img/howto0.png
	// and the how budgets work images are of the form Resources/core/img/howworks0.png

	function activateSectionTab(section){
		var sectionTabs = document.getElements('#sectionTabs li a');
		sectionTabs.each(function(sectionTab, index){
			if (sectionTab.hasClass('active'))
			{
				sectionTab.removeClass('active');
			}
			if (index == index)
			{
				sectionTab.addClass('active');
			}
		});
	}
	
	function swapImage(section, slide, direction){
		/*var id1 = slideOrder[currentSlide+1];
		var id2 = slideOrder[slide+1];
		var currSlide = $(id1);
		var nextSlide = $(id2);
		
		// we only want the image to have the sliding transition effect if we're not moving within the how to use section. the reason is that the how to use images are very similar, so it makes more sense to just replace them.

		if (section == 0 && section == currentSection)
		{
			currSlide.style.display = 'none';
			nextSlide.style.display = 'inline';
		}	*/
		var imgDiv = document.getElement('#slideImg');
		var imgElement = document.getElement('#slideImg img');
		
		// we only want the image to have the sliding transition effect if we're not moving within the how to use section. the reason is that the how to use images are very similar, so it makes more sense to just replace them.

		var actualslide = slide + 1;
		imgElement.setProperty('src', '/Resources/core/img/howto' + actualslide + '.png');
		
	}
	
	function swapText(section, slide, direction){
		var textDiv = document.getElement('#slideText');
		var textElement = document.getElement('#slideText p');
		
		var slideOut = new Fx.Tween(textDiv, {
			property: 'left',
			duration: '500',
			unit: '%',
			transition: Fx.Transitions.Quad.easeInOut
		});
		slideOut.start((direction == 'forward' ? '-100%' : '100%')).chain(function(){
			textDiv.destroy();
		});
		
		var newTextDiv = textDiv.clone(true, true).inject(textDiv.getParent(), 'top');
		
		newTextDiv.setStyle('left', (direction == 'forward' ? '100%' : '-100%'));
		var newTextElement = newTextDiv.getElement('p');
		if (section == 1)
		{
			newTextElement.setProperty('html', howworks[slide]);
		}
		else
		{
			newTextElement.setProperty('html', howtops[slide]);
		}
		
		var slideIn = new Fx.Tween(newTextDiv, {
			property: 'left',
			duration: '500',
			unit: '%',
			transition: Fx.Transitions.Quad.easeInOut
		});
		slideIn.start('5%');
	}
	
	function initializeDots(section, slide){
		var progressDotsElement = document.getElement('#progressDots');
		
		// kill all the existing dots
		progressDotsElement.getChildren().each(function(child){child.destroy();});
		
		// recreate what's necessary
		numDots = (section == 1 ? howworks.length : howtops.length);
		for (var i = 0; i < numDots; i++)
		{
			var newDot = new Element('li').inject(progressDotsElement);
			if (i == slide)
			{
				newDot.addClass('active');
			}
			(function(){
				var index = i;
				newDot.addEvent('click', function(){
					activateSlide(section, index);
					});
			})();
		}
	}
	
	function initializeNavArrow(whichOne, section, slide){
		navArrow = document.getElement('#' + whichOne);
		
		// clear everything
		navArrow.removeEvents();
		if (navArrow.hasClass('disabled'))
		{
			navArrow.removeClass('disabled');
		}
		
		if ((slide == 0 && whichOne == 'goLeft') || (slide == (numSlides - 1) && whichOne == 'goRight'))
		{
			navArrow.addClass('disabled')
		}
		else
		{
			navArrow.addEvent('click', function(){
				activateSlide(section, (whichOne == 'goLeft' ? (slide - 1) : (slide + 1)));
			});
		}
	}
	
	function forwardOrBackward(section, slide)
	{
		if (section > currentSection)
			return 'forward';
		else if (section < currentSection)
			return 'backward';
		else if (section == currentSection){
			if (slide >= currentSlide)
				return 'forward';
			else
				return 'backward';
		}
	}
	
	function activateSlide(section, slide){
			/*  things that need to happen:
				
				1. set the correct section tab to active and deactivate the other tabs
				
				2. swipe away the previous image and swipe in the correct image
				
				3. swipe away the previous text and swipe in the correct text
				
				4. clear the dots and re-create them (since we may have switched to a different section), with the right active/inactive states
				
				5. update the action associated with the left and right arrows
			
			*/
			
		var direction = forwardOrBackward(section, slide);
		numSlides = (section == 1 ? howworks.length : howtops.length);
		
		activateSectionTab(section);
		swapImage(section, slide, direction);
		swapText(section, slide, direction);
		initializeDots(section, slide);
		initializeNavArrow('goLeft', section, slide);
		initializeNavArrow('goRight', section, slide);
		
		currentSection = section;
		currentSlide = slide;
	}
	
	document.addEvent('domready', function() {
		// first, we need to add some click events to the section tabs
		
		activateSlide(0, 0);
		
		//this snippet adds functionality to the mouse scroll wheel
		document.addEvent('mousewheel', function(event){
			var event = new Event(event);
			
			// mouse wheel up
			if (event.wheel > 0 && currentSlide > 0)
			{
				activateSlide(currentSection, (currentSlide - 1));
			}
			// mouse wheel down
			else if (event.wheel < 0 && currentSlide < (numSlides - 1))
			{
				activateSlide(currentSection, (currentSlide + 1));
			}
		});
		
		//this snippet adds functionality to the keyboard left and right arrows
		document.addEvent('keyup', function(event){
			if (event.key == 'left' && currentSlide > 0)
			{
				activateSlide(currentSection, (currentSlide - 1));
			}
			else if (event.key == 'right' && currentSlide < (numSlides - 1))
			{
				activateSlide(currentSection, (currentSlide + 1));
			}
		});
	});
</script>
{/literal}
<div id="content_wrapper">
    <div id="about">
		<div id="slideshow">
			<ul id="sectionTabs">
				<li><a href="#">Compare Your City</a></li>
			</ul>
			<div id="slide">
				<div id="slideImg">
					<img />
				</div>
				<div id="chooseDepDiv" style="display:none">
					<br/><br/>
					{$expendList}
					<br/><br/>
					{$metricList}
				</div>
				<div id="chooseCityDiv">
					{$cityMenu}
				</div>
				<div id="dummy1" style="display:none">ONE</div>
				<div id="dummy2" style="display:none">TWO</div>
				<div id="dummy3" style="display:none">THREE</div>
				<div id="slideText">
					<p></p>
				</div>
			</div>
			<div id="benchmarkPanel">
			</div>
			<ul id="progressDots">
				<li></li>
				<li></li>
			</ul>
			<div id="goLeft"></div>
			<div id="goRight"></div>
		</div>
    </div>
<div id="testDiv"></div>
<div id="windowDiv"></div>
<div id="controlDiv"></div>
</div>
