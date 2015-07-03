encore-ui-nav
=============

Default navigation items for Encore, intended to be read from Cloud Files and dynamically pulled into `rxApp`


Workflow
========
`encore-ui-nav` is responsible for pushing a JSON file to three different Cloud Files containers, named `encore-ui-nav-staging`, `encore-ui-nav-preprod`, and `encore-ui-nav`. The first is used for adding new items to the navigation menu during development, the second is to test in a preprod environment, and the last is the container that our various products will use in production.

EncoreUI allows you to configure where the nav data is loaded from. Using this, you can have it point to your local environment. This is useful for testing changes before pushing to staging.

Getting new items into the Encore navigation menu consists of adding the items locally, testing them locally, and then sending pull requests to us to get those changes deployed.

Local Testing Workflow
---------------------

Here is an example of the workflow for making/testing a change to the nav locally:

### Part 1: Update Nav Data

1. If you haven't already, clone encore-ui-nav: `git clone https://github.com/rackerlabs/encore-ui-nav.git`
2. Create a new branch from staging branch: `git checkout -b my-branch-name staging`
3. Make changes to `src/encoreNav.json`

### Part 2: Test in local app

1. Clone app repo and create new branch (if necessary)
2. Create a link to the local nav: `ln -s /path/to/encore-ui-nav/src/encoreNav.json /path/to/repo/compiled/encoreNav.json`
3. [Update config to use local nav](http://rackerlabs.github.io/encore-ui/#/component/configs)
```
.config(function ($routeProvider, $locationProvider, $httpProvider, $windowProvider, routesCdnPathProvider) {
    ...
    routesCdnPathProvider.customURL = 'encoreNav.json';
}
```
4: Run repo server and validate changes work as expected

Once validated, you can submit a PR for staging. Rinse and repeat for pre-prod and prod, then profit!

Pull Request Workflow
---------------------

### Creating a staging PR

When you are happy with your local changes to `encoreNav.json`, it's time to send those changes to us in a PR. Push your `my-staging-branch-name` branch up to github, and create a pull request. Make sure that at the top of the "Open a pull request" screen, you choose "base: staging".

Once this pull request gets merged, an updated version of `encoreNav.json` will get deployed to the `encore-ui-nav-staging` container. It takes ~5-15 minutes for the CDN to be updated with the new version.

*NOTE:* Make sure you have your actual application code already deployed to `staging.encore.rackspace.com` before you ask us to deploy the new staging nav menu.

### Creating a preprod PR

After your staging PR has been deployed, it is time to add your navigation items to our preprod environment.

Create a PR against the latest `preprod` branch, `git checkout -b my-preprod-branch-name preprod`, and use `git cherry-pick` to bring your commit from `my-staging-branch-name` into `my-preprod-branch-name`. 

Send this branch to us as a PR, with the PR targetted against `preprod` (make sure that at the top of the "Open a pull request" screen, you choose "base: preprod"), and when we merge it we will deploy it to the `encore-ui-nav-preprod` container.

*NOTE:* Make sure you have your actual application code already deployed to `preprod.encore.rackspace.com` before you ask us to deploy the new preprod nav menu.

### Creating a production PR

After you've verified that the `preprod` branch is working as expected, and you're ready to release your application into production, create a `my-production-branch-name` branch off of `master`, and use `git cherry-pick` to bring your commit from `my-preprod-branch-name` into `my-production-branch-bame` branch. Push it to github, and create a `PR` against `master` (make sure that at the top of the "Open a pull request" screen, you choose "base: master"). When we merge this PR, it will automatically update the production container at `encore-ui-nav`.

Remember that when pushing a new version of the file to the CDN container, it will take ~5-15 minutes before the new version is visible on the CDN.

EncoreUI is configured to automatically bring in the correct file, based on whatever environment you're running. If you're running locally or on the staging servers, it will automatically request the JSON file from `encore-ui-nav-staging`. If your code is running on `preprod.encore.rackspace.com`, then EncoreUI will pull from `encore-ui-nav-preprod`. And if you're running in the production environment (`https://encore.rackspace.com`), it will pull in the `encore-ui-nav` container.


Syntax
======
The navigation items are defined in a single JSON file. At the highest level, this file defines a tree structure, where navigation items can be nested underneath other items.

For example, part of the JSON looks like this:

```
}, {
    "linkText": "Ticketing",
    "key": "ticketing",
    "children": [
        {
            "href": "/ticketing/list",
            "linkText": "My Selected Queues"
        },
        {
            "href": "/ticketing/my",
            "linkText": "My Tickets"
        },
        ...
}
```

This is saying that the navigation menu should have a "Ticketing" item (defined by `linkText`), which when clicked will expand and contain `"My Selected Queues`" and `"My Tickets"` items.

For full details on the allowed syntax, see the "Navigation Menu JSON Structure" section of [http://rackerlabs.github.io/encore-ui/#/component/rxApp](http://rackerlabs.github.io/encore-ui/#/component/rxApp).
 
Access-Control-Allow-Origin
===========================
In EncoreUI, we load these JSON files via an XMLHttpRequest. Because of [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS), we need to have an `Access-Control-Allow-Origin` header on the JSON files.

In [our cloudfiles configuration file](./grunt-tasks/options/cloudfiles.js), we set this header on each JSON file whenever we deploy. We have to set it every time, because uploading a new version of an existing file will remove any headers that were already there.

In the future, the preferred way to do this with the Rackspace CDN will be to have this header set at a container level, instead of an object level. Currently this is only doable via the Rackspace Cloud Files API, but it only needs to be done once, and has already been performed. It shouldn't need to be done again in the future, but I'm leaving this note here, just in case.
