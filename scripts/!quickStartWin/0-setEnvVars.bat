@echo off
set npath="C:\node\codeforthefences"
echo Enter path to Code for the Fences root folder:
echo (Press enter for default) %npath%:
set /p npath=
setx CFTF_HOME %npath%
pause
