# Movement Server

Explaination on how to run the server and how does it works.

## How to run

Install npm and node. 
Open terminal in the server folder and run the following commands:
```
npm install
npm run start
```

## How does it work

### Test Data

Test data is located at "https://reqres.in/api/users".

In addition we add the admin user "eve.holt@reqres.in" to support the login request to "https://reqres.in/api/login".

(this data is loaded in the app.service file on init)

### Data Storage

In order to minimize testing overhead and external tools the data is stored in the cache.

A simple base model was created to support the basic DB CRUD operations.

The users model was built with mongodb in mind as the DB; the base model can be easily replaced if needed.

### API (port: 8081)

The API is RESTful. Taking into consideration the method of the request when selecting the relevant endpoint.

The response is JSON with "ok" field to state whether the request has been finished successfuly.
```
{
  ok: 1
  ...other fields
}
```

### CORS

The following origins are allowed: localhost, facebook.com, google.com.

### Authentication

The headers are the main authentication method checking a token or username and password.

For example, If a token is sent using the header **X-Auth-Token** it is verified both with jwt ecryption and user token.

When no token header is sent, the headers **X-Auth-Username** and **X-Auth-Password** are verified and return the relevant token in the header **X-Auth-Token** for future requests.

## Files

The server holds the Bussiness logic and the controllers to align with MVC architecture.

**src/server.js** - Server init file.

### Controllers

**/src/routes/** - Exposes endpoints of the API.

**/src/controllers/** - Holds the logic of endpoints.

### Models (Business Logic)

**/src/models/** - Holds the models schema, interactions and manipulations with the application data.

**/src/services/** - Performs specific tasks or operations that are not directly related to data persistence.

