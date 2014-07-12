Karambu.la
=========

My first Node.JS project, never tweaked it after I learned more about the ecosystem, so take with a grain of salt.

### About
Karambu.la is a good starter example for using Node.JS with Jade templating, a MySQL relational DB, and some javascript/jQuery with additional helper plugins.
Theres a lot I would change today, but this is a simple example for beginners.

### Install
* Install Node.JS
* Clone Repo
* Run `npm install`
* Change DB info in index.js source
* Run `node index.js`

### DB Skeleton
The database is a simple MySQL instance I had running on my local machine.
An example can be found in the /db_example folder

### Crawler
Information is gathered by a crawler written in Java. It fetches the fruit and vegetable price list uploaded 5 days a week by Israels Agriculture Ministry, and adds them to the DB.
Source code can be found in /java_crawler folder