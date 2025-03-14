"use client";

import { ChangeEvent, FC, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";

export type InputImagesRef = {
  reset: () => void;
};

interface InputImagesProps {
  images: File[];
  disabled: boolean;
  onChange: (files: File[]) => void;
}

const InputImages = forwardRef<InputImagesRef, InputImagesProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { images, disabled, onChange } = props;
  const [urls, setUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>(() => images);

  const handlerChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFiles = [...files, file];
      const newUrls = [...urls, URL.createObjectURL(file)];

      onChange(newFiles);
      setFiles(newFiles);
      setUrls(newUrls);
    }
  };

  const handlerDeleteImage = (index: number) => {
    const filesStore = JSON.parse(JSON.stringify(files));
    const urlsStore = urls.concat([]);

    filesStore.splice(index, 1);
    urlsStore.splice(index, 1);

    onChange(filesStore);
    setFiles(filesStore);
    setUrls(urlsStore);

    if (inputRef.current) inputRef.current.value = "";
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      setFiles([]);
      setUrls([]);
    },
  }));

  return (
    <div className="flex h-52 gap-6">
      <div>
        <div className="relative group">
          <Button
            asChild
            disabled={disabled}
            variant="outline"
            className="flex justify-center items-center cursor-pointer h-16 w-16"
            onClick={() => inputRef.current?.click()}
          >
            <Plus className="w-20 h-20" />
          </Button>
          <div className="absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 scale-0 rounded bg-black px-2 py-1 text-sm text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            Add new image
          </div>
          <input
            ref={inputRef}
            type="file"
            name="avatar"
            accept="image/*"
            disabled={disabled}
            className="hidden"
            onChange={handlerChangeImage}
          />
        </div>
      </div>
      {!!urls.length &&
        urls.map((url, index) => (
          <div key={`${url}-${index}`} className="relative group">
            <Button
              asChild
              variant="link"
              disabled={disabled}
              className="absolute right-0 top-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handlerDeleteImage(index)}
            >
              <X className="w-14 h-14" />
            </Button>
            <img src={url} alt={`load image ${index}`} className="w-52 h-52" />
          </div>
        ))}
    </div>
  );
});

export { InputImages };