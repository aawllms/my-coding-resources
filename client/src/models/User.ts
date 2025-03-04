import type { Resource } from "./Resource";

export interface User {
  username: string | null;
  email: string | null;
  password: string | null;
  saveResource: Resource[];
}
