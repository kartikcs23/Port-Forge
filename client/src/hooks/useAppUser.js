import { useUser } from '@clerk/clerk-react';

/**
 * useAppUser — Hook that wraps Clerk's useUser.
 * If local developer mode is enabled via localStorage, returns a mock user session.
 * Otherwise, behaves normally using Clerk authentication.
 */
export const useAppUser = () => {
  const clerkAuth = useUser();
  const isDev = localStorage.getItem('isDeveloperMode') === 'true';

  if (isDev) {
    return {
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: 'dev_clerk_id_12345',
        firstName: 'Developer',
        lastName: 'User',
        fullName: 'Clerk Developer',
        primaryEmailAddress: { emailAddress: 'dev_clerk_id_12345@clerk.local' },
        emailAddresses: [{ emailAddress: 'dev_clerk_id_12345@clerk.local' }],
        imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
      }
    };
  }

  return clerkAuth;
};
export default useAppUser;
