export const isAdminIdentity = (user, claims) => Boolean(user?.emailVerified && claims?.admin === true);
