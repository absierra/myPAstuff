<?php
    class EmployeeData extends MongoData{
        public static $fields = array(
            'year',
            'superfund',
            'fund',
            'department',
            'division',
			'fte',
			'salary'
        );

        public static $name = 'employees';

        function __construct($id = null, $field = null){
            $this->database = 'pa_budget_data';
            $this->tableName = self::$name;
            parent::__construct($id, $field);
        }
    }
?>