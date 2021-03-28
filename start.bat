start tsc.cmd
timeout 2
start node --inspect .\mainserver.js

cd ./client
start tsc.cmd
timeout 2
start http://localhost:8000/