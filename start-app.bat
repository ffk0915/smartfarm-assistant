@echo off
start "Dev Server" cmd /k "npm run dev"
timeout /t 6
start "Cloudflare Tunnel" cmd /k "npx cloudflared tunnel --url http://localhost:5175"