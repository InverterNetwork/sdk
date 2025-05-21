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
ORCHESTRATOR_FACTORY_ADDRESS=""
RESTRICTED_PIM_FACTORY_ADDRESS=""
IMMUTABLE_PIM_FACTORY_ADDRESS=""
ERC20_MOCK_ADDRESS=""
BANCOR_FORMULA_ADDRESS=""

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
        if ! curl -L "$INSTALL_URL" | bash; then
            printf "Failed to install Foundry ❌\n" >&2
            return 1
        fi
        source "$HOME/.bashrc" || source "$HOME/.zshrc"
        foundryup
        ;;
    *)
        printf "Unknown dependency $dep ❓\n" >&2
        return 1
        ;;
    esac
    printf "$dep installation completed ✅\n"
}

# Function to run anvil
start_anvil() {
    pkill anvil

    if [[ "$USE_FORK" == "true" ]]; then
        printf "Starting Anvil in fork mode from Sepolia testnet 🔄\n"
        anvil --fork-url https://rpc.inverter.network/main/evm/11155111 --chain-id 31337 >/dev/null 2>&1 &
        ANVIL_PID=$!
    else
        printf "Starting Anvil in standard mode ⚡\n"
        anvil --chain-id 31337 >/dev/null 2>&1 &
        ANVIL_PID=$!
    fi

    if [[ "$USE_FORK" == "true" ]]; then
        printf "Sleeping for 2 seconds to allow for fork to sync 🔄\n"
        sleep 2
    fi
}

# Function to handle contract installation
install_contracts() {
    printf "Running 'make install' ⚙️\n"
    if ! make install; then
        printf "Contract installation failed ❌\n" >&2
        return 1
    fi
    printf "Inverter Protocol Installation Complete ✅\n"
}

# Function to deploy the protocol
deploy_protocol() {
    printf "Starting Protocol Deployment ⚙️\n"
    source dev.env || {
        printf "Failed to source dev.env ❌\n" >&2
        return 1
    }

    # Capture deployment output and log to console
    local deploy_output
    if ! deploy_output=$(DEPLOYER_PRIVATE_KEY="$DEPLOYER_PRIVATE_KEY" forge script "$DEPLOY_SCRIPT" --rpc-url "$RPC_URL" --broadcast -v 2>&1); then
        printf "Deployment failed ❌\n" >&2
        return 1
    fi

    printf "Deployment successful ✅\n" >/dev/tty

    # Extract OrchestratorFactory and ERC20Mock addresses from deployment output
    ORCHESTRATOR_FACTORY_ADDRESS=$(echo "$deploy_output" | grep -oE 'OrchestratorFactory_v1 InverterBeaconProxy_v1: 0x[0-9a-fA-F]+' | awk '{print $3}')
    TRANSACTION_FORWARDER_ADDRESS=$(echo "$deploy_output" | grep -oE 'TransactionForwarder_v1 InverterBeaconProxy_v1: 0x[0-9a-fA-F]+' | awk '{print $3}')
    ERC20_MOCK_ADDRESS=$(echo "$deploy_output" | grep -oE 'ERC20Mock iUSD: 0x[0-9a-fA-F]+' | awk '{print $3}')
    BANCOR_FORMULA_ADDRESS=$(echo "$deploy_output" | grep -oE 'BancorFormula Implementation: 0x[0-9a-fA-F]+' | awk '{print $3}')

    if [[ -z "$ORCHESTRATOR_FACTORY_ADDRESS" || -z "$ERC20_MOCK_ADDRESS" || -z "$BANCOR_FORMULA_ADDRESS" || -z "$TRANSACTION_FORWARDER_ADDRESS" ]]; then
        printf "Failed to extract contract addresses ❌\n" >&2
        return 1
    fi

    printf "Private Key: $DEPLOYER_PRIVATE_KEY ✅\n" >/dev/tty
    printf "OrchestratorFactory Address: $ORCHESTRATOR_FACTORY_ADDRESS ✅\n" >/dev/tty
    printf "TransactionForwarder Address: $TRANSACTION_FORWARDER_ADDRESS ✅\n" >/dev/tty
    printf "ERC20Mock Address: $ERC20_MOCK_ADDRESS ✅\n" >/dev/tty
    printf "BancorFormula Address: $BANCOR_FORMULA_ADDRESS ✅\n" >/dev/tty

    if [[ "$USE_FORK" == "true" ]]; then
        printf "Sleeping for 1 seconds to allow for fork to sync 🔄\n"
        sleep 1
    fi
}

# Function to update or add a variable in the .env file
update_env_var() {
    local var_name="$1"
    local var_value="$2"
    local file="$3"

    if grep -q "^$var_name=" "$file"; then
        sed -i.bak -e "s/^$var_name=.*/$var_name=$var_value/" "$file"
        printf "%s updated in .env ✅\n" "$var_name"
    else
        echo "$var_name=$var_value" >>"$file"
        printf "%s added to .env ✅\n" "$var_name"
    fi
}

# Function to update .env file
update_env() {
    printf "Checking and updating .env file 🔑\n"

    if [[ ! -f "$ENV_FILE" ]]; then
        printf ".env file does not exist, creating it 🛠️\n"
        touch "$ENV_FILE"
        printf ".env file created 📄\n"
    fi

    update_env_var "TEST_PRIVATE_KEY" "$DEPLOYER_PRIVATE_KEY" "$ENV_FILE"
    update_env_var "TEST_ORCHESTRATOR_FACTORY_ADDRESS" "$ORCHESTRATOR_FACTORY_ADDRESS" "$ENV_FILE"
    update_env_var "TEST_TRANSACTION_FORWARDER_ADDRESS" "$TRANSACTION_FORWARDER_ADDRESS" "$ENV_FILE"
    update_env_var "TEST_ERC20_MOCK_ADDRESS" "$ERC20_MOCK_ADDRESS" "$ENV_FILE"
    update_env_var "TEST_BANCOR_FORMULA_ADDRESS" "$BANCOR_FORMULA_ADDRESS" "$ENV_FILE"

    rm -f .env.bak
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
    parse_args "$@"

    detect_os || {
        printf "OS detection failed ❌\n"
        exit 1
    }

    printf "\n----------------------------------------\n"
    check_dependencies || {
        printf "Dependency check failed ❌\n"
        exit 1
    }

    start_anvil || {
        printf "Failed to start Anvil ❌\n"
        exit 1
    }

    printf "\n----------------------------------------\n"
    printf "Entering contracts directory 📂\n"
    cd ./contracts || {
        printf "Failed to enter ./contracts ❌\n" >&2
        return 1
    }

    install_contracts || {
        printf "Contract installation failed ❌\n"
        exit 1
    }

    printf "\n----------------------------------------\n"
    deploy_protocol || {
        printf "Protocol deployment failed ❌\n"
        exit 1
    }

    printf "Returning to the root directory 📂\n"
    cd .. || {
        printf "Failed to return to root directory ❌\n" >&2
        return 1
    }

    printf "\n----------------------------------------\n"
    update_env || {
        printf "Failed to update .env ❌\n"
        exit 1
    }

    printf "\n----------------------------------------\n"
    if [[ "$WAIT" == true ]]; then
        printf "Testnet protocol deployment is done ✅. Press CTRL+C to end the session! 🖱️\n"
        wait $ANVIL_PID
    else
        printf "Testnet protocol deployment is done ✅\n"
    fi
}

main "$@"

# RAW SCRIPT CMD: source dev.env && DEPLOYER_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" forge script script/deploymentScript/TestnetDeploymentScript.s.sol --rpc-url http://127.0.0.1:8545 --broadcast -v
