// src/services/authService.ts
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../lib/firebase';

export async function registerUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // ✅ Send email verification after signup
  await sendEmailVerification(user);

  return user;
}
