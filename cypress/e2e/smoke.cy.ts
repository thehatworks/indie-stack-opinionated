import { faker } from "@faker-js/faker";
import { recurse } from "cypress-recurse";

describe("unauthorized smoke tests", () => {
  it("fly.io healthcheck should return something expected", () => {
    cy.request("/healthcheck").then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.eql("OK");
    });
  });

  it("Shouldn't let you register with an invalid e-mail", () => {
    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByLabelText(/email/i).type(faker.name.lastName());
    cy.findByLabelText(/password/i).type(faker.internet.password(10));
    cy.findByRole("button", { name: /create account/i }).click();
    // no error to check for since client-side validation prevents this
    // just check we didn't leave the page
    cy.url().should("include", "/join");
  });

  it("Shouldn't let you register with too short of a password", () => {
    cy.visit("/");
    cy.findByRole("link", { name: /sign up/i }).click();
    cy.findByLabelText(/email/i).type(faker.internet.email());
    cy.findByLabelText(/password/i).type(faker.internet.password(7));
    cy.findByRole("button", { name: /create account/i }).click();
    cy.get("[name=password]").should("have.attr", "aria-invalid");
    cy.get("[id$=errors-for-password]").should("include.text", "at least 8", {
      matchCase: false,
    });
    cy.url().should("include", "/join");
  });
});

describe("authorized smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register, login, logout, and back in", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");
    cy.visitAndCheck("/");

    // test /join
    cy.findByRole("link", { name: /sign up/i }).click();
    const join_email_box = cy.findByRole("textbox", { name: /email/i });
    const join_password_box = cy.findByLabelText(/password/i);

    recurse(
      () => join_email_box.clear().type(loginForm.email),
      (input) => input.val() === loginForm.email
    ).should("have.value", loginForm.email);

    recurse(
      () => join_password_box.clear().type(loginForm.password),
      (input) => input.val() === loginForm.password
    ).should("have.value", loginForm.password);

    cy.findByRole("button", { name: /create account/i }).click();
    cy.findByRole("link", { name: /notes/i }).click();
    cy.findByRole("button", { name: /logout/i }).click();

    // test /login
    cy.findByRole("link", { name: /log in/i }).click();
    const login_email_box = cy.findByRole("textbox", { name: /email/i });
    const login_password_box = cy.findByLabelText(/password/i);

    recurse(
      () => login_email_box.clear().type(loginForm.email),
      (input) => input.val() === loginForm.email
    ).should("have.value", loginForm.email);

    recurse(
      () => login_password_box.clear().type(loginForm.password),
      (input) => input.val() === loginForm.password
    ).should("have.value", loginForm.password);

    cy.findByRole("button", { name: /log in/i }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to make a note", () => {
    const testNote = {
      title: faker.lorem.words(1),
      body: faker.lorem.sentences(1),
    };
    cy.login();

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /notes/i }).click();
    cy.findByText("No notes yet");

    cy.findByRole("link", { name: /\+ new note/i }).click();

    cy.findByRole("textbox", { name: /title/i }).type(testNote.title);
    cy.findByRole("textbox", { name: /body/i }).type(testNote.body);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByText("No notes yet");
  });
});
