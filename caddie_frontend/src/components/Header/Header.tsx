"use client";
import { type FC } from "react";

import { HStack, Heading, ButtonGroup, Button } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

import { useWindowSize } from "@/hooks/useWindowSize";

import logo from "../../../public/img/logo_transparent.png";
import { DarkModeButton } from "../DarkModeButton";

const Header: FC = () => {
  const { isTablet } = useWindowSize();

  return (
    <HStack
      as="header"
      p={"1.5rem"}
      position="sticky"
      top={0}
      zIndex={10}
      justifyContent={"space-between"}
    >
      <HStack>
        <Image src={logo} alt="logo" width={45} height={45} />
        {!isTablet && (
          <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
            Caddie
          </Heading>
        )}
      </HStack>

      <HStack>
        <ButtonGroup>
          <Button
            w={"full"}
            mx={4}
            py={4}
            px={8}
            fontSize={"md"}
            colorScheme={"gray"}
            onClick={() => {
              window.open("/propose", "_self");
            }}
            // onClick={handleSignMessage}
            // isLoading={isPending}
            // className="custom-button"
          >Propose</Button>
          <Button
            w={"full"}
            // mx={4}
            mr={8}
            py={4}
            px={8}
            colorScheme={"gray"}
            onClick={() => {
              window.open("/vote", "_self");
            }}
            // onClick={handleSignMessage}
            // isLoading={isPending}
            // className="custom-button"
          >Vote</Button>
        </ButtonGroup>
        <ConnectButton />
        <DarkModeButton />
      </HStack>
    </HStack>
  );
};

export default Header;
