export type UserRole = "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  data: {
    user: AuthUser;
  };
};

export type MeResponse = {
  success: boolean;
  data: {
    user: AuthUser;
  };
};
