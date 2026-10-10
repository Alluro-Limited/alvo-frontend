import {AppToast} from "../app-toast";

/** The dark-teal confirmation toast under the users name ("Emeka Okonkwo's account suspended") — see `AppToast`. */
export function UsersToast(props: {message: string; onDismiss: () => void}) {
  return <AppToast {...props} variant="success" />;
}
