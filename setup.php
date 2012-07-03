<?php
    $start_time = Logger::processing_time(); //let's measure page load time
    Logger::$logToPHPErrorLog = false; //let's log app events into the PHP error log
    Logger::$logFile = '/Users/nlevine/Documents/Git/Budget/phplog.txt';
    
    MongoData::$functionalMode = FALSE;
    
    ResourceBundle::$minify = false; //encode the script
    ResourceBundle::$merge = true; //combine the scripts/styles
    
    function startsWith($haystack, $needle){
        return (substr($haystack, 0, strlen($needle)) === $needle);
    }
    function contains_in_array($needle, &$haystack){
        foreach($haystack as $key => $value) if(strpos($value, $needle) !== false) return true;
        return false;
    }
    
    function uniqueCategories(){
        $filename = './Cache/budget/unique.json';
        if(false || !file_exists($filename)){
            $results = Data::query('BudgetData');
            $data = array(
                'funds' => array(),
                'departments' => array(),
                'categories' => array()
            );
            foreach($results as $result){
                if(!in_array($result['superfund'], $data['funds'])) $data['funds'][] = $result['superfund'];
                if(!in_array($result['superfund_fund'], $data['funds']))
                    $data['funds'][] = $result['superfund_fund'];
                if(!in_array($result['ledger_type'], $data['categories'])) $data['categories'][] = $result['ledger_type'];
                if(!in_array($result['ledger_type_ledger_description'], $data['categories']))
                    $data['categories'][] = $result['ledger_type_ledger_description'];
                $dep = $result['division']?$result['department'].':'.$result['division']:$result['department'];
                if(!in_array($result['department'], $data['departments'])) $data['departments'][] = $result['department'];
                if(!in_array($dep, $data['departments']))
                    $data['departments'][] = $dep;
            }
            file_put_contents($filename,json_encode($data));
            return $data;
        }else{
            return json_decode(file_get_contents($filename), true);
        }
        
    }
    
    function categoryDependencies(&$data, $unique, $dependencyTree, $values){
        $fund = $values['fund'];
        $category = $values['category'];
        $department = $values['department'];
        $results = $dependencyTree;
        //handle selection possibilities
        if( ($department && $department != '*') ){
            $data['departments'] = array();
            foreach ($unique['departments'] as $name){
                if(startsWith($name, $department)){
                    $data['departments'][] = $name;
                }
            }
        }
        if( ($fund && $fund != '*') ){
            $data['funds'] = array();
            foreach ($unique['funds'] as $name){
                if(startsWith($name, $fund)){
                    $data['funds'][] = $name;
                }
            }
        }
        //handle fund selection
        if( ($fund && $fund != '*') ){
            $data['funds'] = array_values($data['funds']);
            foreach($data['categories'] as $key => $item){
                if( !in_array( $item, $results['funds'][$fund]['ledgers'] ) ){
                    unset($data['categories'][$key]);
                }
            }
            $data['categories'] = array_values($data['categories']);
            foreach($data['departments'] as $key => $item){
                if( 
                    (!in_array( $item, $results['funds'][$fund]['divisions'] )) &&
                    (!contains_in_array($item, $results['funds'][$department]['divisions']))
                ){
                    unset($data['departments'][$key]);
                }
            }
            $data['departments'] = array_values($data['departments']);
        }
        // handle fund parents
        foreach ($data['funds'] as $fund){
            foreach ($unique['funds'] as $name){
                if(startsWith($fund, $name) && !in_array($name, $data['funds'])){ // is parent?
                    $data['funds'][] = $name;
                }
            }
        }
        
        //handle department selection
        if( ($department && $department != '*') ){
            $data['departments'] = array_values($data['departments']);
            foreach($data['categories'] as $key => $item){
                if( !in_array( $item, $results['divisions'][$department]['ledgers'] ) ){
                    unset($data['categories'][$key]);
                }
            }
            $data['categories'] = array_values($data['categories']);
            foreach($data['funds'] as $key => $item){
                if( 
                    (!in_array( $item, $results['divisions'][$department]['funds'] )) &&
                    (!contains_in_array($item, $results['divisions'][$department]['funds']))
                ){
                    unset($data['funds'][$key]);
                }
            }
            $data['funds'] = array_values($data['funds']);
        }
        // handle departmental parents
        foreach ($data['departments'] as $department){
            foreach ($unique['departments'] as $name){
                if(startsWith($department, $name) && !in_array($name, $data['departments'])){ // is parent?
                    $data['departments'][] = $name;
                }
            }
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
