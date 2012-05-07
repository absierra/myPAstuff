<?php
    class Fund extends MongoData{
        public static $fields = array(
            'id',
            'name'
        );

        public static $name = 'funds';

        function __construct($id = null, $field = null){
            $this->database = 'pa_budget_data';
            $this->tableName = self::$name;
            parent::__construct($id, $field);
        }
    }