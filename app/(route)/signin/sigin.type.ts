import { SIGN_IN_FORM } from "./signin.constant";

export type SignInForm = (typeof SIGN_IN_FORM)[keyof typeof SIGN_IN_FORM];

type FormName = SignInForm["name"];
