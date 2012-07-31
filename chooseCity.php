<?php

function generateSelect($name = '', $options = array()) {
	$html = '<select name="'.$name.'" style = "height:25px"  >';
	foreach ($options as $option) {   
		$trimOption = array_filter($option);
		if (count($trimOption) == 0) break;  	
		$html .= '<option value="'.implode(",", $trimOption).'">'.end(array_values($trimOption)).'</option>';
	}
	$html .= '</select>';
	return $html;
}

function generateCheckBox($name = '', $options = array()) {
	foreach ($options as $option) {   
		$trimOption = array_filter($option);
		if (count($trimOption) == 0) break;  	
		$html .= '<input type="checkbox" name="'.$name.'[]" value="'.implode(",", $trimOption).'" />'.end(array_values($trimOption)).'<br />';
	}
	return $html;
} 

function importFile($filename){
	$fp = @fopen($filename, 'r');
	$array = array();
	if ($fp) { 
 		$lines = explode("\n", fread($fp, filesize($filename))); 
 		foreach($lines as $line) {
 			$row = explode(",", $line);
 			$array[] = $row;
 		}
	}
	return $array;
}

function run(){
	$array1 = importFile('citySCO');
	$html1 = generateCheckBox('City', $array1);


	$str = '<form name="form A" action="./print" >'.$html1.'<INPUT type="submit" value="submit"></form>';
	return $str;
}
?>

