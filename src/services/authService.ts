// src/services/authService.ts
import Backendless from 'backendless';

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

// Register a new user
export async function registerUser({ email, password, name, role }: RegisterUserInput) {
  const user = new Backendless.User();
  user.email = email;
  user.password = password;
  user.name = name;
  user.role = role;

  try {
    const registeredUser = await Backendless.UserService.register(user);

    // Optional: Trigger email confirmation if required in your Backendless settings
    await Backendless.UserService.resendEmailConfirmation(email);

    return registeredUser;
  } catch (error: any) {
    console.error('[registerUser] Registration failed:', error);
    throw new Error(error?.message || 'Registration failed. Please try again.');
  }
}

// Login existing user
export async function loginUser(email: string, password: string) {
  try {
    const user = await Backendless.UserService.login(email, password, true); // true = stay logged in
    return user;
  } catch (error: any) {
    console.error('[loginUser] Login failed:', error);
    throw new Error(error?.message || 'Login failed. Check your credentials.');
  }
}

// Logout current user
export async function logoutUser() {
  try {
    await Backendless.UserService.logout();
  } catch (error: any) {
    console.error('[logoutUser] Logout failed:', error);
    throw new Error(error?.message || 'Logout failed.');
  }
}

// Get current user (optional)
export async function getCurrentUser() {
  try {
    const user = await Backendless.UserService.getCurrentUser();
    return user;
  } catch (error) {
    console.error('[getCurrentUser] Failed to fetch current user:', error);
    return null;
  }
}
