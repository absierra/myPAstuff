#!/bin/sh
mongoimport -d lafayettebudgets -c budget -f "year,superfund,fund,superfund_fund,department,division,department_division,ledger_type,ledger_description,ledger_type_ledger_description,amount" --type csv lafayette_budgets.csv
mongoimport -d lafayettebudgets -c employees -f "year,superfund,fund,department,division,title,fte,salary" --type csv lafayette_ftebudget.csv
