@echo off
ECHO Running scripts
mysql -u root -ppassword < C:/node/codeforthefences/scripts/mysql/resetDb.sql
ECHO Database dropped/created
mysql -u root -ppassword < C:/node/codeforthefences/scripts/mysql/graphDesign.sql
ECHO Database design added
mysql -u root -ppassword < C:/node/codeforthefences/scripts/mysql/graphSampleData_Base.sql
ECHO Database sample data added
pause
