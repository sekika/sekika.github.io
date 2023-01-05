#!/bin/sh
FILE=unsoda.sqlite
sqlite3 $FILE '.once tables.txt' '.schema'
cat tables.txt | awk '{print $3}' | sed -e "s/\`//g" | while read TABLE
do
    sqlite3 $FILE ".mode json" ".once "$TABLE".json" "SELECT * from '"$TABLE"'"
done

