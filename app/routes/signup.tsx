import {
  ActionFunction,
  LoaderFunction,
  json,
  Form,
  useSearchParams,
} from "remix";
import { Schema, z } from "zod";
import { createUserSession, login, register } from "~/auth.server";
import { db } from "~/utils/db.server";
import getFormData from "~/utils/getFormData";

const RegisterObjectSchema = z.object({
  username: z.string(),
  password: z.string().min(5),
});

// Create a response model
export const action: ActionFunction = async ({
  request,
}): Promise<Response | any> => {
  const form = await request.formData();
  const { username, password } = getFormData(form, RegisterObjectSchema);
  const user = await register({ username, password });
  if (!user) {
    return {
      formError: `Username/Password combination is incorrect`,
    };
  }
  return createUserSession(user.id, "/");
};

export default function Signup() {
  return (
    <Form action="/signup" method="post">
      <div className="">
        <label htmlFor="username-input"></label>
        <input type="text" name="username" required />
      </div>
      <div className="">
        <label htmlFor="password-input"></label>
        <input type="password" name="password" required />
      </div>
      <button type="submit">Signup</button>
    </Form>
  );
}
