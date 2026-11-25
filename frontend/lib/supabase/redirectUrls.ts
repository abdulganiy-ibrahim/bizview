const NODE_ENV = process.env.NODE_ENVIRONMENT;

export function getSignUpRedirectUrl(): string {
  if (NODE_ENV === 'production') {
    return "https://bizview-pi.vercel.app/sign-up";
  }

  return "http://localhost:3000/sign-up";
}

export function getUpdatePasswordRedirectUrl(): string {
  if (NODE_ENV === "production"){
    return "https://bizview-pi.vercel.app/update-password";
  }

  return "http://localhost:3000/update-password";
}