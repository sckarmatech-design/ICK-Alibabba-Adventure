import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import "./app.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import prisma from "./lib/prisma.server";
import { SITE_CONFIG } from "./lib/seo";

export async function loader(_args: LoaderFunctionArgs) {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value])) as {
    mainNav: Array<{
      label: string;
      href?: string;
      submenu?: Array<{ label: string; href: string }>;
    }>;
    footerLinks: Array<{
      category: string;
      links: Array<{ label: string; href: string }>;
    }>;
    companyInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      description: string;
      whatsapp: string;
      socialMedia: { facebook: string; instagram: string; youtube: string };
    };
  };
  return map;
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#0a0f1a]">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { mainNav, footerLinks, companyInfo } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1a] text-[#f9fafb]">
      <Header mainNav={mainNav} companyInfo={companyInfo} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer footerLinks={footerLinks} companyInfo={companyInfo} />
      <WhatsAppButton companyInfo={companyInfo} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1a] text-[#f9fafb] items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#16a34a] mb-4">{message}</h1>
        <p className="text-xl text-[#9ca3af] mb-8">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto bg-[#111827] rounded-lg border border-[#1f2937] text-sm text-left">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
