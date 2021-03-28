start tsc.cmd
start node --inspect .\mainserver.js

cd ../client
start tsc.cmd
start http://localhost:8000/