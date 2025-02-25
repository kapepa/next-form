import { FC } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Routers } from "@/types/routers";

interface ProfileBtnProps {
  className?: string
}

const ProfileBtn: FC<ProfileBtnProps> = (props) => {
  const { className } = props;
  const isLogin: boolean = false;

  if (!isLogin) {
    return (
      <Button
        type="button"
        variant="ghost"
        className="outline-none"
      >
        <Link
          href={Routers.login}
        >
          Log in
        </Link>
      </Button>
    )
  }

  return (
    <div
      className={cn(className)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="outline-none cursor-pointer"
        >
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

  )
}

export { ProfileBtn }