import Image from "next/image";
import { type Metadata } from "next";

import { cn } from "@rzl-zone/docs-ui/utils";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";

import ImgLogo from "@/images/rzl-logo.png";
import { APP_CONFIG } from "@/constants/app";
import { FumaNextLink } from "@/components/link";
import { SOURCE_CONFIG } from "@/configs/source/package";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: `404 - Page Not Found | ${APP_CONFIG.APP_NAME}`,
  robots: {
    follow: false,
    index: false,
    notranslate: true,
    googleBot: "noindex, nofollow, notranslate"
  }
};

const NotFound = () => {
  return (
    <main
      className={cn("grid min-h-screen place-content-center px- font-poppins")}
    >
      <div className={cn("text-center")}>
        <Image
          className="mx-auto rounded-full"
          width={125}
          height={125}
          src={ImgLogo}
          alt="Rzl Zone logo"
          priority
        />

        <h1
          className={cn(
            "font-black font-serif uppercase leading-none",
            "text-6xl underline",
            "text-red-700 dark:text-red-600"
          )}
          aria-hidden="true"
        >
          404
        </h1>

        <h2
          className={cn(
            "text-3xl mt-1",
            "font-bold uppercase",
            "text-red-700 dark:text-red-600"
          )}
        >
          Page Not Found
        </h2>

        <p
          className={cn("mt-2 text-lg", "text-neutral-900 dark:text-gray-300")}
        >
          Sorry, The page you’re looking for could not be found :(
        </p>

        <div className={cn("mt-4 flex flex-col items-center gap-2")}>
          <FumaNextLink
            href={SOURCE_CONFIG.LOADER.BASE_URL}
            aria-label={SOURCE_CONFIG.LOADER.BASE_URL}
          >
            <button
              // className={cn("font-semibold uppercase")}
              // size={"medium"}
              // variant="linkBlue"
              // asChild
              // withoutType
              className={cn(
                buttonVariants({
                  variant: "linkBlue",
                  size: "xl",
                  className: "font-semibold uppercase"
                })
              )}
            >
              Back to Docs
            </button>
          </FumaNextLink>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
