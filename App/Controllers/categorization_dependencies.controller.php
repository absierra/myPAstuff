<?php
    $unique = uniqueCategories();
    $results = json_decode(file_get_contents('Data/map.json'), true);
    $category = WebApplication::get('category');
    $department = WebApplication::get('department');
    $fund = WebApplication::get('fund');
    $data = $unique;
    function startsWith($haystack, $needle){
        return (substr($haystack, 0, strlen($needle)) === $needle);
    }
    
    //handle category selection
    if( ($category && $category != '*') ){
        $data['categories'] = array();
        foreach ($unique['categories'] as $name){
            if(startsWith($name, $category)){
                $data['categories'][] = $name;
            }
        }
        $data['categories'] = array_values($data['categories']);
        foreach($data['funds'] as $key => $fundItem){
            if( !in_array( $fundItem, $results['ledgers'][$category]['funds'] ) ){
                unset($data['funds'][$key]);
            }
        }
        $data['funds'] = array_values($data['funds']);
        foreach($data['departments'] as $key => $departmentItem){
            if( !in_array( $departmentItem, $results['ledgers'][$category]['divisions'] ) ){
                unset($data['departments'][$key]);
            }
        }
        $data['departments'] = array_values($data['departments']);
    }
    
    //handle fund selection
    if( ($fund && $fund != '*') ){
        $data['funds'] = array();
        foreach ($unique['funds'] as $name){
            if(startsWith($name, $fund)){
                $data['funds'][] = $name;
            }
        }
        $data['funds'] = array_values($data['funds']);
        foreach($data['categories'] as $key => $item){
            if( !in_array( $item, $results['funds'][$fund]['ledgers'] ) ){
                unset($data['categories'][$key]);
            }
        }
        $data['categories'] = array_values($data['categories']);
        foreach($data['departments'] as $key => $item){
            if( !in_array( $item, $results['funds'][$fund]['divisions'] ) ){
                unset($data['departments'][$key]);
            }
        }
        $data['departments'] = array_values($data['departments']);
    }
    
    //handle department selection
    if( ($department && $department != '*') ){
        $data['departments'] = array();
        foreach ($unique['departments'] as $name){
            if(startsWith($name, $department)){
                $data['departments'][] = $name;
            }
        }
        $data['departments'] = array_values($data['departments']);
        foreach($data['categories'] as $key => $item){
            if( !in_array( $item, $results['divisions'][$department]['ledgers'] ) ){
                unset($data['categories'][$key]);
            }
        }
        $data['categories'] = array_values($data['categories']);
        foreach($data['funds'] as $key => $item){
            if( !in_array( $item, $results['divisions'][$department]['funds'] ) ){
                unset($data['funds'][$key]);
            }
        }
        $data['funds'] = array_values($data['funds']);
    }
    
    $renderer->assign('data', $data);
?>