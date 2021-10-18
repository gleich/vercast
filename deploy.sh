VERCAST_DIR=$(pwd)

# Clone the repo
cd ~/tmp/
rm -rf ./extensions/
gh repo clone extensions -- --depth 1

# Create the vercast git branch. Delete if it alrady exists.
cd ./extensions/
if [[ $(git branch -a) == *"vercast"* ]]; then
    git branch -d vercast
    git push origin --delete vercast
fi
git checkout -b vercast

# Removing current extensions
rm -rf ./extensions/extensions/vercast/

# Copying new extension
cd $VERCAST_DIR/../
cp -r vercast ~/tmp/extensions/extensions/
echo
echo "Copied files"

# Cleaning up files
cd ~/tmp/extensions/extensions/vercast/
rm -rf .git/ LICENSE deploy.sh pnpm-lock.yaml node_modules/ .github/
sed -i '' 's/MPL-2.0/MIT/g' package.json
echo "Cleaned up files from repo"

echo "Go to ~/tmp/extensions/"
