"use client";

import React from "react";

import { Box, Button, Flex, Heading, Input, Text, Textarea, VStack } from "@chakra-ui/react";
import { useWriteContract } from "wagmi";

import caddieABI from "@/abis/caddieGPTABI.json";

const POSSIBLE_DAOS = [
  {
    name: "Decentraland",
    id: "snapshot.dcl.eth",
  }
];

const caddieAddress = "0x5e5d71e3E0a113B86916404D82cCb78F1b082bcd";

export default function DraftProposal({
  daoId,
                                            }: any) {

  const [titleValue, setTitleValue] = React.useState('')
  const [bodyValue, setBodyValue] = React.useState('')
  const handleTitleChange = (event: any) => setTitleValue(event.target.value)
  const handleBodyChange = (event: any) => setBodyValue(event.target.value)
  const { writeContract } = useWriteContract();

  const submitProposal = () => {
    writeContract({
      abi: caddieABI,
      address: caddieAddress as `0x${string}`,
      functionName: "checkProposal",
      args: [
        titleValue,
        bodyValue,
      ],
    });
  };


  return (
    <Flex alignContent={"center"} justifyContent={"center"} w={"%100"}>
      <VStack maxW={"800px"} mt={12}>
        <Heading size={"4xl"}>
          {POSSIBLE_DAOS.find(dao => dao.id === daoId)?.name} Proposal
        </Heading>
        <Heading size={"lg"}>
          Know your proposal before submitting
        </Heading>
        <Text>
          Get possible result of your proposal and possible improvements on your text before submitting
        </Text>


        <Flex mt={10}>
          {/*<Status />*/}


          <br />
          <VStack alignItems={"right"}>
            <Box w={"full"} minW={"600px"}>
              <Text mb='8px'>Title</Text>
              <Input
                value={titleValue}
                onChange={handleTitleChange}
                placeholder='eg. Raise quorum for voting...'
                size='lg'
              />
            </Box>
            <Box w={"full"} minW={"600px"}>
              <Text mb='8px'>Description</Text>
              <Textarea
                placeholder='Why voters should vote for this proposal?'
                size='lg'
                onChange={handleBodyChange}
                value={bodyValue}
              />
            </Box>
            <Box>
              <Button
                w={"full"}
                isDisabled={!titleValue || !bodyValue}
                // mx={12}
                // py={8}
                colorScheme={"gray"}
                // onClick={() => {
                //   window.open("/propose", "_self");
                // }}
                onClick={submitProposal}
                // isLoading={isPending}
                // className="custom-button"
              >
                  Get Analysis
              </Button>
            </Box>
          </VStack>
        </Flex>
      </VStack>
    </Flex>


  );
}