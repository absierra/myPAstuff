<?php
    $start_time = Logger::processing_time(); //let's measure page load time
    Logger::$logToPHPErrorLog = true; //let's log app events into the PHP error log
    
    MongoData::$functionalMode = FALSE;
    
    function uniqueCategories(){
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
        return $data;
    }
    
    function currentUser($force = true){
        if(WebApplication::getGet('force_login') || WebApplication::getGet('fl')) $force = true;
        if($user = WebApplication::getSession('user')){ // first, try to get the user from the session
            WebApplication::setSession('user', $user);
            //if we've been bounced, jump to the last place we were bounced from now that we're logged in
            if($location = WebApplication::getSession('bounce_location')){
                WebApplication::setSession('bounce_location');
                WebApplication::redirect($location);
            }
        }else if($force === true){ //if we're in force mode and there's no user, boot em
            WebApplication::setSession('bounce_location', WebApplication::url());
            WebApplication::redirect('/');
        }
        PageRenderer::$core_data['user'] = $user;
        return $user;
    }