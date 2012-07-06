#!/bin/sh
mongoimport -d saratogabudgets -c budget -f "year,superfund,fund,superfund_fund,department,division,department_division,ledger_type,ledger_description,ledger_type_ledger_description,amount" --type csv saratoga_budgets.csv
mongoimport -d saratogabudgets -c employees -f "year,superfund,fund,department,division,title,fte,salary" --type csv saratoga_ftebudget.csv
