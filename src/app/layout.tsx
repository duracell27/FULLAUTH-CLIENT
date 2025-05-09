import type { Metadata } from "next";
import { MainProvider } from "@/shared/providers";
import "@/shared/styles/globals.css";

export const metadata: Metadata = {
  title: {
    absolute: "Lendower",
    template: "%s | Lendower",
  },
  description: "Lendower — a handy app for calculating debts from shared trips, cafe visits, or group expenses. Easily track who owes whom!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
