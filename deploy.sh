#!/bin/sh

# Add the SSH key
ssh-add ~/.ssh/id_ed25519_personal

# Configure Git.
git config --global user.name "garrettsiegel"
git config --global user.email "garrett@submurgedcreative.com"

# Build the project.
hugo

# If a public folder doesn't exist, create it.
mkdir -p public

# Move into the public folder.
cd public

# Initialize an empty Git repository if it doesn't exist.
if [ ! -d .git ]; then
    git init
fi

# Add all files to Git and commit.
git add --all
git commit -m "Deploying to GitHub Pages"

# Push the changes to the main branch.
git push -f git@github-personal:garrettsiegel/hugo-site.git main

# Return to the project root.
cd ..
