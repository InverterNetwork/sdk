// Run the shell script to start preTest sh script
Bun.spawn(['./preTest.sh'], {
  stdio: 'inherit', // Pass the output to the terminal
  detached: true, // Run in the background
})
