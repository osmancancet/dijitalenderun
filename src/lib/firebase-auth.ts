import { getAuth, type Auth } from "firebase/auth";
import { app } from "./firebase";

let auth: Auth;

export function getAuthInstance() {
  if (!auth) auth = getAuth(app());
  return auth;
}
