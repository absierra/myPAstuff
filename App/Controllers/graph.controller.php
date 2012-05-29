<?php
    //todo: add filtering by other columns
    function mapPlural($value){
        switch($value){
            case 'funds': return 'fund';
            case 'departments': return 'department';
            case 'categories': return 'category';
        }
        return $value;
    }
    function mapInternal($value, $deep=false){
        if($deep){
            switch($value){
                case 'fund': return 'superfund_fund';
                case 'department': return 'department_division';
                case 'category': return 'ledger_type_ledger_description';
            }
        }else{
            switch($value){
                case 'fund': return 'superfund';
                case 'department': return 'department';
                case 'category': return 'ledger_type';
            }
        }
        return $value;
    }
    //OLD, deprecated crap
    /*$incomingType = WebApplication::get('type');
    $values = array();
    $unique = uniqueCategories();
    $values['fund'] = WebApplication::get('fund')?WebApplication::get('fund'):false;
    $values['department'] = WebApplication::get('department')?WebApplication::get('department'):false;
    $values['category'] = WebApplication::get('category')?WebApplication::get('category'):false;
    $focus = WebApplication::get('target')?mapPlural(WebApplication::get('target')):false;
    $mapping = json_decode(file_get_contents('Data/map.json'), true);
    $data = $unique;
    $dependencies = categoryDependencies(&$data, $unique, $mapping, $values);
    if(!$values[$incomingType]) throw new Exception('no value for type :'.$incomingType);
    $name = $values[$incomingType];
    //echo('['.$values[$focus].'|'.$focus.']');
    if($values[$focus]){
        $name = $values[$focus];
        $incomingType = $values[$focus];
    }
    $deep = strstr($name, ':')?true:false; //is this a second level request (aggregate)
    $uniqueType = mapInternal($incomingType, true);
    /*switch($incomingType){
        case 'fund': $uniqueType = 'superfund_fund'; break;
        case 'department': $uniqueType = 'department_division'; break;
        case 'category': $uniqueType = 'ledger_type_ledger_description'; break;
    }
    if($deep){
        $type = $uniqueType;
    }else{
        //$type = mapInternal($incomingType);
        //echo($type);
        //*
        switch($incomingType){
            case 'fund': $type = 'superfund'; break;
            case 'department': $type = 'department'; break;
            case 'category': $type = 'ledger_type'; break;
        }/
        //echo(' '); echo($type); exit();
    }
    $results = Data::search('BudgetData', $type.'=\''.$name.'\'');
    $data = array();
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
                $subfocused = strstr($values[$focus], ':')?true:false;
                $focusHasSelection = ($values[$focus]) || $subfocused;
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
    }*/
    $values = array();
    $values['fund'] = WebApplication::get('fund')?WebApplication::get('fund'):false;
    $values['department'] = WebApplication::get('department')?WebApplication::get('department'):false;
    $values['category'] = WebApplication::get('category')?WebApplication::get('category'):false;
    $focus = WebApplication::get('target')?mapPlural(WebApplication::get('target')):false;
    $unique = uniqueCategories();
    $mapping = json_decode(file_get_contents('Data/map.json'), true);
    $data = $unique;
    $dependencies = categoryDependencies(&$data, $unique, $mapping, $values);
    $depth = (!$values[$focus])? 0 : (strstr($values[$focus], ':') ? 2 : 1);
    if($focus && $values[$focus])
        $results = Data::search('BudgetData', mapInternal($focus).'=\''.($values[$focus]).'\'');
    else $results = Data::search('BudgetData');
    $data = array();
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
            switch($depth){
                case 0:
                    $index = mapInternal($focus);
                    break;
                case 1:
                    $index = mapInternal($focus, true);
                    break;
                case 2:
                    $index = mapInternal($focus, true);
                    break;
            }
            //echo('['.$index.' : '.$depth.' : '.$focus.']');
            $data[$item->get($index)][$item->get('year')][$transactionType] += (float)$item->get('amount');
            if($isTax) $data[$item->get($index)][$item->get('year')]['tax_revenue'] += (float)$item->get('amount');
        }
    }
    //echo($depth.','.$focus);
    $renderer->assign('data', $data);
?>