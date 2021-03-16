@echo off
ECHO Running scripts
mysql -u root -ppassword < C:/node/codeforthefences/scripts/mysql/resetDb.sql
ECHO Database dropped/created
mysql -u root -ppassword < C:/node/codeforthefences/scripts/mysql/design.sql
ECHO Database design added
mysql -u root -ppassword < C:/node/codeforthefences/scripts/mysql/sampleData_Base.sql
ECHO Database sample data added
pause
