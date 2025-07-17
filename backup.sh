#!/bin/sh

while true; do
  TIMESTAMP=$(date +%F-%H-%M)

  find /backups -maxdepth 1 -type d -mtime +84 -exec rm -rf {} \;

  mongodump --uri='mongodb://root:root123@mongodb:27017/database?authSource=admin&directConnection=true' --out=/backups/$TIMESTAMP

  docker exec backend node /app/backups/logBackup.js

  sleep 604800
done