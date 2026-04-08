@echo off
echo Starting reachability check...
netstat -ano > %~dp0netstat_out.txt
echo Netstat done.
node -v > %~dp0node_out.txt 2>&1
echo Node checked.
npm -v > %~dp0npm_out.txt 2>&1
echo NPM checked.
echo Done.
