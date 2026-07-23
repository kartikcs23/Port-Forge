import { useUser } from '@clerk/clerk-react';

/**
 * useAppUser — Thin wrapper around Clerk's useUser.
 */
export const useAppUser = () => useUser();
export default useAppUser;
