#!/bin/bash

# ============================================================================
# Push Frontend Changes to GitHub
# Repository: https://github.com/Trunks23134/CAMPUS-ONE-FE.git
# Branch: fix/applicant-admin-hydration
# ============================================================================

echo "🚀 Starting Git Push Process..."
echo ""

# Step 1: Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    git remote add origin https://github.com/Trunks23134/CAMPUS-ONE-FE.git
fi

# Step 2: Fetch latest changes
echo "📥 Fetching latest changes from remote..."
git fetch origin

# Step 3: Create new branch
BRANCH_NAME="fix/applicant-admin-hydration"
echo "🌿 Creating new branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME 2>/dev/null || git checkout $BRANCH_NAME

# Step 4: Stage only code files (exclude MD and SQL)
echo "📝 Staging code files..."
git add src/app/components/UnifiedLoginPage.tsx
git add src/app/admin/components/UnifiedAdminLayout.tsx

# Step 5: Show what will be committed
echo ""
echo "📋 Files to be committed:"
git status --short

# Step 6: Commit changes
echo ""
echo "💾 Committing changes..."
git commit -m "fix: resolve hydration errors in admin login and layout

- Fixed UnifiedLoginPage to use useEffect for client-only code
- Fixed UnifiedAdminLayout to prevent SSR/client mismatch
- Added isMounted state to ensure proper hydration
- Portal switcher now renders only after mount

Changes:
- src/app/components/UnifiedLoginPage.tsx
- src/app/admin/components/UnifiedAdminLayout.tsx"

# Step 7: Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin $BRANCH_NAME

echo ""
echo "✅ Done! Your changes have been pushed to:"
echo "   Repository: https://github.com/Trunks23134/CAMPUS-ONE-FE"
echo "   Branch: $BRANCH_NAME"
echo ""
echo "🔗 Create a Pull Request:"
echo "   https://github.com/Trunks23134/CAMPUS-ONE-FE/pull/new/$BRANCH_NAME"
echo ""
