<?php
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
    $values = array();
    $values['fund'] = WebApplication::get('fund')?WebApplication::get('fund'):false;
    $values['department'] = WebApplication::get('department')?WebApplication::get('department'):false;
    $values['category'] = WebApplication::get('category')?WebApplication::get('category'):false;
    $dataset = WebApplication::get('dataset');
    $focus = WebApplication::get('target')?mapPlural(WebApplication::get('target')):false;
    if($dataset=='financial'){
		$filename = 'Cache/budget/'.md5(json_encode(array_merge(
			$values,
			array(
				'focus' => $focus
			)
		), true)).'.json';
		if(false || !file_exists($filename)){
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
			$depth = (!$values[$focus])? 0 : (strstr($values[$focus], ':') ? 2 : 1);
			$data = array();
			foreach($results as $item){
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
			file_put_contents($filename,json_encode($data));
		}else{
			$data = json_decode(file_get_contents($filename), true);
		}
		$renderer->assign('data', $data);
	}
	else{
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
		$data = array();
		$results = Data::search('EmployeeData', $query);
		$depth = (!$values[$focus])? 0 : (strstr($values[$focus], ':') ? 2 : 1);
		//results is now an arrow of rows, filtered by the selected department/division
		foreach($results as $item){
			if($focus == 'department'){
				switch($depth){
					case 0:
						$data[$item->get('department')][$item->get('year')]['revenue'] += (float)$item->get('fte');
					case 1:
						$data[$item->get('department')][$item->get('year')]['revenue'] += (float)$item->get('fte');
					case 2:
						$data[$item->get('division')][$item->get('year')]['revenue'] += (float)$item->get('fte');
				}
			}
			else if($focus == 'title'){
				$data[$item->get('title')][$item->get('year')]['revenue'] += (float)$item->get('fte');
			}
			else if($focus == 'salary'){
				$data[$item->get('title')][$item->get('year')]['revenue'] += (float)$item->get('salary');
			}
		}
		if(count($data) == 0){
			$data['Fire']['2009']['revenue'] = 0;
		}
		$renderer->assign('data', $data);
	}
?>