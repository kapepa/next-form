'use client'

import { cn } from "@/lib/utils";
import { FC } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Routers } from "@/types/routers";
import { usePathname } from 'next/navigation';
import { useUserSessionClient } from "@/app/hooks/use-user-session-client";

interface INavTop {
  className?: string,
}

const NavTop: FC<INavTop> = (props) => {
  const { className } = props;
  const pathname = usePathname();
  const { user } = useUserSessionClient()

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
        !!user
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
    </nav>
  )
}

export { NavTop }