encore-ui-nav
=============

Default navigation items for Encore, intended to be read from Cloud Files and dynamically pulled into `rxApp`

Workflow
========

`encore-ui-nav` is responsible for pushing a JSON file to two different Cloud Files containers, named `encore-ui-nav-staging` and `encore-ui-nav`. The former is used for adding new items to the navigation menu during development, and the latter is the container that our various products will use in production.

When you need to add a new item to `encoreNav.json`, create a branch off of `staging` and send us a pull request. Once this pull request gets merged, an updated version of `encoreNav.json` will get deployed to the `encore-ui-nav-staging` container. It takes ~5-15 minutes for the CDN to be updated with the new version.

When your product is ready to go to production, we'll need to update the production copy of `encoreNav.json`. To do this, create a `release` branch from `staging`, and send a PR for this branch against `master`. When this PR gets merged into `master`, Travis will automatically deploy to the `encore-ui-nav` container. Again, it takes ~5-15 minutes for the CDN to be updated.

The exact mechansim for switching your local app to point at the staging or production versions of `encoreNav.json` will be handled by [Encore-UI](https://github.com/rackerlabs/encore-ui). We'll give a pointer here to documentation for that once it's ready.

Visibility
==========
Please keep the `visibility` values for your nav menu items in mind. If you're putting a new nav item into `staging` so you can start your development work, remember that other teams might need to shortly thereafter bring `staging` into `master` to deploy to production. We don't want your nav items to start appearing in the production enviroment when you're not ready for it.

When you're getting ready to move your items from `staging` to production, you'll want to first do a new `staging` PR that removes the `visibility` restrictions for your item. Once this has been deployed to `staging` and you've tested that your nav items still work locally, you can prepare a new production release against the updated `staging` branch.
