@title NG-START-HELPER
@echo off

set NODE_ENV=development
set MOCKAPI_ENABLE=N
set MOCKAPI_AUTOSAVE=N
set MOCKAPI_AUTOSAVE_FORCE=N

set /p enablemock=Enable mockAPI?(y/):
if "%enablemock%"=="y" set MOCKAPI_ENABLE=mock

set /p autosave=Auoto Save API Data?(y/):
if "%autosave%"=="y" set MOCKAPI_AUTOSAVE=save

if "%enablemock%"=="y" goto run

set /p forcesave=Force Save API Data?(y/):
if "%forcesave%"=="y" set MOCKAPI_AUTOSAVE_FORCE=force

:run
echo =======================================================
echo MOCKAPI_ENABLE         = %MOCKAPI_ENABLE%
echo MOCKAPI_AUTOSAVE       = %MOCKAPI_AUTOSAVE%
echo MOCKAPI_AUTOSAVE_FORCE = %MOCKAPI_AUTOSAVE_FORCE%
echo =======================================================

rem set DEBUG=express:*
npm run start
