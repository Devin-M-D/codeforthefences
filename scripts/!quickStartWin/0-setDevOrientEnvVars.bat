@echo off
REM set opath="D:\code\tools\orientdb\orientdb-3.0.28"
REM echo Enter path to Orient Db bin folder:
REM echo (Press enter for default) %opath%:
REM set /p opath=
REM setx ORIENTDB_HOME %opath%

set npath="C:\node\cookbook"
echo Enter path to cookbook root folder:
echo (Press enter for default) %npath%:
set /p npath=
setx COOKBOOK_HOME %npath%
pause
