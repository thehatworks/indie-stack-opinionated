import { validateEmail, validatePassword } from "~/auth/validation";
import { faker } from "@faker-js/faker";

test("validate_email fails with messages for non-emails", () => {
  expect(validateEmail(null)).toHaveLength(1);
  expect(validateEmail("")).toHaveLength(1);
  expect(validateEmail("not-an-email")).toHaveLength(1);
  expect(validateEmail("n@")).toHaveLength(1);
});

test("validate_email succeeds for emails", () => {
  console.log("faker.internet.email()", faker.internet.email());
  expect(validateEmail(faker.internet.email())).toHaveLength(0);
});

test("validate_password fails with messages for insecure passwords", () => {
  expect(validatePassword("short")).toHaveLength(1);
  expect(validatePassword("")).toHaveLength(1);
});

test("validate_password succeeds for a decent password", () => {
  expect(validatePassword("nospec1al")).toHaveLength(0);
  expect(validatePassword("no*number")).toHaveLength(0);
  expect(validatePassword("NOLOWER*1")).toHaveLength(0);
  expect(validatePassword("Secure1*")).toHaveLength(0);
});
