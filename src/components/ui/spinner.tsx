import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { FC } from "react";

interface SpinnerProps {
  className?: string,
}

const Spinner: FC<SpinnerProps> = (props) => {
  const { className } = props;

  return (
    <Loader
      className={cn(
        "w-6 h-6 animate-spin",
        className,
      )}
    />
  )
}


export { Spinner };