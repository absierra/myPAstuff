{page wrapper="application" title="PRINT" meta_description="print"}
{require name="mootools,core,header,graphael,tabs"}
{panel name="header"}
<div id="content_wrapper">

{$derp}
<div id="displayDiv" ></div>
<br/><br/>
{$expendList}
<br/><br/>
{$metricList}


{literal}
<script type="text/javascript">
	window.onload = function() {
		convertTrees();
		
		//expandToItem("tree1",null,"3");
		for (var i=1;i<6;i++) {
			addButtons("buttonDiv1","tree1",""+i);
			addButtons("buttonDiv2","tree2",""+i);
		}
	}
</script>
{/literal}

</div>
