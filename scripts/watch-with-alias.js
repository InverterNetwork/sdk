#!/usr/bin/env node

const { spawn } = require('child_process')

// Configuration
const TSC_COMMAND = 'tsc'
const TSC_ARGS = ['-w']
const ALIAS_COMMAND = 'tsc-alias'
const ALIAS_ARGS = ['--outDir', './dist/src']

console.log(
  '🚀 Starting TypeScript watch with tsc-alias --outDir ./dist/src...'
)

// Simple debounce implementation
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Debounced function to run tsc-alias
const runTscAlias = debounce(() => {
  console.log('🔄 Running tsc-alias...')
  const aliasProcess = spawn(ALIAS_COMMAND, ALIAS_ARGS, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  })

  aliasProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ tsc-alias completed successfully')
    } else {
      console.error(`❌ tsc-alias failed with code ${code}`)
    }
  })

  aliasProcess.on('error', (err) => {
    console.error('❌ Failed to run tsc-alias:', err.message)
  })
}, 1000) // Wait 1 second after last change

// Start TypeScript compiler in watch mode
const tscProcess = spawn(TSC_COMMAND, TSC_ARGS, {
  stdio: 'pipe',
  shell: true,
  cwd: process.cwd(),
})

let isFirstCompilation = true

tscProcess.stdout.on('data', (data) => {
  const output = data.toString()
  process.stdout.write(output)

  // Check for compilation completion
  if (
    output.includes('Found 0 errors. Watching for file changes.') ||
    output.includes('Compilation complete. Watching for file changes.')
  ) {
    if (isFirstCompilation) {
      console.log('🎯 Initial compilation complete, running tsc-alias...')
      isFirstCompilation = false
    }
    runTscAlias()
  }
})

tscProcess.stderr.on('data', (data) => {
  process.stderr.write(data)
})

tscProcess.on('close', (code) => {
  console.log(`TypeScript compiler exited with code ${code}`)
  process.exit(code)
})

tscProcess.on('error', (err) => {
  console.error('Failed to start TypeScript compiler:', err.message)
  process.exit(1)
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping watch process...')
  tscProcess.kill('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping watch process...')
  tscProcess.kill('SIGTERM')
  process.exit(0)
})
