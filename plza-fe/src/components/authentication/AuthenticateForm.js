import React from "react";
import { Form, Input, Button } from "formik-semantic-ui";
import { Label, Message } from "semantic-ui-react";

import { string, ref } from "yup";

import API from "../../utils/API";
import authenticateUser from "../../utils/auth";
import composeSchema from "../../utils/composeSchema";

export const InputError = ({ message }) => (
  <Label color="red" pointing="above" prompt>
    {message}
  </Label>
);

const baseSchema = {
  username: string().required("Username is required"),
  password: string()
    .min(4, "Password is too short")
    .required("Password is required")
};

const registrationSchema = {
  password_verify: string()
    .oneOf([ref("password")], "Passwords are not the same")
    .min(4, "Password is too short")
    .required("Password confirmation is required"),
  email: string()
    .email("Invalid email")
    .required("E-mail address is required")
};

export default function AuthenticateForm({
  endpoint,
  isRegistrationForm,
  extraValues,
  extraSchema,
  children
}) {
  // If this is a registration form, combine registration schema and
  // base schema together, otherwise just return the base schema.
  const initialSchema = isRegistrationForm
    ? { ...baseSchema, ...registrationSchema }
    : baseSchema;

  const onSubmit = (values, actions) => {
    // Copy values object so that we can modify it later on
    const payload = Object.assign({}, values);

    // Notify that we are submitting the form right now.
    actions.setSubmitting(true);

    // If this is a registration form there is no need
    // to send the password verification field back to the server
    if (isRegistrationForm) {
      delete payload.password_verify;
    }

    API.post(endpoint, payload)
      .then(response => {
        authenticateUser(response.data);
        actions.setSubmitting(false);
      })
      .catch(error => {
        // Display server error at top of form
        actions.setFieldError("message", error.response.data.message);
        actions.setSubmitting(false);
      });
  };

  return (
    <Form
      initialValues={{ username: "", password: "", ...extraValues }}
      validateOnBlur={false}
      validationSchema={composeSchema(initialSchema, extraSchema)}
      onSubmit={(values, actions) => onSubmit(values, actions)}
    >
      {formik => (
        <Form.Children>
          {formik.errors.message && (
            <Message negative>
              <Message.Header>We encountered an error.</Message.Header>
              <p>{formik.errors.message}</p>
            </Message>
          )}

          <Form.Group widths="equal">
            <Input
              inputProps={{ icon: "user" }}
              label="Username"
              name="username"
              errorComponent={InputError}
            />

            <Input
              inputProps={{ icon: "lock", type: "password" }}
              label="Password"
              name="password"
              errorComponent={InputError}
            />

            {/* Sprinkle registration fields */}
            {isRegistrationForm && (
              <>
                <Input
                  inputProps={{ icon: "lock", type: "password" }}
                  label="Verify password"
                  name="password_verify"
                  errorComponent={InputError}
                />

                <Input
                  inputProps={{ type: "email" }}
                  label="Email address"
                  name="email"
                  errorComponent={InputError}
                />
              </>
            )}
          </Form.Group>

          {children}

          <Button.Submit
            primary
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Log in
          </Button.Submit>
        </Form.Children>
      )}
    </Form>
  );
}

AuthenticateForm.defaultProps = {
  isRegistrationForm: false,
  endpoint: "/auth/user/login"
};
