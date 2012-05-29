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
    if(!$values[$incomingType]) throw new Exception('no value for type :'.$incomingType);
    $name = $values[$incomingType];
    $deep = strstr($name, ':')?true:false; //is this a second level request (aggregate)
    switch($incomingType){
        case 'fund': $uniqueType = 'superfund_fund'; break;
        case 'department': $uniqueType = 'department_division'; break;
        case 'category': $uniqueType = 'ledger_type_ledger_description'; break;
    }
    if($deep){
        $type = $uniqueType;
    }else{
        switch($incomingType){
            case 'fund': $type = 'superfund'; break;
            case 'department': $type = 'department'; break;
            case 'category': $type = 'ledger_type'; break;
        }
    }
    $results = Data::search('BudgetData', $type.'=\''.$name.'\'');
    $data = array();
    $focus = WebApplication::get('target')?WebApplication::get('target'):false;
    foreach($results as $item){
        if(
            in_array($item->get('superfund_fund'), $dependencies['funds']) ||
            in_array($item->get('department_division'), $dependencies['departments']) //||
            //in_array($item->get('ledger_type_ledger_description'), $dependencies['categories'])
        ){
            if($item->get('ledger_type') == 'Expense') $transactionType = 'expenses';
            if($item->get('ledger_type') == 'Transfers In') $transactionType = 'transfersin';
            if($item->get('ledger_type') == 'Transfers Out') $transactionType = 'transfersout';
            if($item->get('ledger_type') == 'Revenue') $transactionType = 'revenue';
            $isTax = preg_match('~[Tt][Aa][Xx]~', $item->get('ledger_description'));
            if($deep) $index = $name;
            else $index = $item->get($uniqueType);
            if($focus){
                
                $focusHasSelection = ( array_key_exists($focus, $values) && $values[$focus] ) 
                ;
                //echo('[FS'.$focusHasSelection.'|'.$incomingType.'|'.$values[$focus].']');
                switch($focus){
                    case 'fund': 
                        if($focusHasSelection) $index = $item->get('superfund_fund');
                        else $index = $item->get('superfund');
                        break;
                    case 'department':
                        if($focusHasSelection) $index = $item->get('department_division');
                        else $index = $item->get('department');
                        break;
                    case 'category': 
                        if($focusHasSelection) $index = $item->get('ledger_type_ledger_description');
                        else $index = $item->get('ledger_description');
                        break;
                }
            }
            $data[$index][$item->get('year')][$transactionType] += (float)$item->get('amount');
            if($isTax) $data[$index][$item->get('year')]['tax_revenue'] += (float)$item->get('amount');
        }
    }
    $renderer->assign('data', $data);
?>