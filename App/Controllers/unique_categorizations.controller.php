<?php
    $results = Data::search('BudgetData');
    $data = array(
        'funds' => array(),
        'departments' => array(),
        'categories' => array()
    );
    foreach($results as $result){
        if(!in_array($result->get('superfund_fund'), $data['funds']))
            $data['funds'][] = $result->get('superfund_fund');
        if(!in_array($result->get('ledger_type_ledger_description'), $data['categories']))
            $data['categories'][] = $result->get('ledger_type_ledger_description');
        $dep = $result->get('division')?$result->get('department').':'.$result->get('division'):$result->get('department');
        if(!in_array($dep, $data['departments']))
            $data['departments'][] = $dep;
    }
    $renderer->assign('data', $data);
?>