@echo off
ECHO Running scripts
mysql -u root < C:/node/codeforthefences/scripts/mysql/resetDb.sql
ECHO Database dropped/created
mysql -u root < C:/node/codeforthefences/scripts/mysql/schema.sql
ECHO Database schema added
pause
