import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import _ from "lodash";

import { useOptionalUser } from "~/auth/session.component";

import {
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export const meta: V2_MetaFunction = () => [
  { title: "indie-stack-opinionated" },
];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="lg:pb-18 px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pt-32">
              <div className="tritravelers absolute inset-0">
                <div className="container">
                  {_.map(_.range(200), (i) => (
                    <div key={`${i}`} className="tri"></div>
                  ))}
                </div>
              </div>
              <div className="hero index-content">
                <div className="hero-content text-center">
                  <div>
                    <h1>indie-stack-opinionated</h1>
                    <p className="mt-12 sm:mt-16">
                      <a
                        className="link link-primary"
                        href="https://github.com/thehatworks/remix-stack"
                      >
                        Maintained by @thehatworks
                      </a>
                      &nbsp;as a custom Remix Stack with our common tools.
                      Forked originally from @remix-run/indie-stack. Approaching
                      Production Ready in the limit ≐.
                    </p>
                    <p className="text-accent mt-4">
                      Check the README.md file for instructions on how to get
                      this project deployed.
                    </p>
                    {user ? (
                      <Link
                        to="/notes"
                        className="btn btn-primary mt-6 font-medium"
                      >
                        View Notes for {user.email}
                      </Link>
                    ) : (
                      <div className="mt-6 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                        <Link
                          to="/join?redirectTo=/notes"
                          className="btn btn-icon"
                        >
                          <UserPlusIcon />
                          Sign up
                        </Link>
                        <Link
                          to="/login?redirectTo=/notes"
                          className="btn btn-primary btn-icon"
                        >
                          <ArrowLeftOnRectangleIcon />
                          Log In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pb-18 relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8 lg:pt-16">
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center"></div>
              <a href="https://remix.run">
                <img
                  src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                  alt="Remix"
                  className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="mt-6 flex flex-wrap justify-center gap-8">
            {[
              {
                src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
                alt: "Fly.io",
                href: "https://fly.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg",
                alt: "SQLite",
                href: "https://sqlite.org",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
                alt: "Prisma",
                href: "https://prisma.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
                alt: "Tailwind",
                href: "https://tailwindcss.com",
              },
              {
                src: "https://raw.githubusercontent.com/postcss/brand/master/dist/postcss-logo-vertical.svg",
                alt: "PostCSS",
                href: "https://postcss.org",
              },
              {
                src: "https://raw.githubusercontent.com/saadeghi/files/main/daisyui/logo-4.svg",
                alt: "daisyUI",
                href: "https://daisyui.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
                alt: "Cypress",
                href: "https://www.cypress.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
                alt: "MSW",
                href: "https://mswjs.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
                alt: "Vitest",
                href: "https://vitest.dev",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
                alt: "Testing Library",
                href: "https://testing-library.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
                alt: "Prettier",
                href: "https://prettier.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
                alt: "ESLint",
                href: "https://eslint.org",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
                alt: "TypeScript",
                href: "https://typescriptlang.org",
              },
            ].map((img) => (
              <a
                key={img.href}
                href={img.href}
                className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
              >
                <img alt={img.alt} src={img.src} className="object-contain" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
