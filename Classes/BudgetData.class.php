<?php
    class BudgetData extends MongoData{
        public static $fields = array(
            'year',
            'fund',
            'department',
            'division',
            'department_division',
            'ledger_type',
            'ledger_description',
            'amount',
            'ledger_type_ledger_description',
            'superfund_fund',
        );

        public static $name = 'budget';

        function __construct($id = null, $field = null){
            $this->database = 'pa_budget_data';
            $this->tableName = self::$name;
            parent::__construct($id, $field);
        }
    }
?>
