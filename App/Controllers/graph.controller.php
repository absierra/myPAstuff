<?php
    $category = WebApplication::get('category');
    $department = WebApplication::get('department');
    $fund = WebApplication::get('fund');
    $disc = array();
    if($department) $disc[] = 'department_division=\''.$department.'\'';
    if($fund) $disc[] = 'superfund_fund=\''.$fund.'\'';
    if($category) $disc[] = 'ledger_type_ledger_description=\''.$category.'\'';
    $results = Data::search('BudgetData', implode(' && ', $disc));
    $data = array();
    if( ! $fund ) $data['fund'] = array();
    if( ! $department ) $data['department'] = array();
    if( ! $category ) $data['category'] = array();
    foreach($results as $item){
        
    }
    $renderer->assign('data', $results);
?>