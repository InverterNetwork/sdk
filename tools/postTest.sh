#!/bin/bash

# Check if the Anvil process is running and terminate it
if [[ ! -z "$ANVIL_PID" ]]; then
    printf "Stopping Anvil (PID: $ANVIL_PID) 🛑\n"
    kill $ANVIL_PID || {
        printf "Failed to stop Anvil ❌\n" >&2
        exit 1
    }
    printf "Anvil stopped successfully ✅\n"
else
    printf "Anvil process not found ❌\n"
fi
