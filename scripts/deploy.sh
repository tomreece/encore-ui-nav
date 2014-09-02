#!/bin/bash

# ensure script will fail if any commands fail
set -e

echo "Checking deploy conditions"
if [[ $TRAVIS_BRANCH = "master" && $TRAVIS_PULL_REQUEST = "false" ]]
then
    echo "Deploying to production"
    grunt cloudfiles:production
elif [[ $TRAVIS_BRANCH = "staging" && $TRAVIS_PULL_REQUEST = "false" ]]
then
    echo "Deploying to staging"
    grunt cloudfiles:staging
else
    echo "Not deploying"
    printf "TRAVIS_BRANCH is %s\n" "$TRAVIS_BRANCH"
    printf "TRAVIS_PULL_REQUEST is %s\n" "$TRAVIS_PULL_REQUEST"
fi
