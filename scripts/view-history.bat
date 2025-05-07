@echo off
echo =================================================
echo View Git Commit History
echo =================================================
echo.
echo Showing recent commits:
git log --graph --pretty=format:"%%C(auto)%%h - %%C(bold blue)%%an%%C(auto), %%C(bold green)%%ar%%C(auto): %%s" --abbrev-commit -10
echo.
echo =================================================
echo Press any key to exit...
echo =================================================
pause