//apps/web/src/actions/user/user-service.ts
import { ApiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { type User, type UsersEndpoints } from "@shared/types";

/**
 * Service class for user-related API calls
 */
export class UserService {
  private static readonly BASE_PATH = "/users";

  /**
   * Fetches current user information
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await ApiClient.get<
        UsersEndpoints["getCurrentUser"]["response"]
      >(`${this.BASE_PATH}/current-basic`);

      console.log("user-service.ts response", response);

      if (!response.success) {
        throw new Error("Failed to fetch current user");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Creates a new user profile
   */
  static async createProfile(
    request: Readonly<UsersEndpoints["createProfile"]["body"]>,
  ): Promise<UsersEndpoints["createProfile"]["response"]> {
    try {
      const response = await ApiClient.post<
        UsersEndpoints["createProfile"]["body"],
        UsersEndpoints["createProfile"]["response"]
      >(`${this.BASE_PATH}/profile`, {
        body: request,
      });

      if (!response.success) {
        throw new Error("Failed to create user profile");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to create user profile:", error);
      throw new Error(getErrorMessage(error));
    }
  }
}
