import React, { useRef } from "react";
import { Upload, X, Paperclip } from "lucide-react";

export default function FileUpload({ label, hint, accept, files, onChange, onRemove }) {
  const ref = useRef();
  const hasFiles = files && files.length > 0;

  const handleFiles = (e) => {
    if (e.target.files) {
      onChange(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`w-full border-[1.5px] border-dashed rounded-sm p-5 text-left transition-all duration-200 ${
          hasFiles
            ? "border-[#5f7a55]/50 bg-[#5f7a55]/3"
            : "border-black/10 hover:border-[#B38B67] hover:bg-[#B38B67]/3"
        }`}
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <div className="flex items-start gap-3">
          <Upload size={18} className="text-[#B38B67] mt-0.5 shrink-0" />
          <div>
            <p className="text-[14px] font-medium text-[#151515]">{label}</p>
            <p className="text-[12px] text-[#151515]/45 mt-1">{hint}</p>
          </div>
        </div>
      </button>

      {hasFiles && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {files.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-[#F0EFEB] border border-black/5 rounded-full px-3 py-1 text-[11px] text-[#151515]/70"
            >
              <Paperclip size={10} />
              {f.name.length > 20 ? f.name.slice(0, 18) + "…" : f.name}
              <button
                onClick={() => onRemove(i)}
                className="text-[#151515]/40 hover:text-[#9b4d3d] transition-colors ml-0.5"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}