@echo off
title Genesis AI - Subscription Manager
color 0B

echo.
echo ========================================
echo    GENESIS AI - SUBSCRIPTION MANAGER
echo ========================================
echo.
echo Starting interactive subscription manager...
echo.

cd /d "%~dp0"
python interactive_subscription_manager.py

pause
