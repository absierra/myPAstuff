<?php
    $unique = uniqueCategories();
    $results = json_decode(file_get_contents('Data/map.json'), true);
    $values = array();
    $values['fund'] = WebApplication::get('fund')?WebApplication::get('fund'):false;
    $values['department'] = WebApplication::get('department')?WebApplication::get('department'):false;
    $values['category'] = WebApplication::get('category')?WebApplication::get('category'):false;
    $data = $unique;
    categoryDependencies(&$data, $unique, $results, $values);
    $renderer->assign('data', $data);

?>