<?php

	require('./forms.php');
	$cities = json_decode(file_get_contents('Data/cities.json'), true);
	$html1 = generateSelectOriginal("City",$cities['Cities']);
	$renderer->assign('cityMenu',$html1);
	
	require('./print.php');
	$renderer->assign('expendList',$expendDisplay);
	$renderer->assign('metricList',$metricDisplay);

?>
