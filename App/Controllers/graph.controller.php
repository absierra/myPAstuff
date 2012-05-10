<?php
    //todo: add filtering by other columns
    $name = WebApplication::get('name');
    $deep = strstr($name, ':')?true:false;
    switch($incomingType = WebApplication::get('type')){
        case 'fund': $uniqueType = 'superfund_fund'; break;
        case 'department': $uniqueType = 'department_division'; break;
        case 'category': $uniqueType = 'ledger_type_ledger_description'; break;
    }
    if($deep){
        $type = $uniqueType;
    }else{
        switch($incomingType = WebApplication::get('type')){
            case 'fund': $type = 'superfund'; break;
            case 'department': $type = 'department'; break;
            case 'category': $type = 'ledger_type'; break;
        }
    }
    $results = Data::search('BudgetData', $type.'=\''.$name.'\'');
    $data = array();
    foreach($results as $item){
        if($item->get('ledger_type') == 'Expense') $transactionType = 'expenses';
        if($item->get('ledger_type') == 'Revenue') $transactionType = 'revenue';
        if($deep){
            $data[$item->get('year')][$transactionType] += (float)$item->get('amount');
        }else{
            $data[$item->get($uniqueType)][$item->get('year')][$transactionType] += (float)$item->get('amount');
        }
    }
    $renderer->assign('data', $data);
?>