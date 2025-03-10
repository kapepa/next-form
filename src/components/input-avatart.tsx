"use client";

import { FC, InputHTMLAttributes, useCallback, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { z } from "zod";
import { profileSchema } from "@/lib/schemas/profile-schema";

type AvatarType = z.infer<typeof profileSchema>["avatar"];

interface InputAvatartProps extends InputHTMLAttributes<HTMLInputElement> {
  avatar: AvatarType,
  profileName: string,
  onLoadAvatart: (file: File) => void
}

const InputAvatart: FC<InputAvatartProps> = (props) => {
  const { avatar, disabled, profileName, onLoadAvatart, ...other } = props;
  const refInput = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<AvatarType>(() => avatar);
  const [file, setFile] = useState<File | string | undefined>(undefined);

  const handlerLoadAvatar = useCallback(() => {
    refInput.current?.click();
  }, [refInput.current]);

  const handlerName = useMemo(() => {
    return profileName.charAt(0).toUpperCase();
  }, [profileName])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setUrl(URL.createObjectURL(file)); // Create a URL for the file
      onLoadAvatart(file)
    }
  };


  return (
    <div className="flex gap-x-6 justify-between">
      <div>
        <input
          {...other}
          ref={refInput}
          type="file"
          name="avatar"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          disabled={disabled}
          onClick={handlerLoadAvatar}
        >
          Load
        </Button>
      </div>

      <div>
        {
          !!url
            ? (
              <img
                src={typeof url === "string" ? url : URL.createObjectURL(url)}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            )
            :
            (
              <div
                className="bg-[hsl(var(--muted))] p-4 w-24 h-24 flex justify-center items-center rounded-full text-4xl"
              >
                {handlerName}
              </div>
            )}
      </div>
    </div>
  );
};

export { InputAvatart };