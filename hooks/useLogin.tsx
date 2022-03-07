import { atom, useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SHA256 } from 'jshashes';

// Shortcut function to get the SHA256 hash of a string.
// jshashes is used instead of the more well known sjcl because of its significantly smaller size in this use case.
// Using sjcl in the browser would require crypto-browserify, which in turn would account for about half of the final bundle size.
const hash = (value: string): string => new SHA256().b64(value);

// The hash of an empty string.
// The empty password has a special meaning:
// It is used by default when no password was yet entered or when a logout occurred.
// If the empty password is indeed the correct one, the whole authentication system should be hidden from the user.
const emptyPassword = hash('');

// Store the password hash globally as a Recoil atom, so it can be accessed in all components.
const passwordState = atom<string>({
  key: 'passwordState',
  default: emptyPassword,
  effects: [
    ({ onSet }) => {
      // Store the password hash in the localStorage of the browser so that it can be used across sessions.
      onSet((newValue) => window?.localStorage?.setItem('password', newValue));
    },
  ],
});

/**
 * This hook provides access to authentication related functions and information.
 * It provides the current password hash, the information if a user is logged in (i.e. if a non-empty password is set),
 * as well as functions to log in (i.e. set a password) and log out (i.e. set an empty password).
 */
function useLogin() {
  // Get access to the current password hash.
  const [password, setPassword] = useRecoilState(passwordState);

  const router = useRouter();

  // If there is a hash saved in the localStorage, restore it.
  useEffect(() => {
    const passwordHash = window.localStorage.getItem('password');
    if (passwordHash !== null) {
      setPassword(passwordHash);
    }
  });

  // Define a login function that sets the new password and redirects to the index page.
  const login = (password: string) => {
    setPassword(hash(password));
    router.push('/').then();
  };

  // Define a logout function that sets an empty password and redirects to the login page.
  const logout = () => {
    setPassword(emptyPassword);
    router.push('/login').then();
  };

  // This indicates if a non-empty password is set.
  // This must not be confused with the information whether the user is authenticated.
  // In case an empty password is indeed the correct one, the isLoggedIn will still be false,
  // although the user can be successfully authenticated.
  // This is because in this case the authentication system should be completely hidden from the user.
  const isLoggedIn = password !== emptyPassword;

  return { login, logout, isLoggedIn, password };
}

export default useLogin;
