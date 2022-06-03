import { AuthInputSchema } from "./form.schema";
import { faker } from "@faker-js/faker";

test("Email Validation with messages for non-emails", () => {
  const emails_to_fail = [null, "", "not-an-email", "n@"];
  emails_to_fail.forEach((email) => {
    expect(
      AuthInputSchema.pick({ email: true }).safeParse({ email })
    ).toHaveProperty("success", false);
  });
});

test("Email Validation succeeds for emails", () => {
  expect(
    AuthInputSchema.pick({ email: true }).safeParse({
      email: faker.internet.email(),
    })
  ).toHaveProperty("success", true);
});

test("Password Validation fails with messages for insecure passwords", () => {
  expect(
    AuthInputSchema.pick({ password: true }).safeParse({ password: "short" })
  ).toHaveProperty("success", false);
  expect(
    AuthInputSchema.pick({ password: true }).safeParse({ password: "" })
  ).toHaveProperty("success", false);
});

// TODO: Write more stringent conditions for passwords (i.e. number/special char etc.)
test("Password Validation succeeds for a decent password", () => {
  const passwords_to_succeed = [
    "nospecial",
    "no*number",
    "NOLOWER*1",
    "Secure1*",
  ];
  passwords_to_succeed.forEach((password) => {
    expect(
      AuthInputSchema.pick({ password: true }).safeParse({ password })
    ).toHaveProperty("success", true);
  });
});
