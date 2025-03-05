"use client";

import { FC } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Routers } from "@/types/routers";
import { useSession, signOut } from "next-auth/react";

interface ProfileBtnProps {
  className?: string
}

const ProfileBtn: FC<ProfileBtnProps> = (props) => {
  const { className } = props;
  const { data: session } = useSession();

  if (!session) {
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

  const handleLogout = async () => {
    await signOut({ callbackUrl: Routers.login }); // Redirect to login page after logout
  };

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

          <DropdownMenuSeparator />
          <DropdownMenuItem
            asChild
          >
            <Button
              type="button"
              variant="link"
              onClick={handleLogout}
              className="w-full flex justify-start cursor-pointer"
            >
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

  )
}

export { ProfileBtn }