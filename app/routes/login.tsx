import {
  ActionFunction,
  LoaderFunction,
  json,
  Form,
  useSearchParams,
} from "remix";
import { Schema, z } from "zod";
import { createUserSession, login } from "~/auth.server";
import { db } from "~/utils/db.server";
import getFormData from "~/utils/getFormData";

const LoginObjectSchema = z.object({
  username: z.string(),
  password: z.string().min(5),
  redirectTo: z.string().optional(),
});

// Create a response model
export const action: ActionFunction = async ({
  request,
}): Promise<Response | any> => {
  const form = await request.formData();
  const { username, password, redirectTo } = getFormData(
    form,
    LoginObjectSchema
  );
  const user = await login({ username, password });
  if (!user) {
    return {
      formError: `Username/Password combination is incorrect`,
    };
  }
  return createUserSession(user.id, redirectTo ?? "/");
};

export default function Login() {
  const [searchParams] = useSearchParams();
  return (
    <Form action="/login" method="post">
      <input
        type="hidden"
        name="redirectTo"
        value={searchParams.get("redirectTo") ?? undefined}
      />
      <div className="">
        <label htmlFor="username-input"></label>
        <input type="text" name="username" required />
      </div>
      <div className="">
        <label htmlFor="password-input"></label>
        <input type="password" name="password" required />
      </div>
      <button type="submit">Log In</button>
    </Form>
  );
}
