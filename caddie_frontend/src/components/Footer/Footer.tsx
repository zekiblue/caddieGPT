"use client";
import { type FC } from "react";

import { Box } from "@chakra-ui/react";
import Link from "next/link";

const Footer: FC = () => {
  return (
    <Box as="footer" p={"1rem"} position="sticky" bottom={0} zIndex={10} textAlign={"center"}>
      <Link
        href="https://github.com/zekiblue/caddieGPT"
        target="_blank"
        rel="noopener noreferrer"
      >
        This is a demo project. Use at your own risk.
      </Link>
    </Box>
  );
};

export default Footer;
