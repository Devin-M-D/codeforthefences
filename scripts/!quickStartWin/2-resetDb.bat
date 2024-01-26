@echo off
ECHO Running scripts
mysql -u root -ppassword < C:/projects/codeforthefences/scripts/mysql/resetDb.sql
ECHO Database dropped/created
mysql -u root -ppassword < C:/projects/codeforthefences/scripts/mysql/design.sql
ECHO Database design added
mysql --default-character-set=utf8 -u root -ppassword < C:/projects/codeforthefences/scripts/mysql/sampleData.sql
ECHO Database sample data added
pause
