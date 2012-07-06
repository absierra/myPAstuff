<?php
    $renderer->assign('panel', PageRenderer::$root_panel);
    $city_name = WebApplication::getConfiguration('application.city');
    $renderer->assign('delphi_city_name',$city_name);
    
    $color = '#000000';
    //CITY SWITCH
    switch($city_name){
		case 'salinas':
			$color = '#49495D';
		case 'palo_alto':
			$color = '#8DC63F';
		case 'saratoga':
			$color = '#5B4C37';
		case 'walnut_creek':
			$color = '#003779';
		case 'lafayette':
			$color = '#3A649B';
		case 'san_francisco':
			$color = '#5695DE';
	}
	$renderer->assign('color',$color);
			
			