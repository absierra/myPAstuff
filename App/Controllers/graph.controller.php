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
    function isFee($value){
    	if($value == 'Charges for Services') return true;
    	else if($value == 'Net Sales') return true;
    	else if($value == 'Permits and Licenses') return true;
    	else if($value == 'Rental Income') return true;
    	else if($value == 'From Other Agencies') return true;
    	else if($value == 'Charges to Other Funds') return true;
    	else if($value == 'Charge for Services') return true;
    	else if($value == 'Fees Licenses and Permits') return true;
    	else if($value == 'Interest and Rental Income') return true;
    	else if($value == 'Intergovernmental Revenues') return true;
    	else if($value == 'Internal Service Charges') return true;
    	else if($value == 'LandL Assessments') return true;
    	else if($value == 'Motor Vehicle in Lieu') return true;
    	else if($value == 'Other Intergovernmental') return true;
    	else if($value == 'Other Sources') return true;
    	else if($value == 'Rental Income') return true;
    	else return false;
    }
    $values = array();
    $values['fund'] = WebApplication::get('fund')?WebApplication::get('fund'):false;
    $values['department'] = WebApplication::get('department')?WebApplication::get('department'):false;
    $values['category'] = WebApplication::get('category')?WebApplication::get('category'):false;
    $dataset = WebApplication::get('dataset');
    $focus = WebApplication::get('target')?mapPlural(WebApplication::get('target')):false;
    $filename = 'Cache/budget/'.md5(json_encode(array_merge(
        $values,
        array(
            'focus' => $focus,
            'dataset' => $dataset
        )
    ), true)).'.json';
    $data = array();
    if(false || !file_exists($filename)){
        if($dataset=='financial'){
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
			Logger::log("query: ".$query);
			Logger::log(json_encode($results));
			$depth = (!$values[$focus])? 0 : (strstr($values[$focus], ':') ? 2 : 1);
			$numExpenses = 0;
			foreach($results as $item){
				if($item->get('ledger_type') == 'Expense') $numExpenses += 1;
			}
			foreach($results as $item){
				if($focus == 'revenue_expense'){
					$series = ($item->get('ledger_type')=='Expense')?'Expenses':'Revenues';
					if($series == 'Revenues' && isFee($item->get('ledger_description'))){
						$data[$series][$item->get('year')]['revenue_expense'] += (float)$item->get('amount');
					}
					else if($series == 'Expenses'){
						$data[$series][$item->get('year')]['revenue_expense'] += (float)$item->get('amount');
					}
				}
				else{			
					if($item->get('ledger_type') == 'Expense') $transactionType = 'expenses';
					if($item->get('ledger_type') == 'Transfers In') $transactionType = 'transfersin';
					if($item->get('ledger_type') == 'Transfers Out') $transactionType = 'transfersout';
					if($item->get('ledger_type') == 'Revenue') $transactionType = 'revenue';
					$isAFee = isFee($item->get('ledger_description'));
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
					
					if($numExpenses > 0 && $focus != 'category'){
						$data[$item->get($index)][$item->get('year')]['expenses'] += 0;
					}
					if($isAFee){
						$data[$item->get($index)][$item->get('year')]['fee_revenue'] += (float)$item->get('amount');
					}
				}
			}

		    $renderer->assign('data', $data);
        }else{
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
            $results = Data::search('EmployeeData', $query);
            $depth = (!$values[$focus])? 0 : (strstr($values[$focus], ':') ? 2 : 1);
            //results is now an arrow of rows, filtered by the selected department/division
            foreach($results as $item){
                if($focus == 'department'){
                    //if (depth == 0) $data[$item->get('department')][$item->get('year')]['revenue'] += (float)$item->get('fte');
                    if (depth == 0) $data[$item->get('division')][$item->get('year')]['revenue'] += (float)$item->get('fte');
                	else if (depth == 1 || depth == 2) $data[$item->get('division')][$item->get('year')]['revenue'] += (float)$item->get('fte');
                	$data[$item->get('division')][$item->get('year')]['revenue'] += 0;
                }
                else if($focus == 'title'){
                    $data[$item->get('title')][$item->get('year')]['fte'] += (float)$item->get('fte');
                    $data[$item->get('title')][$item->get('year')]['salary'] += (float)$item->get('salary');
                }
            }
			/*if(count($data) == 0){
				if($focus == 'title'){
					$data['No Employees']['2009']['fte'] = 0;
					$data['No Employees']['2010']['fte'] = 0;
					$data['No Employees']['2011']['fte'] = 0;
					$data['No Employees']['2012']['fte'] = 0;
					$data['No Employees']['2013']['fte'] = 0;
					$data['No Employees']['2013']['salary'] = 0;
				}
				else{
					$data['No Employees']['2009']['revenue'] = 0;
					$data['No Employees']['2010']['revenue'] = 0;
					$data['No Employees']['2011']['revenue'] = 0;
					$data['No Employees']['2012']['revenue'] = 0;
					$data['No Employees']['2013']['revenue'] = 0;
				}
			}*/
            $renderer->assign('data', $data);
        }
        file_put_contents($filename,json_encode($data));
    }else{
        $data = json_decode(file_get_contents($filename), true);
        $renderer->assign('data', $data);
    }

?>
