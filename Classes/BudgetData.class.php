<?php
    class BudgetData extends MongoData{
        public static $fields = array(
            'year',
            'fund',
            'department',
            'division',
            'ledger_type',
            'ledger_description',
            'amount'
        );

        public static $name = 'budget';

        function __construct($id = null, $field = null){
            $this->database = 'pa_budget_data';
            $this->tableName = self::$name;
            parent::__construct($id, $field);
        }
    }