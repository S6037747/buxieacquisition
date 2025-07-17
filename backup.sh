#!/bin/sh

while true; do
  TIMESTAMP=$(date +%F-%H-%M)

  # Cleanup: delete backups older than 12 weeks (84 days)
  find /backups -maxdepth 1 -type d -mtime +84 -exec rm -rf {} \;

  mongodump --uri='mongodb://root:root123@mongodb:27017/database?authSource=admin&directConnection=true' --out=/backups/$TIMESTAMP
  node ../backups/logBackup.js

  sleep 604800  # 7 days
done