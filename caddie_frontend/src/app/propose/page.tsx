"use client";

import { Box, Button, Flex, Heading, HStack, Select, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";

const POSSIBLE_DAOS = [
  {
    name: "Decentraland",
    id: "snapshot.dcl.eth",
  }
  ];

export default function Home() {
  const [selectedDao, setSelectedDao] = useState("");

  const handleSelectChange = (event: any) => {
    setSelectedDao(event.target.value);
  };

  return (
    <Flex alignContent={"center"} justifyContent={"center"} w={"%100"}>
      <VStack maxW={"800px"} mt={12}>
        <Heading size={"4xl"}>
          Proposal Caddie
        </Heading>
        <Heading size={"lg"}>
          Get help with your DAO proposals
        </Heading>


        <Flex mt={10}>
          {/*<Status />*/}


          <br />
          <VStack alignItems={"left"}>
            <Box maxW={"300px"}>
            <Text fontWeight={"bold"}>
              Protocol
            </Text>
            <Text fontSize={"small"}>
              Select which protocol to you want to draft your proposal
            </Text>
            </Box>
          <HStack gap={8}>
            <Box w={"full"} minW={"300px"}>
            <Select placeholder='Select option' onChange={handleSelectChange} size={"lg"}>
              {POSSIBLE_DAOS.map((dao) => (
                <option key={dao.id} value={dao.id}>
                  {dao.name}
                </option>
              ))}
            </Select>
            </Box>
            <VStack w={"full"}>
              <Button
                isDisabled={!selectedDao}
                w={"full"}
                size={"lg"}
                // mx={12}
                // py={8}
                colorScheme={"gray"}
                onClick={() => {
                  window.open(`/propose/${selectedDao}`, "_self");
                }}
                // onClick={handleSignMessage}
                // isLoading={isPending}
                // className="custom-button"
              >
                <Heading size={"md"}>Draft a Proposal</Heading>
              </Button>
            </VStack>
          </HStack>
          </VStack>
        </Flex>
      </VStack>
    </Flex>

  );
}
