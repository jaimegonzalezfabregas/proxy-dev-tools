rm -rf ./builds
mkdir ./builds
cd frontend_src
npm run build
cd ../app

targets=(
    "windows_x86_64"
    "macos_x86_64"
    "macos_arm64"
    "linux_x86_64"
    "linux_arm64"
)

# Loop through each target and run the compile command
for target in "${targets[@]}"; do
    # Compile the Deno application for the current target
    deno compile -A --no-check main.ts
    mv app "../builds/pdt_$target"
done
