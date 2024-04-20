# Movement Client

Explaination on how to run the client and how does it works.

## How to run

Install npm and node. 
Open terminal in the client folder and run the following commands:
```
npm install
npm run start
```

## How does it work

The client supports editing and viewing users with pagination concept.

### Authentication

Login is performed by sending the headers **X-Auth-Username** and **X-Auth-Password**.

On success login the user token is saved in the cache and the cookies for future requests.

When a token exists in the client cookies the requests are sent with **X-Auth-Token**.

*Auto login will be done using the admin user eve.holt@reqres.in to simulate auth and user actions.*

## Files

The client holds the view and controllers to align with MVC architecture.

**src/index.js** - Client init file.

### Controllers

**/src/controllers/** - Holds the access to the business logic and data.

### View

**/src/components/** - Basic custom components to use through the app.

**/src/panels/** - Complex components to display and handle data.

**/src/pages/** - Different pages of the app.
