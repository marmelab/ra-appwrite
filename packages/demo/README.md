# React-admin Demo With AppWrite

This is a demo of the [AppWrite](https://appwrite.io/) adapter for [react-admin](https://github.com/marmelab/react-admin).

To explore the source code, start with [src/App.tsx](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/App.tsx).

## Requirements

To run this demo, you must have a configured Appwrite project containing a database with the following collections:

- `contacts` with the following fields:
  - `first_name` (text)
  - `last_name` (text)
  - `company` (reference to the `companies` collection)
- `companies` with the following fields:
  - `name` (text)

## How to run

Clone the ra-appwrite repository, then copy the `packages/demo/.env.local-example` file to `packages/demo/.env.local` and fill in the project id, database id, and collection ids from your AppWrite project.

Then run the following commands at the root of the repository:

```sh
make install

make run
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run deploy`

Deploy the build to GitHub gh-pages.
