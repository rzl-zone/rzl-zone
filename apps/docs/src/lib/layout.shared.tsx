import type { BaseLayoutProps } from "@/layouts/shared";
import Image from "next/image";
import ImgLogo from "@/images/rzl-logo.png";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "rzl-zone",
  repo: "rzl-zone",
  branch: "main"
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex gap-2 justify-center items-center">
          <div className="size-5.5 rounded-full relative overflow-hidden inline-block">
            <Image
              className="mx-auto absolute"
              fill
              src={ImgLogo}
              sizes="329px"
              alt="Rzl Zone logo"
              priority
            />
          </div>
          <div className="font-semibold text-base md:text-lg">Rzl Zone</div>
        </div>
      )
    },
    themeSwitch: {
      mode: "light-dark-system"
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`
  };
}
