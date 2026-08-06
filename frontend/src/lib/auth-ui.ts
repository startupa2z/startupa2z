export type AuthDialogMode = "signin" | "signup";

export const openAuthDialog = (
  mode: AuthDialogMode = "signin",
  redirectTo = "/welcome",
  email = "",
) => {
  window.dispatchEvent(
    new CustomEvent("startupa2z-open-auth", {
      detail: { mode, redirectTo, email },
    }),
  );
};
