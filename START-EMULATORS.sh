# To give execution permission: chmod +x ./START-EMULATORS.sh
# To run: ./START_EMULATORS.sh

firebase emulators:start --import=./firebase-export --export-on-exit=./firebase-export
