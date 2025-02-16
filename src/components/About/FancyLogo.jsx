import { useRef } from "react";
import logo from "@/assets/logo.png";
import { Image } from "@heroui/react";

export const FancyLogo = ({ since }) => {
  const boundingRef = useRef(null);

  return (
    <div className="flex flex-col [perspective:800px] p-5 bg-content2 dark:bg-transparent dark:border-b">
      <div
        onMouseLeave={() => {
          boundingRef.current = null;
        }}
        onMouseEnter={(ev) => {
          boundingRef.current = ev.currentTarget.getBoundingClientRect();
        }}
        onMouseMove={(ev) => {
          if (!boundingRef.current) return;
          const x = ev.clientX - boundingRef.current.left;
          const y = ev.clientY - boundingRef.current.top;
          const xPercentage = x / boundingRef.current.width;
          const yPercentage = y / boundingRef.current.height;
          const xRotation = (xPercentage - 0.5) * 20;
          const yRotation = (0.5 - yPercentage) * 20;

          ev.currentTarget.style.setProperty("--x-rotation", `${yRotation}deg`);
          ev.currentTarget.style.setProperty("--y-rotation", `${xRotation}deg`);
          ev.currentTarget.style.setProperty("--x", `${xPercentage * 100}%`);
          ev.currentTarget.style.setProperty("--y", `${yPercentage * 100}%`);
        }}
        className="group relative w-full flex flex-col gap-6 py-6 items-center overflow-hidden rounded-lg bg-gradient-to-b from-[#EAFFED] to-[#C6F7C9] p-4 text-[#01A977] transition-transform ease-out hover:[transform:rotateX(var(--x-rotation))_rotateY(var(--y-rotation))_scale(1.05)]"
      >
        <Image
          src={logo}
          alt="logo"
          classNames={{ wrapper: "size-24", image: "aspect-square" }}
        />
        <footer className="flex items-end">
          <span className="flex rounded-sm border border-current px-1 py-px text-xs uppercase">
            NEXTFLUX{" "}
            <span className="-my-px mx-1 inline-block w-4 border-l border-r border-current bg-[repeating-linear-gradient(-45deg,currentColor,currentColor_1px,transparent_1px,transparent_2px)]" />{" "}
            {since}
          </span>
        </footer>
        <div className="z-10 pointer-events-none absolute inset-0 group-hover:bg-[radial-gradient(at_var(--x)_var(--y),rgba(255,255,255,0.3)_20%,transparent_80%)]" />
      </div>
    </div>
  );
};
