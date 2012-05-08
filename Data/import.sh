#!/bin/sh
mongoimport -d pabudgets -c budget -f "year,superfund,fund,superfund_fund,department,division,department_division,ledger_type,ledger_description,ledger_type_ledger_description,amount" --type csv budgets.csv
