#!/bin/sh
mongoimport -d salinasbudgets -c budget -f "year,superfund,fund,superfund_fund,department,division,department_division,ledger_type,ledger_description,ledger_type_ledger_description,amount" --type csv salinas_budgets.csv
mongoimport -d salinasbudgets -c employees -f "year,superfund,fund,department,division,title,fte,salary" --type csv salinas_ftebudget.csv
