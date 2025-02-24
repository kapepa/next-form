import { cn } from "@/lib/utils";
import { FC } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Routers } from "@/types/routers";

interface INavTop {
  className?: string,
}

const NavTop: FC<INavTop> = (props) => {
  const { className } = props;

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
        >
          Home
        </Link>
      </Button>
    </nav>
  )
}

export { NavTop }