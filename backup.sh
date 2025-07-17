#!/bin/sh

while true; do
  TIMESTAMP=$(date +%F-%H-%M)
  mongodump --uri='mongodb://root:root123@mongodb:27017/database?authSource=admin&directConnection=true' --out=/backups/$TIMESTAMP
  sleep 86400
done