import { FC } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ProfileBtnProps {
  className?: string
}

const ProfileBtn: FC<ProfileBtnProps> = (props) => {
  const { className } = props;

  return (
    <div
      className={cn(className)}
    >
      <Button
        type="button"
        variant="ghost"
      >
        Log in
      </Button>
    </div>
  )
}

export { ProfileBtn }