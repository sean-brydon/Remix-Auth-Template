import { ZodObject, ZodRawShape } from "zod";

export default function useFormData<T extends ZodRawShape>(
  form: FormData,
  inputSchema: ZodObject<T>
) {
  const keys = Object.keys(inputSchema.shape);
  let returnObject: Record<string, any> = {};
  keys.forEach((item) => {
    returnObject[item] = form.get(item);
  });

  return inputSchema.parse(returnObject);
}
