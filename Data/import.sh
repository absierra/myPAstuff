#!/bin/sh
mongoimport -f "year,fund,department,division,ledger_type,ledger_description,amount" --type csv -d pabudget -c budget budgets.csv
