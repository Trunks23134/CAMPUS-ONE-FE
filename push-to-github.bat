@echo off
REM ============================================================================
REM Push Frontend Changes to GitHub
REM Repository: https://github.com/Trunks23134/CAMPUS-ONE-FE.git
REM Branch: fix/applicant-admin-hydration
REM ============================================================================

echo.
echo ============================================================================
echo   Push Frontend Changes to GitHub
echo ============================================================================
echo.

REM Step 1: Check if we're in a git repository
if not exist .git (
    echo [ERROR] Not a git repository. Initializing...
    git init
    git remote add origin https://github.com/Trunks23134/CAMPUS-ONE-FE.git
)

REM Step 2: Fetch latest changes
echo [STEP 1] Fetching latest changes from remote...
git fetch origin

REM Step 3: Create new branch
set BRANCH_NAME=fix/applicant-admin-hydration
echo [STEP 2] Creating new branch: %BRANCH_NAME%
git checkout -b %BRANCH_NAME% 2>nul || git checkout %BRANCH_NAME%

REM Step 4: Stage only code files (exclude MD and SQL)
echo [STEP 3] Staging code files...
git add src/app/components/UnifiedLoginPage.tsx
git add src/app/admin/components/UnifiedAdminLayout.tsx

REM Step 5: Show what will be committed
echo.
echo [STEP 4] Files to be committed:
git status --short

REM Step 6: Commit changes
echo.
echo [STEP 5] Committing changes...
git commit -m "fix: resolve hydration errors in admin login and layout" -m "- Fixed UnifiedLoginPage to use useEffect for client-only code" -m "- Fixed UnifiedAdminLayout to prevent SSR/client mismatch" -m "- Added isMounted state to ensure proper hydration" -m "- Portal switcher now renders only after mount"

REM Step 7: Push to GitHub
echo.
echo [STEP 6] Pushing to GitHub...
git push -u origin %BRANCH_NAME%

echo.
echo ============================================================================
echo   SUCCESS! Your changes have been pushed
echo ============================================================================
echo.
echo   Repository: https://github.com/Trunks23134/CAMPUS-ONE-FE
echo   Branch: %BRANCH_NAME%
echo.
echo   Create a Pull Request:
echo   https://github.com/Trunks23134/CAMPUS-ONE-FE/pull/new/%BRANCH_NAME%
echo.
echo ============================================================================
echo.

pause
