import {useState} from "react";
import type {ProfileTab} from "./profile-nav";

export type PasswordError = "wrong_password" | "generic" | null;

/** Tab + dialog + toast state for the profile page. */
export function useProfileOverlays() {
  const [tab, setTab] = useState<ProfileTab>("personal");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<PasswordError>(null);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  return {
    tab,
    setTab,
    passwordOpen,
    passwordError,
    signOutOpen,
    toast,
    openPassword: () => setPasswordOpen(true),
    closePassword: () => {
      setPasswordOpen(false);
      setPasswordError(null);
    },
    setPasswordError,
    openSignOut: () => setSignOutOpen(true),
    closeSignOut: () => setSignOutOpen(false),
    showToast: setToast,
    dismissToast: () => setToast(null),
  };
}
