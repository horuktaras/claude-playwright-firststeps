import { APIRequestContext, APIResponse } from '@playwright/test';

// StorageState type from Playwright — represents cookies + localStorage
type StorageState = Awaited<ReturnType<APIRequestContext['storageState']>>;

// Wraps Playwright's APIRequestContext with domain-specific methods
// Java analogy: like a RestAssured RequestSpecification builder + response wrapper
// In Java: RestAssured.given().contentType(...).post("/authenticate")

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  // POST form data to /authenticate — same as the login form submitting
  // Returns the raw response so callers can inspect status, headers, etc.
  async loginViaApi(username: string, password: string): Promise<APIResponse> {
    const response = await this.request.post('/authenticate', {
      // 'form' sends application/x-www-form-urlencoded — like an HTML form
      // Java: RestAssured.given().formParam("username", u).formParam("password", p)
      form: {
        username,
        password,
      },
    });

    if (!response.ok()) {
      throw new Error(`API login failed — status: ${response.status()}, url: ${response.url()}`);
    }

    return response;
  }

  // Generic GET — useful for health checks, fetching page HTML, checking redirects
  // Java: RestAssured.given().get("/path")
  async get(path: string): Promise<APIResponse> {
    return this.request.get(path);
  }

  async getStorageState(): Promise<StorageState> {
    return this.request.storageState();
  }
}
