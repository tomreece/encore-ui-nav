encore-ui-nav
=============

Default navigation items for Encore, intended to be read from Cloud Files and dynamically pulled into `rxApp`

Workflow
========

`encore-ui-nav` is responsible for pushing a JSON file to three different Cloud Files containers, named `encore-ui-nav-staging`, `encore-ui-nav-preprod`, and `encore-ui-nav`. The first is used for adding new items to the navigation menu during development, the second is to test in a preprod environment, and the last is the container that our various products will use in production.

When you need to add a new item to `encoreNav.json`, create a branch off of `staging` and send us a pull request. Once this pull request gets merged, an updated version of `encoreNav.json` will get deployed to the `encore-ui-nav-staging` container. It takes ~5-15 minutes for the CDN to be updated with the new version.

When you are happy with your work in staging and are ready to move to preprod, create a PR against the `preprod` branch. Ideally this PR will be based on the current `staging` branch. When this PR gets merged in, the `encore-ui-nav-preprod` container will automatically be updated.

After you've verified that the `preprod` branch is working as expected, create a `release` branch off of `preprod`, push it to github, and create a `PR` against master. Merging this PR will automatically update the production container at `encore-ui-nav`.

Remember that when pushing a new version of the file to the CDN container, it will take ~5-15 minutes before the new version is visible on the CDN. 

EncoreUI is configured to automatically bring in the correct file, based on whatever environment you're running. If you're running locally or on the staging servers, it will automatically request the JSON file from `encore-ui-nav-staging`. If your code is running on `preprod.encore.rackspace.com`, then EncoreUI will pull from `encore-ui-nav-preprod`. And if you're running in the production environment (`https://encore.rackspace.com`), it will pull in the `encore-ui-nav` container.

Visibility
==========
Please keep the `visibility` values for your nav menu items in mind. If you're putting a new nav item into `staging` so you can start your development work, remember that other teams might need to shortly thereafter bring `staging` into `master` to deploy to production. We don't want your nav items to start appearing in the production enviroment when you're not ready for it.

When you're getting ready to move your items from `staging` to production, you'll want to first do a new `staging` PR that removes the `visibility` restrictions for your item. Once this has been deployed to `staging` and you've tested that your nav items still work locally, you can prepare a new production release against the updated `staging` branch.
