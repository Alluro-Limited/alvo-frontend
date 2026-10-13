import {useEffect, useState} from "react";
import {Trash2} from "lucide-react";
import {AddressPickerSheet} from "@/components/account/address-picker-sheet";
import {AddressToast} from "@/components/account/address-toast";
import {DeleteAddressDialog} from "@/components/account/delete-address-dialog";
import {PageHeader} from "@/components/account/page-header";
import {useAddressesQuery} from "@/queries/use-account-queries";
import type {SavedAddress} from "@/types/account-types";
import {m} from "@/paraglide/messages";

type Notice = "added" | "deleted" | null;

/** Saved Addresses — the locker-node list with per-row delete and the Add New Address picker sheet. */
export function AddressesPage() {
  const query = useAddressesQuery();
  const [picker, setPicker] = useState(false);
  const [removing, setRemoving] = useState<SavedAddress | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <main className="relative flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-[60px]">
      <PageHeader title={m["adr.title"]()} />
      <AddressList addresses={query.data ?? []} loading={query.isLoading} onRemove={setRemoving} />
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-primary-500"
        >
          {m["adr.add"]()}
        </button>
      </div>
      <AddressOverlays
        picker={picker}
        removing={removing}
        notice={notice}
        onPickerClose={() => setPicker(false)}
        onAdded={() => setNotice("added")}
        onRemoveClose={() => setRemoving(null)}
        onDeleted={() => {
          setRemoving(null);
          setNotice("deleted");
        }}
      />
    </main>
  );
}

interface AddressOverlaysProps {
  picker: boolean;
  removing: SavedAddress | null;
  notice: Notice;
  onPickerClose: () => void;
  onAdded: () => void;
  onRemoveClose: () => void;
  onDeleted: () => void;
}

function AddressOverlays({picker, removing, notice, onPickerClose, onAdded, onRemoveClose, onDeleted}: AddressOverlaysProps) {
  return (
    <>
      {notice ? <AddressToast message={notice === "added" ? m["adr.added"]() : m["adr.deleted"]()} /> : null}
      <AddressPickerSheet open={picker} onClose={onPickerClose} onAdded={onAdded} />
      {removing ? <DeleteAddressDialog addressId={removing.id} onClose={onRemoveClose} onDeleted={onDeleted} /> : null}
    </>
  );
}

interface AddressListProps {
  addresses: SavedAddress[];
  loading: boolean;
  onRemove: (address: SavedAddress) => void;
}

function AddressList({addresses, loading, onRemove}: AddressListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="skeleton h-14 w-full rounded-[12px]" />
        <div className="skeleton h-14 w-full rounded-[12px]" />
        <div className="skeleton h-14 w-full rounded-[12px]" />
      </div>
    );
  }
  if (addresses.length === 0) {
    return <p className="py-8 text-center text-[14px] text-grey-500">{m["adr.empty"]()}</p>;
  }
  return (
    <ul className="flex w-full flex-col">
      {addresses.map((address, i) => (
        <li key={address.id} className={`flex w-full items-center gap-3 py-4 ${i === 0 ? "" : "border-t-[0.5px] border-grey-300"}`}>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{address.name}</span>
            <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{address.address}</span>
          </span>
          <button
            type="button"
            onClick={() => onRemove(address)}
            aria-label={`${m["adr.del_row"]()} ${address.name}`}
            className="flex size-8 shrink-0 items-center justify-center text-status-fail"
          >
            <Trash2 className="size-5" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
