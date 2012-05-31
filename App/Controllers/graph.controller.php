<?php
    //todo: add filtering by other columns
    $values = array();
    $values['fund'] = WebApplication::get('fund')?WebApplication::get('fund'):false;
    $values['department'] = WebApplication::get('department')?WebApplication::get('department'):false;
    $values['category'] = WebApplication::get('category')?WebApplication::get('category'):false;
    $filename = '/tmp/budget/'.md5(print_r(array_merge(
        $values,
        array(
            '' => ''
        )
    ), true)).'.json';
    if(true || !file_exists($filename)){
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
                    case 'fund': return 'fund';
                    case 'department': return 'division';
                    case 'category': return 'ledger_description';
                }
            }else{
                switch($value){
                    case 'fund': return 'superfund';
                    case 'department': return 'department';
                    case 'category': return 'ledger_type';
                    //case 'category': return 'ledger_description';
                }
            }
            return $value;
        }
        $focus = WebApplication::get('target')?mapPlural(WebApplication::get('target')):false;
        $disc = array();
        foreach($values as $key => $value){
            if($value){
                if(strpos($value, ':') === false){
                    $disc[] = mapInternal($key).'=\''.($value).'\'';
                }else{
                    $parts = explode(':', $value);
                    $parent = array_shift($parts);
                    $child = implode(':', $parts);
                    $disc[] = mapInternal($key).'=\''.($parent).'\'';
                    $disc[] = mapInternal($key, true).'=\''.($child).'\'';
                }
            }
        }
        $query = implode(' and ', $disc);
        $results = Data::search('BudgetData', $query);
        //$unique = uniqueCategories();
        //$mapping = json_decode(file_get_contents('Data/map.json'), true);
        $data = $unique;
        //$dependencies = categoryDependencies(&$data, $unique, $mapping, $values);
        $depth = (!$values[$focus])? 0 : (strstr($values[$focus], ':') ? 2 : 1);
        //if($focus && $values[$focus])
        //print_r($results); exit();
        //else $results = Data::search('BudgetData');
        $data = array();
        foreach($results as $item){
            if(
                //in_array($item->get('superfund_fund'), $dependencies['funds']) ||
                //in_array($item->get('department_division'), $dependencies['departments']) //||
                //in_array($item->get('ledger_type_ledger_description'), $dependencies['categories'])
                true
            ){
                if($item->get('ledger_type') == 'Expense') $transactionType = 'expenses';
                if($item->get('ledger_type') == 'Transfers In') $transactionType = 'transfersin';
                if($item->get('ledger_type') == 'Transfers Out') $transactionType = 'transfersout';
                if($item->get('ledger_type') == 'Revenue') $transactionType = 'revenue';
                $isTax = preg_match('~[Tt][Aa][Xx]~', $item->get('ledger_description'));
                switch($depth){
                    case 0:
                        if($focus == 'category') $index = mapInternal($focus, true);
                        else $index = mapInternal($focus);
                        break;
                    case 1:
                        $index = mapInternal($focus).'_'.mapInternal($focus, true);
                        break;
                    case 2:
                        $index = mapInternal($focus).'_'.mapInternal($focus, true);
                        break;
                }
                if($focus == 'category') $index = mapInternal($focus, true); //(make sure we have deep data for categories)
                $data[$item->get($index)][$item->get('year')][$transactionType] += (float)$item->get('amount');
                if($isTax) $data[$item->get($index)][$item->get('year')]['tax_revenue'] += (float)$item->get('amount');
            }
        }
        //file_put_contents($filename,json_encode($data));
    }else{
        $data = json_decode(file_get_contents($filename), true);
    }
    //echo(json_encode(array_keys($data))); //exit();
    /*
    $func = function($value) use(&$func) {
        return $value->get('superfund');
    };
    echo(json_encode(array_map($func, $results))); exit();*/
    $renderer->assign('data', $data);
?>