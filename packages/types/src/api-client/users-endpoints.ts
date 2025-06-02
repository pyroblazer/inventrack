//packages/types/src/api-client/users-endpoints.ts
import { UserRole } from "./auth-endpoints";

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string;
  location: string;
  website: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersEndpoints {
  /** GET /users */
  getUsers: {
    response: {
      users: User[];
    };
  };

  /** GET /users/current-basic */
  getCurrentUser: {
    response: {
      id: string;
      username?: string;
      email: string;
      avatar?: string;
      role: UserRole;
    };
  };

  /** POST /users/profile */
  createProfile: {
    body: {
      userId: string;
      bio: string;
      location: string;
      website: string;
    };
    response: Profile;
  };

  /** POST /users */
  createUser: {
    body: {
      email: string;
      password: string;
      username?: string;
      role?: UserRole; // Optional, defaults to 'staff'
    };
    response: User;
  };
}
