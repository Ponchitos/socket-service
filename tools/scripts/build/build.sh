set -e
rm -rf ./build
rm -rf ./logs
mkdir -p ./logs
tsc
cp -R ./src/api/schemas/ ./build/api/schemas/