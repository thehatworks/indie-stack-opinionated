# Remix Indie Stack

![The Remix Indie Stack](https://repository-images.githubusercontent.com/465928257/a241fa49-bd4d-485a-a2a5-5cb8e4ee0abf)

Learn more about [Remix Stacks](https://remix.run/stacks).

```sh
npx create-remix@latest --template remix-run/indie-stack
```

## What's in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Flexible Authentication with [remix-auth](https://github.com/sergiodxa/remix-auth)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [PostCSS](https://postcss.org/) & [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

## Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up and Fly pre-installed

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/remix-run/indie-stack/tree/main)

## Development

- First run this stack's `remix.init` script and commit the changes it makes to your project.

  ```sh
  npx remix init
  git init # if you haven't already
  git add .
  git commit -m "Initialize project"
  ```

- Initial setup:

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

### Relevant code:


- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/auth/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

## Digging in for real development

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with the tools provided.
The core technologies are:

- [Remix](https://docs.remix.run) for building frontend, routing, business and backend code
- [Prisma](https://www.prisma.io/docs/) for database modeling, querying and lifecycle management
  - you'll want to familiarize yourself with the prisma cli, and the [prisma schema](./prisma/schema.prisma) file
    which in this case helps you manage a [SQLite](https://www.sqlite.org/index.html) database
    via automatic migrations, and a [seed script](./prisma/seed.ts) to make sure your local dev servers always have some data to work with.
    and [Prisma Studio](https://www.prisma.io/studio) for a visual database browser and editor.
- [Fly](https://fly.io/docs/) for deployment and hosting.
  - you'll want to install [flyctl](https://fly.io/docs/getting-started/installing-flyctl/) to manage your deployments.
- [GitHub Actions](https://docs.github.com/en/actions) for CI/CD
  - Anything pushed to the `main` branch will be deployed to production copy of your app (after passing a series of tests and a successful build)
  - Similary, Anything in the `dev` branch will be deployed to the staging copy of your app.
  - Under the hood, [Docker] is used to build the app for deployment
  - [Cypress](https://cypress.io) for end-to-end testing
  - [Vitest](https://vitest.dev) for unit testing

### Working with style

- When at all possible, just use themed elements provided by [daisyUI](https://daisyui.com/)
  - (and be sure to pick a theme!)
- When more customization is needed, use [tailwind utility classes](https://tailwindcss.com/docs/utility-first)
  - The compiler automatically only includes classes you actually use in the final css file
- Enjoy the free and open icon pack [HeroIcons](https://heroicons.com/), it's already used in the example app
- And when something even more custom is needed, enjoy the flexibility of [SCSS](https://sass-lang.com/guide)
  - you can [customize daisyui and tailwind classes](https://daisyui.com/docs/customize/) themselves by adding `@apply` directives to the source scss files.
- Of course, you can edit [./app/styles/main.scss] to add any kind of global styles you want, and mix tailwind/daisy/anything else via `@apply` directives.
- All style code is automatically minimized for production by the [cssnano plugin](https://cssnano.co/)
- In development you get [source maps for easy debugging](https://www.sitepoint.com/using-source-maps-debug-sass-chrome/)
- Hint: if you're doing it right, you are /never/ using React's style attribute, only existing and custom classnames.
- If daisyUI doesn't have enough, there are several websites with completely ready to go copy-paste tailwind based code for almost anything.
  - Here are some to get you started:
  - [Tailwind Toolbox](https://www.tailwindtoolbox.com/icons)
  - [Tailwind Kit](https://www.tailwind-kit.com/components)
- There's a host of preinstalled really useful [PostCSS](https://postcss.org/) plugins, and you can add more if you need them.
  - Take a look in [./config/postcss.config.js](./config/postcss.config.js) to see what's there already.

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create indie-stack-template
  fly apps create indie-stack-template-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app indie-stack-template
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app indie-stack-template-staging
  ```

  If you don't have openssl installed, you can also use [1Password](https://1password.com/password-generator) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app indie-stack-template
  fly volumes create data --size 1 --app indie-stack-template-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
