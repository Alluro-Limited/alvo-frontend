import {Button, Switch} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {AdminProfile} from "@/types/profile-types";

interface SecurityPanelProps {
  profile: AdminProfile;
  toggling2fa: boolean;
  onChangePassword: () => void;
  onToggle2fa: (enabled: boolean) => void;
}

function Row({label, subtitle, children}: {label: string; subtitle: string; children: React.ReactNode}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-grey-200 py-4 last:border-b-0">
      <div>
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{label}</p>
        <p className="pt-0.5 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

/** Security tab — password row with Change Password, the 2FA toggle, and the admin id. */
export function ProfileSecurityPanel({profile, toggling2fa, onChangePassword, onToggle2fa}: SecurityPanelProps) {
  const passwordSub =
    profile.passwordChangedDaysAgo === 0
      ? m["profile.password_sub_today"]()
      : m["profile.password_sub"]({days: profile.passwordChangedDaysAgo});
  return (
    <section className="w-[651px] rounded-2xl border border-grey-200 bg-white p-6">
      <h2 className="text-lg leading-[1.4] font-semibold text-black">{m["profile.security_title"]()}</h2>
      <p className="pt-1 pb-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["profile.security_subtitle"]()}</p>
      <Row label={m["profile.password_label"]()} subtitle={passwordSub}>
        <Button variant="outline" onClick={onChangePassword}>
          {m["profile.change_password"]()}
        </Button>
      </Row>
      <Row label={m["profile.twofa_label"]()} subtitle={m["profile.twofa_sub"]()}>
        <Switch
          checked={profile.twoFactorEnabled}
          disabled={toggling2fa}
          onCheckedChange={onToggle2fa}
          aria-label={m["profile.twofa_label"]()}
        />
      </Row>
      <Row label={m["profile.admin_id_label"]()} subtitle={m["profile.admin_id_sub"]()}>
        <span className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{profile.id}</span>
      </Row>
    </section>
  );
}
