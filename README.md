# Express + Mysql + Jest + Docker project

## Getting Started

First of all:

```
npm i
```

To start the app and the database, run the following command in the root directory:

```
docker-compose up --build
```

When the server is available run for the first time:

```
npm run init-db
```

It will run the migrations.

## DB Rollback

**If you need to rollback the database** run the following npm script from a terminal (while the server is running):

```
npm run db-down
```

After that you can run:

```
docker-compose down
```

## SWAGGER UI

When the server is running you can go to the [SWAGGER](http://localhost:3000/api-docs/) page to interact with the UI and try the APIs

**HOW TO WORK WITH AUTH APIs:**

Some APIs requires to be authenticated with a token, how manage them:

- register an account if you haven't already done
- request for a one-time token, It will be an only read token if you don't pass basic auth
- press the button at the top right of the page with the padlock, here you can insert the basic auth info, if you want
- the `/token` API will return a bearer token to use for authenticated APIs
- press again the button at the top right of the page with the padlock and insert your token, then confirm your choice
- you're ready to make authenticated API call

## JEST TESTS

There is a test suite available connected to a test db, here the instructions to run tests:

Go to `/src/test` directory and run:

```
docker-compose up
```

When the test db container is ready you can run:

```
npm run test
```

If you need to stop the test db container run inside `/src/test` directory:

```
docker-compose down
```
