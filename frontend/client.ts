import { ApiClient } from "../clients/typescript";

export * from "../clients/typescript";

const client = new ApiClient({
  BASE: "http://localhost:8081",
});

export function useClient(): ApiClient {
  return client;
}
