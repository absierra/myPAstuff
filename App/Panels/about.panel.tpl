{page wrapper="application" title="Delphi Solutions" meta_description="Delphi Solutions provides solutions to analyzing and visualizing big distributed data"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
{literal}
<script>
	document.addEvent('domready', function() { 
		// this is for the about page, in the how to use delphi budgets section
		var howtoimgs = [
			document.getElement('#img0'),
			document.getElement('#img1'),
			document.getElement('#img2'),
			document.getElement('#img3'),
			document.getElement('#img4'),
			document.getElement('#img5'),
			document.getElement('#img6'),
			document.getElement('#img7')
			];
		var howtops = [
			document.getElement('#p0'),
			document.getElement('#p1'),
			document.getElement('#p2'),
			document.getElement('#p3'),
			document.getElement('#p4'),
			document.getElement('#p5'),
			document.getElement('#p6'),
			document.getElement('#p7')
			];
		howtops.each(function(p, index){
			if (p != null){
				p.addEvent('mouseover', function(){
					howtoimgs.each(function(img){
						img.setStyle('display', 'none');
					});
					howtoimgs[index].setStyle('display', 'inline');
				});
				p.addEvent('mouseleave', function(){
					howtoimgs.each(function(img){
						img.setStyle('display', 'none');
					});
					howtoimgs[0].setStyle('display', 'inline');
				});
			}
		});
	});
</script>
{/literal}
<div id="content_wrapper">
    <div id="about">
		<h1>How City Budgets Work</h1>
        <table>
            <tr>
                <td><p class="right">You can think of a typical city budget as a flow of funds, not unlike your own personal finances. You have income, bank accounts, and expenses. A city has revenue, funds, and expenditures.</p></td>
                <td><img src="Resources/core/img/about_1.png" /></td>
            </tr>
            <tr>
                <td><img src="Resources/core/img/about_2.png" /></td>
                <td><p>A city's revenue comes in the form of taxes and fees. That revenue is organized into funds, upon which specific departments, divisions, and city programs can draw for their expendictures. Funds and departments have their own hierarchical structures. For example, the Refuse Fund, the Electric Fund, the Gas Fund, and others are all grouped together under the category of Enterprise Funds. Departments are broken down into divisions (sometimes called programs). For example, The City Attorney Department has an Administrative division, a Consultation and Advisory division, and others.</p></td>
            </tr>
            <tr>
                <td><p class="right">A division or program (and hence the department to which it belongs) can draw on multiple funds.</p></td>
                <td><img src="Resources/core/img/about_3.png" /></td>
            </tr>
			<tr>
				<td><img src="Resources/core/img/about_4.png" /></td>
				<td><p>Similarly, the same revenue stream can feed into multiple funds.</p></td>
			</tr>
            <tr>
                <td><p class="right">Moreover, a city's various departments have the same types of expenditures. For example, departments spend money on salaries and benefits for their employees (which is the largest city expenditure category). This allows a budget to offer an additional perspective on a city's finances: how much money is being spent on various categories of expenditures, instead of a breakdown merely by department, division, or program.</p></td>
                <td><img src="Resources/core/img/about_5.png" /></td>
			</tr>
        </table>
		
		<h1>How to use Delphi Budgets</h1>

		<table>
			<tr>
				<td class="img_left">
					<img id="img0" src="Resources/core/img/howto0.png" />
					<img id="img1" src="Resources/core/img/howto1.png" />
					<img id="img2" src="Resources/core/img/howto2.png" />
					<img id="img3" src="Resources/core/img/howto3.png" />
					<img id="img4" src="Resources/core/img/howto4.png" />
					<img id="img5" src="Resources/core/img/howto5.png" />
					<img id="img6" src="Resources/core/img/howto6.png" />
					<img id="img7" src="Resources/core/img/howto7.png" />
				</td>
				<td>
					<p id="p0">Delphi Budgets offers the ability to explore a budget in a simple graphical user interface, making it easier than pouring through hundreds of pages of a budget document to get at the information you want about your city's finances.</p>

					<p id="p1">The interface is organized into two main panels. The panel on the left contains two columns--one for Fund and the other for Department. These panels filter one another as you make selections, indicating which departments recieve money from which funds, or, conversely, which funds grant money to which departments. You can select a fund first or a department first--it all depends on what information you need.</p>
					
					<p id="p2">The right panel is the resulting graph that represents the seletions you made in the left panel.</p>

					<p id="p5">Above the graph, you'll notice selector buttons that allow you to change the graph breakdown. For example, if you want the graph lines (or pie slices) to represent the different funds, select "Funds", or if you want them to represent different expenditure types, select "Expenditures".</p>
					
					<!--There are several options for viewing financial data, and if you've only selected a department, you can view employee data. Financial breakdowns are by fund (showing how much money is spent out of each fund), department (showing how much money is spent by each department), expenditure (showing how much money is spent in each expenditure category type), revenue (showing how much money is taken in), fee revenue (showing how much money is taken in in the form of non-tax fees), and expenditure versus revenue. Employee breakdowns include number of employees by what department (or division) they are in, number of employees by each type of employee, and salary of each employee type.-->

					<p id="p6">You can also choose different graph types. There are the traditional pie and line charts, as well as a stacked (or area) chart to illustrate each component's contribution to the total, in both absolute numbers and percentages.</p>

					<p id="p7">Hover your mouse over graph data points to get more information.</p>
				</td>
			</tr>
		</table>
    </div>
</div>