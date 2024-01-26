@echo off
set npath="C:\projects\codeforthefences"
echo Enter path to Code for the Fences root folder (Press enter for default) %npath%:
set /p npath=
setx CFTF_HOME %npath%

set npath="C:\Program Files\MySQL\MySQL Server 8.3\bin"
echo Enter path to mysql root folder (Press enter for default) %npath%:
set /p npath=
setx MYSQL_HOME %npath%

setx /M path "%path%;%npath%"
echo Mysql added to path
pause
