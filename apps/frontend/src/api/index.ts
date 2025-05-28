import { Type, type Static, type TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

function updateOptions(options: RequestInit): RequestInit {
  const update = { ...options };
  if (localStorage.cognito_jwt) {
    update.headers = {
      ['Content-Type']: 'application/json',
      ...update.headers,
      Authorization: `Bearer ${localStorage.cognito_jwt}`,
    };
  }
  return update;
}

export function fetcher(path: string, options: RequestInit) {
  const url = `${import.meta.env.VITE_API_URL}/${path}`;
  return fetch(url, updateOptions(options));
}

const ErrorSchema = Type.Object({
  message: Type.String(),
});

export async function parser<T extends TSchema>(response: Response, schema: T): Promise<Static<T>> {
  if (!response.ok) {
    const json = Value.Parse(ErrorSchema, await response.json());
    throw new Error(json.message);
  }

  return Value.Parse(schema, await response.json());
}
