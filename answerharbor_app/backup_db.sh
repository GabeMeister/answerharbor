#!/bin/bash

# Backup the current production database to the ci server
DATE=`date +%Y-%m-%d_%H:%M:%S`
scp /home/gabe/answerharbor/answerharbor/answerharbor_app/answerharbor.db gabe@104.236.170.47:/home/gabe/db_backups/answerharbor/answerharbor-$DATE.db
