import { FC } from "react";
import { NavTop } from "./nav-top";
import Link from "next/link";
import Image from "next/image";
import { Routers } from "@/types/routers";
import { ProfileBtn } from "./profile-btn";
import { cn } from "@/lib/utils";

interface HeaderNavProps {
  className?: string
}

const HeaderNav: FC<HeaderNavProps> = (props) => {
  const { className } = props;

  return (
    <div
      className={cn(
        "flex justify-between content-center p-2",
        className
      )}
    >
      <Link
        href={Routers.Home}
      >
        <Image
          src='/cloud-svgrepo-com.svg'
          alt="Logo"
          width={50}
          height={50}
          style={{ color: "red" }}
        />
      </Link>
      <div
        className="flex w-full"
      >
        <NavTop
          className="px-4 grow"
        />
        <ProfileBtn />
      </div>
    </div>
  )
}

export { HeaderNav }