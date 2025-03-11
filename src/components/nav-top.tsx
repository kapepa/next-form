'use client'

import { cn } from "@/lib/utils";
import { FC } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Routers } from "@/types/routers";
import { usePathname } from 'next/navigation';
import { UserDtoType } from "../../dto/user.dto";

interface INavTop {
  className?: string,
  profile?: UserDtoType | null
}

const NavTop: FC<INavTop> = (props) => {
  const { profile, className } = props;
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex justify-center",
        className
      )}
    >
      <Button
        type="button"
        variant="link"
      >
        <Link
          href={Routers.Home}
          className={
            cn(pathname === Routers.Home ? "underline" : "")
          }
        >
          Home
        </Link>
      </Button>
      {
        !!profile
        && (
          <Button
            type="button"
            variant="link"
          >
            <Link
              href={Routers.Profile}
              className={
                cn(pathname === Routers.Profile ? "underline" : "")
              }
            >
              Profile
            </Link>
          </Button>
        )
      }
      {
        (profile?.role && profile?.role === "admin")
        && (
          <Button
            type="button"
            variant="link"
          >
            <Link
              href={Routers.Editor}
              className={
                cn(pathname === Routers.Editor ? "underline" : "")
              }
            >
              Editor
            </Link>
          </Button>
        )
      }
    </nav>
  )
}

export { NavTop }