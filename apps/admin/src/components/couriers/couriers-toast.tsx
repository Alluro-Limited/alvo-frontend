import {AppToast} from "../app-toast";

/** The dark-teal confirmation toast under the courier flows ("Priscilla Awolowo account suspended"). */
export function CouriersToast(props: {message: string; onDismiss: () => void}) {
  return <AppToast {...props} variant="success" />;
}
