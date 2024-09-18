#!/bin/bash

# Global variables
INSTALL_URL="https://foundry.paradigm.xyz"
DEPS=("curl" "make" "forge" "anvil")
DEPLOY_SCRIPT="script/deploymentScript/TestnetDeploymentScript.s.sol"
ENV_FILE=".env"
DEPLOYER_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
TEST_PRIVATE_KEY="TEST_PRIVATE_KEY=$DEPLOYER_PRIVATE_KEY"
RPC_URL="http://127.0.0.1:8545"
WAIT=false # Default to false

# Function to detect OS
detect_os() {
    local os
    os=$(uname)
    if [[ "$os" == "Darwin" ]]; then
        printf "Detected macOS 🍏\n"
    elif [[ "$os" == "Linux" ]]; then
        printf "Detected Linux 🐧\n"
    else
        printf "Unsupported OS detected ❌\n" >&2
        return 1
    fi
}

# Function to check if dependencies are installed
check_dependencies() {
    printf "Checking for required dependencies 🔍\n"
    for dep in "${DEPS[@]}"; do
        if ! command -v "$dep" &>/dev/null; then
            printf "$dep is not installed ❌\n"
            install_dependency "$dep"
        else
            printf "$dep is already installed ✅\n"
        fi
    done
}

# Function to install dependencies
install_dependency() {
    local dep="$1"
    printf "Attempting to install $dep ⚙️\n"
    case "$dep" in
    curl)
        if [[ "$(uname)" == "Darwin" ]]; then
            brew install curl || return 1
        else
            sudo apt-get install -y curl || return 1
        fi
        ;;
    make)
        if [[ "$(uname)" == "Darwin" ]]; then
            xcode-select --install || return 1
        else
            sudo apt-get install -y build-essential || return 1
        fi
        ;;
    forge | anvil)
        printf "Installing Foundry 🛠️\n"
        local INSTALL_URL="https://foundry.paradigm.xyz"
        if ! curl -L $INSTALL_URL | bash; then
            printf "Failed to install Foundry ❌\n" >&2
            return 1
        fi
        # Source the shell config before running foundryup to ensure paths are set
        source "$HOME/.bashrc" || source "$HOME/.zshrc"
        foundryup # ensure the latest version of Foundry is installed
        ;;
    *)
        printf "Unknown dependency $dep ❓\n" >&2
        return 1
        ;;
    esac
    printf "$dep installation completed 🚀\n"
}

# Function to run anvil
start_anvil() {
    printf "Starting Anvil blockchain simulator 🔥\n"
    pkill anvil
    anvil &
    ANVIL_PID=$!
    export ANVIL_PID
}

# Function to handle contract installation
install_contracts() {
    printf "Running 'make install' ⚙️\n"
    if ! make install; then
        printf "Contract installation failed ❌\n" >&2
        return 1
    fi
    printf "Inverter Protocol Installation Complete 🚀\n"
}

# Function to deploy the protocol
deploy_protocol() {
    printf "Starting Protocol Deployment 🚀\n"
    source dev.env || {
        printf "Failed to source dev.env ❌\n" >&2
        return 1
    }
    DEPLOYER_PRIVATE_KEY="$DEPLOYER_PRIVATE_KEY" forge script "$DEPLOY_SCRIPT" --rpc-url "$RPC_URL" --broadcast -v ||
        {
            printf "Deployment failed ❌\n" >&2
            return 1
        }
    printf "Deployment successful 🚀\n"
}

# Function to update .env file
update_env() {
    printf "Checking and updating .env file 🔑\n"
    if [[ ! -f "$ENV_FILE" ]]; then
        printf ".env file does not exist, creating it 🛠️\n"
        echo "$TEST_PRIVATE_KEY" >"$ENV_FILE"
        printf "Added TEST_PRIVATE_KEY to new .env file 📄\n"
    else
        if grep -q "TEST_PRIVATE_KEY" "$ENV_FILE"; then
            printf "Updating existing TEST_PRIVATE_KEY value in .env 🔄\n"
            sed -i'' -e "s/^TEST_PRIVATE_KEY=.*/$TEST_PRIVATE_KEY/" "$ENV_FILE"
            printf "TEST_PRIVATE_KEY updated in .env ✅\n"
        else
            printf "Adding TEST_PRIVATE_KEY to .env 🆕\n"
            echo "$TEST_PRIVATE_KEY" >>"$ENV_FILE"
            printf "TEST_PRIVATE_KEY added to .env file ✅\n"
        fi
    fi
}

# Function to parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
        --wait)
            WAIT=true
            ;;
        *)
            printf "Unknown argument: $1 ❓\n" >&2
            exit 1
            ;;
        esac
        shift
    done
}

# Main function
main() {
    # Parse arguments
    parse_args "$@"

    detect_os || {
        printf "OS detection failed ❌\n"
        exit 1
    }
    check_dependencies || {
        printf "Dependency check failed ❌\n"
        exit 1
    }

    start_anvil || {
        printf "Failed to start Anvil ❌\n"
        exit 1
    }

    printf "Entering contracts directory 📂\n"
    cd ./contracts || {
        printf "Failed to enter ./contracts ❌\n" >&2
        return 1
    }

    install_contracts || {
        printf "Contract installation failed ❌\n"
        exit 1
    }

    deploy_protocol || {
        printf "Protocol deployment failed ❌\n"
        exit 1
    }

    printf "Returning to the root directory 📂\n"
    cd .. || {
        printf "Failed to return to root directory ❌\n" >&2
        return 1
    }

    update_env || {
        printf "Failed to update .env ❌\n"
        exit 1
    }

    if [[ "$WAIT" == true ]]; then
        printf "Testnet protocol deployment is done 🚀. Press CTRL+C to end the session! 🖱️\n"
        wait $ANVIL_PID
    else
        printf "Testnet protocol deployment is done 🚀\n"
    fi
}

# Execute the main function with argument parsing
main "$@"
