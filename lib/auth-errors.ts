export interface AuthError {
  code: string;
  message: string;
  userFriendlyMessage: string;
  action?: string;
}

export const getAuthError = (errorCode: string): AuthError => {
  const errorMap: { [key: string]: AuthError } = {
    'auth/email-already-in-use': {
      code: errorCode,
      message: 'The email address is already in use by another account.',
      userFriendlyMessage: 'An account with this email already exists.',
      action: 'Try signing in instead, or use a different email address.'
    },
    'auth/invalid-email': {
      code: errorCode,
      message: 'The email address is badly formatted.',
      userFriendlyMessage: 'Please enter a valid email address.',
      action: 'Check your email format and try again.'
    },
    'auth/operation-not-allowed': {
      code: errorCode,
      message: 'Password sign-in is not enabled for this project.',
      userFriendlyMessage: 'Email/password sign-in is not available.',
      action: 'Please contact support for assistance.'
    },
    'auth/weak-password': {
      code: errorCode,
      message: 'The password is invalid or the user does not have a password.',
      userFriendlyMessage: 'Password is too weak.',
      action: 'Choose a stronger password with at least 8 characters.'
    },
    'auth/user-disabled': {
      code: errorCode,
      message: 'The user account has been disabled by an administrator.',
      userFriendlyMessage: 'This account has been disabled.',
      action: 'Please contact support for assistance.'
    },
    'auth/user-not-found': {
      code: errorCode,
      message: 'There is no user record corresponding to this identifier.',
      userFriendlyMessage: 'No account found with this email.',
      action: 'Check your email or create a new account.'
    },
    'auth/wrong-password': {
      code: errorCode,
      message: 'The password is invalid for the given email.',
      userFriendlyMessage: 'Incorrect password.',
      action: 'Check your password and try again.'
    },
    'auth/too-many-requests': {
      code: errorCode,
      message: 'Too many unsuccessful sign-in attempts.',
      userFriendlyMessage: 'Too many failed attempts.',
      action: 'Please wait a moment before trying again.'
    },
    'auth/network-request-failed': {
      code: errorCode,
      message: 'Network error occurred.',
      userFriendlyMessage: 'Network connection error.',
      action: 'Check your internet connection and try again.'
    },
    'auth/popup-closed-by-user': {
      code: errorCode,
      message: 'The popup was closed before authentication completed.',
      userFriendlyMessage: 'Authentication was cancelled.',
      action: 'Please complete the authentication process.'
    },
    'auth/cancelled-popup-request': {
      code: errorCode,
      message: 'This operation has been cancelled due to another conflicting popup being opened.',
      userFriendlyMessage: 'Authentication was cancelled.',
      action: 'Please try again.'
    },
    'auth/popup-blocked': {
      code: errorCode,
      message: 'The popup has been blocked by the browser.',
      userFriendlyMessage: 'Popup was blocked by browser.',
      action: 'Please allow popups for this site and try again.'
    },
    'auth/account-exists-with-different-credential': {
      code: errorCode,
      message: 'An account already exists with the same email address but different sign-in credentials.',
      userFriendlyMessage: 'Account exists with different sign-in method.',
      action: 'Try signing in with a different method.'
    },
    'auth/requires-recent-login': {
      code: errorCode,
      message: 'This operation is sensitive and requires recent authentication.',
      userFriendlyMessage: 'Recent authentication required.',
      action: 'Please sign in again to continue.'
    },
    'auth/invalid-credential': {
      code: errorCode,
      message: 'The credential is malformed or has expired.',
      userFriendlyMessage: 'Invalid credentials.',
      action: 'Please check your email and password.'
    },
    'auth/invalid-verification-code': {
      code: errorCode,
      message: 'The SMS verification code used to create the phone auth credential is invalid.',
      userFriendlyMessage: 'Invalid verification code.',
      action: 'Please check the code and try again.'
    },
    'auth/invalid-verification-id': {
      code: errorCode,
      message: 'The verification ID used to create the phone auth credential is invalid.',
      userFriendlyMessage: 'Invalid verification.',
      action: 'Please try again.'
    },
    'auth/quota-exceeded': {
      code: errorCode,
      message: 'The SMS quota for the project has been exceeded.',
      userFriendlyMessage: 'Service temporarily unavailable.',
      action: 'Please try again later.'
    }
  };

  return errorMap[errorCode] || {
    code: errorCode,
    message: 'An unexpected error occurred.',
    userFriendlyMessage: 'Something went wrong.',
    action: 'Please try again or contact support if the problem persists.'
  };
};

export const isNetworkError = (errorCode: string): boolean => {
  return ['auth/network-request-failed', 'auth/too-many-requests'].includes(errorCode);
};

export const isUserError = (errorCode: string): boolean => {
  return [
    'auth/invalid-email',
    'auth/weak-password',
    'auth/user-not-found',
    'auth/wrong-password',
    'auth/email-already-in-use'
  ].includes(errorCode);
}; 