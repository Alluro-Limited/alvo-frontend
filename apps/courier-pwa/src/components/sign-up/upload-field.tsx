import {Camera, FileCheck} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

interface UploadFieldProps {
  id: string;
  fileName: string;
  onSelect: (fileName: string) => void;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
}

/** Dashed drop box for the vehicle/license photos — mocked, stores only the file name. */
export function UploadField({id, fileName, onSelect, ...aria}: UploadFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex h-[112px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed bg-grey-100",
        aria["aria-invalid"] ? "border-danger-500" : "border-grey-300"
      )}
      {...aria}
    >
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file.name);
        }}
      />
      <span className="flex size-10 items-center justify-center rounded-full bg-white">
        {fileName ? <FileCheck className="size-5 text-primary-500" /> : <Camera className="size-5 text-grey-600" />}
      </span>
      <span className="max-w-[260px] truncate px-4 text-[13px] text-grey-600">{fileName || m["su.upload_hint"]()}</span>
    </label>
  );
}
