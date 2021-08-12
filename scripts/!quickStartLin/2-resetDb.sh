echo Running scripts
mysql -u root -ppassword < /www/codeforthefences/scripts/mysql/resetDb.sql
echo Database dropped/created
mysql -u root -ppassword < /www/codeforthefences/scripts/mysql/design.sql
echo Database design added
mysql -u root -ppassword < /www/codeforthefences/scripts/mysql/sampleData.sql
echo Database sample data added
