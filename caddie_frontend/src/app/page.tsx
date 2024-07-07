"use client";

import { Button, Flex, Heading, HStack, VStack } from "@chakra-ui/react";

export default function Home() {

  return (
    <Flex alignContent={"center"} justifyContent={"center"} w={"%100"}>
    <VStack maxW={"800px"} mt={12}>
      <Heading size={"4xl"}>
        Caddie
      </Heading>
      <Heading size={"lg"}>
        True helper for true decentralised citizens
      </Heading>

      <Flex mt={10}>
        {/*<Status />*/}

        <br />
        <HStack gap={8}>
          <VStack w={"full"}>
            <Button
              w={"full"}
              mx={12}
              py={8}
              colorScheme={"gray"}
              onClick={() => {
                window.open("/propose", "_self");
              }}
              // onClick={handleSignMessage}
              // isLoading={isPending}
              // className="custom-button"
            >
              <Heading size={"md"}>Propose</Heading>
            </Button>
          </VStack>
          <VStack w={"full"}>
            <Button
              w={"full"}
              mx={12}
              py={8}
              colorScheme={"gray"}
              onClick={() => {
                window.open("/vote", "_self");
              }}
              // onClick={handleSignMessage}
              // isLoading={isPending}
              // className="custom-button"
            >
              <Heading size={"md"}>Vote</Heading>
            </Button>
          </VStack>
        </HStack>
      </Flex>
    </VStack>
    </Flex>
  );
}
