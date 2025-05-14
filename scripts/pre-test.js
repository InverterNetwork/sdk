import { spawn } from 'bun'

async function runPreTest() {
  try {
    // Run the shell script asynchronously and wait for it to complete
    const childProcess = spawn({
      cmd: ['./scripts/protocol-rpc.sh'],
      stdio: ['inherit'], // Pass the output to the terminal
    })

    // Await the child process completion before continuing
    const exitCode = await childProcess.exited

    // Check the exit code
    if (exitCode !== 0) {
      console.error(`Script failed with exit code: ${exitCode}`)
      process.exit(exitCode) // Exit if the script fails
    } else {
      console.log('Shell script completed successfully.')
    }
  } catch (error) {
    console.error(`Error running preTest script: ${error}`)
    process.exit(1) // Exit with error code if something goes wrong
  }
}

await runPreTest()
