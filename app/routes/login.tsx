import { ActionFunction, LoaderFunction, json,Form } from "remix";
import { authenticator } from "~/auth.server";
import { getSession, commitSession } from "~/session.server";

export let action: ActionFunction = async ({ request }) => {
  // Authenticate the request, after that it will redirect to the defined URLs
  // and set the user in the session if it's a success
  const res = await authenticator.authenticate("local", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    
  });

  return json(res);
};

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  return null
};

export default function Login() {
  return (
    <Form action="/login" method="post">
      <input type="text" name="username" required />
      <input type="password" name="password" required />
      <button>Log In</button>
    </Form>
  );
}