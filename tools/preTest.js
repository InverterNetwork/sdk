import { spawn } from 'bun'

// Run the shell script to start preTest sh script
spawn(['./tools/protocol-rpc.sh'], {
  stdio: ['inherit'], // Pass the output to the terminal
  detached: true, // Run in the background
})
