@echo off
cd /d %~dp0

:run_script
if "%1"=="" goto end_script
node src/index.js %1 16/9
shift
goto run_script

:end_script

