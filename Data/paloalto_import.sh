#!/bin/sh
mongoimport -d pabudgets -c budget -f "year,superfund,fund,superfund_fund,department,division,department_division,ledger_type,ledger_description,ledger_type_ledger_description,amount" --type csv paloalto_budgets.csv
mongoimport -d pabudgets -c employees -f "year,superfund,fund,department,division,title,fte,salary" --type csv paloalto_ftebudget.csv