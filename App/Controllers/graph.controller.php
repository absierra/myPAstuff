<?php
    //todo: add filtering by other columns
    $incomingType = WebApplication::get('type');
    $values = array();
    $unique = uniqueCategories();
    $values['fund'] = WebApplication::get('fund')?WebApplication::get('fund'):false;
    $values['department'] = WebApplication::get('department')?WebApplication::get('department'):false;
    $values['category'] = WebApplication::get('category')?WebApplication::get('category'):false;
    $mapping = json_decode(file_get_contents('Data/map.json'), true);
    $data = $unique;
    $dependencies = categoryDependencies(&$data, $unique, $mapping, $values);
    //print_r($values); echo('|'.$incomingType.'|'.$values[$incomingType].'|'); exit();
    if(!$values[$incomingType]) throw new Exception('no value for type :'.$incomingType);
    $name = $values[$incomingType];
    $deep = strstr($name, ':')?true:false; //is this a second level request (aggregate)
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
    $focus = WebApplication::get('target')?WebApplication::get('target'):false;
    if($focus) switch($focus){
        case 'fund': $focus = 'superfund'; break;
        case 'department': $focus = 'department'; break;
        case 'category': $focus = 'ledger_description'; break;
    }
    foreach($results as $item){
        if(
            in_array($item->get('superfund_fund'), $dependencies['funds']) ||
            in_array($item->get('department_division'), $dependencies['departments']) ||
            in_array($item->get('ledger_type_ledger_description'), $dependencies['categories'])
        ){
            if($item->get('ledger_type') == 'Expense') $transactionType = 'expenses';
            if($item->get('ledger_type') == 'Transfers In') $transactionType = 'transfersin';
            if($item->get('ledger_type') == 'Transfers Out') $transactionType = 'transfersout';
            if($item->get('ledger_type') == 'Revenue') $transactionType = 'revenue';
            //print_r($item); exit();
            $isTax = preg_match('~[Tt][Aa][Xx]~', $item->get('ledger_description'));
            if($deep){
                if($focus){
                    $data[$item->get($focus)][$item->get('year')][$transactionType] += (float)$item->get('amount');
                    if($isTax) $data[$item->get($focus)][$item->get('year')]['tax_revenue'] += (float)$item->get('amount');
                }else{
                    $data[$name][$item->get('year')][$transactionType] += (float)$item->get('amount');
                    if($isTax) $data[$name][$item->get('year')]['tax_revenue'] += (float)$item->get('amount');
                }
            }else{
                if($focus){
                    $data[$item->get($focus)][$item->get('year')][$transactionType] += (float)$item->get('amount');
                    if($isTax) $data[$item->get($focus)][$item->get('year')]['tax_revenue'] += (float)$item->get('amount');
                }else{
                    $data[$item->get($uniqueType)][$item->get('year')][$transactionType] += (float)$item->get('amount');
                    if($isTax) $data[$item->get($uniqueType)][$item->get('year')]['tax_revenue'] += (float)$item->get('amount');
                }
            }
        }
    }
    $renderer->assign('data', $data);
?>