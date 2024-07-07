"use client";
import type { ReactNode } from "react";

// import "@/styles/globals.css";
import { Box, Flex } from "@chakra-ui/react";
import { Open_Sans } from "next/font/google";

import "@rainbow-me/rainbowkit/styles.css";
import { Footer, Header } from "@/components";

import { Providers } from "./providers";


const open_sans = Open_Sans({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "caddieGPT",
//   applicationName: "caddieGPT",
//   description: "caddieGPT is dao helper",
//   authors: {
//     name: "zekiblue",
//     url: "https://github.com/zekiblue/caddieGPT",
//   },
//   icons: "favicon.ico",
//   manifest: "site.webmanifest",
// };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={open_sans.className}>
        <Providers>
          <Flex flexDirection="column" minHeight="100vh">
            <Header />

            <Box as="main" flex={1} p={4}>
              {children}
            </Box>

            <Footer />
          </Flex>
          </Providers>
      </body>
    </html>

  );
}
