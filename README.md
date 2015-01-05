encore-ui-nav
=============

Default navigation items for Encore, intended to be read from Cloud Files and dynamically pulled into `rxApp`

Workflow
========

`encore-ui-nav` is responsible for pushing a JSON file to three different Cloud Files containers, named `encore-ui-nav-staging`, `encore-ui-nav-preprod`, and `encore-ui-nav`. The first is used for adding new items to the navigation menu during development, the second is to test in a preprod environment, and the last is the container that our various products will use in production.

When you are happy with your local changes to `encoreNav.json`, create a branch off of `staging` and send us a pull request. Once this pull request gets merged, an updated version of `encoreNav.json` will get deployed to the `encore-ui-nav-staging` container. It takes ~5-15 minutes for the CDN to be updated with the new version.

When you are happy with your work in staging and are ready to move to preprod, create a PR against the `preprod` branch. Ideally this PR will be based on the current `staging` branch. When this PR gets merged in, the `encore-ui-nav-preprod` container will automatically be updated.

After you've verified that the `preprod` branch is working as expected, create a `release` branch off of `preprod`, push it to github, and create a `PR` against master. Merging this PR will automatically update the production container at `encore-ui-nav`.

Remember that when pushing a new version of the file to the CDN container, it will take ~5-15 minutes before the new version is visible on the CDN.

EncoreUI is configured to automatically bring in the correct file, based on whatever environment you're running. If you're running locally or on the staging servers, it will automatically request the JSON file from `encore-ui-nav-staging`. If your code is running on `preprod.encore.rackspace.com`, then EncoreUI will pull from `encore-ui-nav-preprod`. And if you're running in the production environment (`https://encore.rackspace.com`), it will pull in the `encore-ui-nav` container.

Local Testing Workflow
---------------------

Encore-UI allows you to configure where the nav data is loaded from. Using this, you can have it point to your local environment. This is useful for testing changes before pushing to staging.

Here is an example of the workflow for making/testing a change to the nav locally:

### Part 1: Update Nav Data

1. If you haven't already, clone encore-ui-nav: `git clone https://github.com/rackerlabs/encore-ui-nav.git`
2. Create a new branch from staging branch: `git checkout -b my-branch-name staging`
3. Make changes to `src/encoreNav.json`

### Part 2: Test in local app

1. Clone app repo and create new branch (if necessary)
2. Create a link to the local nav: `ln -s /path/to/encore-ui-nav/src/encoreNav.json /path/to/repo/app/encoreNav.json`
3. [Update config to use local nav](http://rackerlabs.github.io/encore-ui/#/component/configs)
```
.config(function ($routeProvider, $locationProvider, $httpProvider, $windowProvider, routesCdnPathProvider) {
    ...
    routesCdnPathProvider.customURL = 'encoreNav.json';
}
```
4: Run repo server and validate changes work as expected

Once validated, you can submit a PR for staging. Rinse and repeat for pre-prod and prod, then profit!

Visibility
==========
Please keep the `visibility` values for your nav menu items in mind. If you're putting a new nav item into `staging` so you can start your development work, remember that other teams might need to shortly thereafter bring `staging` into `master` to deploy to production. We don't want your nav items to start appearing in the production enviroment when you're not ready for it.

When you're getting ready to move your items from `staging` to production, you'll want to first do a new `staging` PR that removes the `visibility` restrictions for your item. Once this has been deployed to `staging` and you've tested that your nav items still work locally, you can prepare a new production release against the updated `staging` branch.

Access-Control-Allow-Origin
===========================
In EncoreUI, we load these JSON files via an XMLHttpRequest. Because of [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS), we need to have an `Access-Control-Allow-Origin` header on the JSON files.

In [our cloudfiles configuration file](./grunt-tasks/options/cloudfiles.js), we set this header on each JSON file whenever we deploy. We have to set it every time, because uploading a new version of an existing file will remove any headers that were already there.

In the future, the preferred way to do this with the Rackspace CDN will be to have this header set at a container level, instead of an object level. Currently this is only doable via the Rackspace Cloud Files API, but it only needs to be done once, and has already been performed. It shouldn't need to be done again in the future, but I'm leaving this note here, just in case.