@echo off
git add -A
git commit -m "fix: resilient PKCE redirect_uri calculation and explicit error diagnostics"
git push origin main
echo Done.
