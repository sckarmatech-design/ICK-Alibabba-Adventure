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
import {
  DEFAULT_THEME,
  parseThemeFromCookieHeader,
  ThemeProvider,
  type ThemeName,
} from "./lib/theme";

export async function loader({ request }: LoaderFunctionArgs) {
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
      logo: string;
      socialMedia: { facebook: string; instagram: string; youtube: string };
    };
  };

  // Admin CMS is intentionally theme-agnostic and visually locked to
  // Midnight Summit. Force the theme for any /admin route so the data-theme
  // attribute on <html> stays consistent even if a public cookie is set.
  const url = new URL(request.url);
  const isAdminRoute = url.pathname.startsWith("/admin");
  const theme: ThemeName = isAdminRoute
    ? DEFAULT_THEME
    : parseThemeFromCookieHeader(request.headers.get("Cookie"));

  return { ...map, theme };
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
  // Theme is resolved server-side from the cookie and injected into <html>
  // so SSR markup already has the right data-theme attribute — no FOUC.
  const data = useLoaderData<typeof loader>() as { theme?: ThemeName };
  const theme = data?.theme ?? DEFAULT_THEME;

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-primary">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { mainNav, footerLinks, companyInfo, theme } =
    useLoaderData<typeof loader>();
  return (
    <ThemeProvider initialTheme={theme}>
      <div className="flex flex-col min-h-screen bg-primary text-ink">
        <Header mainNav={mainNav} companyInfo={companyInfo} />
        <main className="grow">
          <Outlet />
        </main>
        <Footer footerLinks={footerLinks} companyInfo={companyInfo} />
        <WhatsAppButton companyInfo={companyInfo} />
      </div>
    </ThemeProvider>
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
    <div className="flex flex-col min-h-screen bg-primary text-ink items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">{message}</h1>
        <p className="text-xl text-muted mb-8">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto bg-surface rounded-lg border border-border text-sm text-left">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
