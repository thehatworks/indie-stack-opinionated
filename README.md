# @thehatworks/indie-stack-opinionated

Fork of the remix-run/indie-stack with customizations we use in most projects

Learn more about [Remix Stacks](https://remix.run/stacks).

The biggest opinion here is that scaffolding just removes valuable git history that you want on project files!

Don't use this with create-remix, it might not work properly. instead, simply fork or clone the repository, and follow the following steps manually:

- Change app name in `package.json`, `package-lock.json`, `fly.toml`, and `README.md`
- Delete this first section of README.md

(later, remove these steps, and recreate remix.init script in bin as an explicit help with scaffolding)

## I just cloned, what do

```shell
npm install
cp .env.example .env
npm run setup
npm run dev
```

## Highly suggested development environment for these tools

- [VSCodium](https://vscodium.com/) likely available for a package manager for your system (apt, choco, brew)
  - [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) nice inline error support for all language extensions below
  - [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) nice git history visuals
  - [GitLess](https://marketplace.visualstudio.com/items?itemName=maattdd.gitless) pre-premium fork of GitLens (inline git blames & more)
  - Language/Tool-Specific Extensions
    - [npm intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) auto-complete node imports from npm packages
    - [Path intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense) auto-complete node imports from your source files
    - [TailwindCSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) auto-completion & friends for Tailind (& DaisyUI) classes
    - [Prisma Plugin](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) support prisma files & tooling
    - [ESLint Plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to support eslint with `config/eslint.config.js`
    - [Prettier Plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) auto-format your code on save
    - [Template String Converter](https://marketplace.visualstudio.com/items?itemName=meganrogge.template-string-converter) super-nice utlity that fixes when you forget to use backtick
    - [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) to support `.env` & `.env.example`
    - [YAML Language Support](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) for editing `.github/workflows/deploy.yml`
    - [MS Docker Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) if you need to make changes to `Dockerfile`
    - [Better TOML](https://marketplace.visualstudio.com/items?itemName=bungcip.better-toml) to support `fly.toml`

## What's changed in our opinionated fork

- Flexible Authentication with [remix-auth](https://github.com/sergiodxa/remix-auth)
- Styling with [PostCSS](https://postcss.org/) & [Tailwind](https://tailwindcss.com/)
- Opinionated Component Styling with [daisyUI](https://daisyui.com)
- Icons by [Heroicons](https://heroicons.com/)

## What's in the normal remix-run/indie-stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Database ORM with [Prisma](https://prisma.io)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Quickstart / Creating a new Project

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up and Fly pre-installed

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

- Initial setup: _If you just generated this project, this step has been done for you._

```shell
  npm run setup
```

## Development

- Start dev server:

```shell
  npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/auth/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

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
  fly create indie-stack-opinionated-template
  fly create indie-stack-opinionated-template-staging
  ```

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
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app indie-stack-opinionated-template
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app indie-stack-opinionated-template-staging
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app indie-stack-opinionated-template
  fly volumes create data --size 1 --app indie-stack-opinionated-template-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

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

This project uses ESLint for linting. That is configured in `config/eslint.config.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
