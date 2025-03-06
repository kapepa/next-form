"use client";

import { FC, useCallback } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Routers } from "@/types/routers";
import { signOut } from "next-auth/react";
import { UserDtoType } from "../../dto/user.dto";

interface ProfileBtnProps {
  className?: string,
  profile?: UserDtoType | null
}

const ProfileBtn: FC<ProfileBtnProps> = (props) => {
  const { profile, className } = props;

  if (!profile) {
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

  const getFirstLetter = useCallback(() => {
    return profile.name.charAt(0).toLocaleUpperCase()
  }, [profile.name])

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
              src={profile?.avatar}
            />
            <AvatarFallback>{getFirstLetter()}</AvatarFallback>
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