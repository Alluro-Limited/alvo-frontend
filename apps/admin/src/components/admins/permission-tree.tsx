import {Package} from "lucide-react";
import {Switch} from "@alvo/ui";
import type {PermissionModule} from "@/types/admins-types";
import {moduleIcon} from "./admin-labels";

interface PermissionTreeProps {
  modules: PermissionModule[];
  /** Flat list of granted permission keys. */
  granted: string[];
  disabled?: boolean;
  onChange: (granted: string[]) => void;
}

/** The module/permission toggle tree from the invite drawer and edit dialog. */
export function PermissionTree({modules, granted, disabled = false, onChange}: PermissionTreeProps) {
  const grantedSet = new Set(granted);

  const toggleModule = (module: PermissionModule, checked: boolean) => {
    const keys = new Set(module.permissions.map((p) => p.key));
    const rest = granted.filter((key) => !keys.has(key));
    onChange(checked ? [...rest, ...keys] : rest);
  };

  const togglePermission = (key: string, checked: boolean) =>
    onChange(checked ? [...granted, key] : granted.filter((item) => item !== key));

  return (
    <div className="flex flex-col divide-y divide-grey-200">
      {modules.map((module) => (
        <ModuleRow
          key={module.key}
          module={module}
          grantedSet={grantedSet}
          disabled={disabled}
          onModule={toggleModule}
          onPermission={togglePermission}
        />
      ))}
    </div>
  );
}

interface ModuleRowProps {
  module: PermissionModule;
  grantedSet: ReadonlySet<string>;
  disabled: boolean;
  onModule: (module: PermissionModule, checked: boolean) => void;
  onPermission: (key: string, checked: boolean) => void;
}

function ModuleRow({module, grantedSet, disabled, onModule, onPermission}: ModuleRowProps) {
  const Icon = moduleIcon[module.icon] ?? Package;
  const enabled = module.permissions.some((p) => grantedSet.has(p.key));
  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-grey-100 text-grey-600">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{module.label}</p>
            <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{module.subtitle}</p>
          </div>
        </div>
        <Switch checked={enabled} disabled={disabled} onCheckedChange={(checked) => onModule(module, checked)} aria-label={module.label} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 pl-11">
        {module.permissions.map((permission) => (
          <div key={permission.key} className="flex items-center justify-between gap-3">
            <span className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{permission.label}</span>
            <Switch
              checked={grantedSet.has(permission.key)}
              disabled={disabled}
              onCheckedChange={(checked) => onPermission(permission.key, checked)}
              aria-label={`${module.label} — ${permission.label}`}
              className="h-5 w-[34px] [&>span]:top-[2px] [&>span]:left-[2px] [&>span]:size-4 data-[checked]:[&>span]:translate-x-[14px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
