@echo off
echo Installing Python dependencies for subscription management...
cd /d "%~dp0"
pip install -r requirements.txt
echo.
echo Setup complete! You can now use the Python subscription manager:
echo.
echo Examples:
echo   python manage_subscription.py list
echo   python manage_subscription.py upgrade user123 premium
echo   python manage_subscription.py revoke user123
echo   python manage_subscription.py active
echo.
pause
