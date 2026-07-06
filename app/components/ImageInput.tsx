import { useEffect, useRef, useState } from "react";
import imageCompression, { type Options } from "browser-image-compression";

export type ImageInputProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  folder: string;
  accept?: string;
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function hasTransparency(file: File): Promise<boolean> {
  if (file.type !== "image/png") return false;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(false);
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 3; i < data.length; i += 4 * 10) {
          if (data[i] < 255) {
            resolve(true);
            return;
          }
        }
        resolve(false);
      } catch {
        resolve(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
}

async function compressImage(file: File): Promise<File> {
  const transparent = await hasTransparency(file);

  const options: Options = {
    maxWidthOrHeight: 1920,
    initialQuality: 0.8,
    useWebWorker: true,
  };

  if (transparent) {
    options.fileType = "image/webp";
  }

  try {
    return await imageCompression(file, options);
  } catch {
    return file;
  }
}

export function ImageInput({
  name,
  label,
  defaultValue = "",
  value: controlledValue,
  onChange,
  required,
  folder,
  accept = "image/*",
  onLoadingChange,
  className = "",
}: ImageInputProps) {
  const isControlled = controlledValue !== undefined;
  const initialUrl = isControlled ? controlledValue : (defaultValue ?? "");
  const [mode, setMode] = useState<"url" | "upload">(
    initialUrl ? "url" : "url",
  );
  const [urlValue, setUrlValue] = useState(initialUrl);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<{
    before: number;
    after: number;
    convertedToWebp: boolean;
  } | null>(null);

  const objectUrlRef = useRef<string | null>(null);

  const hiddenValue = isControlled
    ? (controlledValue ?? "")
    : mode === "url"
      ? urlValue
      : (uploadedUrl ?? "");

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isControlled) {
      setUrlValue(controlledValue ?? "");
      setPreview(controlledValue || null);
    }
  }, [isControlled, controlledValue]);

  async function uploadFile(selectedFile: File) {
    setLoading(true);
    setError(null);
    setCompressionInfo(null);
    onLoadingChange?.(true);

    const compressedFile = await compressImage(selectedFile);

    if (compressedFile !== selectedFile) {
      setCompressionInfo({
        before: selectedFile.size,
        after: compressedFile.size,
        convertedToWebp: compressedFile.type === "image/webp",
      });
    }

    const data = new FormData();
    data.append("file", compressedFile);
    data.append("folder", folder);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: data,
        credentials: "same-origin",
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadedUrl(result.url);
      setPreview(result.url);
      setMode("upload");
      onChange?.(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadedUrl(null);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(selected);
    objectUrlRef.current = objectUrl;

    setFile(selected);
    setPreview(objectUrl);
    setMode("upload");
    setUploadedUrl(null);
    setError(null);
    setCompressionInfo(null);

    uploadFile(selected);
  }

  function switchMode(nextMode: "url" | "upload") {
    setMode(nextMode);
    setError(null);
  }

  function handleClear() {
    setUrlValue("");
    setFile(null);
    setUploadedUrl(null);
    setPreview(null);
    setError(null);
    setCompressionInfo(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (isControlled) {
      onChange?.("");
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {hiddenValue && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchMode("url")}
          className={`px-3 py-1 text-sm rounded transition ${
            mode === "url"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Paste URL
        </button>
        <button
          type="button"
          onClick={() => switchMode("upload")}
          className={`px-3 py-1 text-sm rounded transition ${
            mode === "upload"
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Upload Image
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          value={isControlled ? (controlledValue ?? "") : urlValue}
          onChange={(e) => {
            const next = e.target.value;
            if (isControlled) {
              onChange?.(next);
            } else {
              setUrlValue(next);
            }
            setPreview(next || null);
          }}
          placeholder="https://..."
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
        />
      ) : (
        <div className="space-y-2">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white file:cursor-pointer disabled:opacity-50"
          />
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="inline-block w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              Compressing / uploading...
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {compressionInfo && !loading && (
        <p className="text-sm text-green-400">
          Compressed from {formatBytes(compressionInfo.before)} to{" "}
          {formatBytes(compressionInfo.after)}
          {compressionInfo.convertedToWebp && " (WebP)"}
        </p>
      )}

      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 rounded border border-gray-700 object-cover"
          />
        </div>
      )}

      <input type="hidden" name={name} value={hiddenValue} />
    </div>
  );
}

type ImageListInputProps = {
  name: string;
  label: string;
  defaultValues?: string[];
  folder: string;
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
};

export function ImageListInput({
  name,
  label,
  defaultValues = [],
  folder,
  onLoadingChange,
  className = "",
}: ImageListInputProps) {
  const [items, setItems] = useState<{ id: number; value: string }[]>(() =>
    defaultValues.length > 0
      ? defaultValues.map((value, index) => ({ id: index, value }))
      : [],
  );

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), value: "" },
    ]);
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-start gap-2">
            <div className="flex-1">
              <ImageInput
                name={name}
                label={`Image ${index + 1}`}
                defaultValue={item.value}
                folder={folder}
                onLoadingChange={onLoadingChange}
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="mt-6 px-3 py-2 bg-red-900/50 hover:bg-red-900 text-red-200 rounded transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition text-sm"
      >
        Add Image
      </button>
      {items.length === 0 && (
        <p className="text-sm text-gray-500">No images added yet.</p>
      )}
    </div>
  );
}
