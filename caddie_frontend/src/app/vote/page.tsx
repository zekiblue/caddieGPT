"use client";

import { Button, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";

const POSSIBLE_PROPOSALS = [
  {
    id: "0x365eab458d8434c334c93c1d45baaeb90f00f01e18f9736ba60e9edefab10af1",
    daoCode: "snapshot.dcl.eth",
    title: "Change Decentraland DAO Discord Linked Profiles from DAO Discord to DCL Discord",
    body: "I believe this to be a small yet effective change as many people eithergot banned or left DAO Discord due to poor management and ineffective moderation. I'm not going to point fingers to anyone but we all know who they are.\n" +
      "\n" +
      "I do not believe that an individually governed, manupilated and controlled Discord channel reflects, conveys or encompasses all active users. Especially when we're trying to pitch \"DECENTRALIZED\" to the masses.\n" +
      "\n" +
      "Decentraland DAO Linked Profiles should point to the Official Decentraland Discord.\n" +
      "\n" +
      "Please vote Yes or No"
  },
  {
    id: "0xccc1e48ff69c5bb4ecb7fede490b97a8a66fa9dd91cab9311471dfa0a186b79d",
    daoCode: "snapshot.dcl.eth",
    title: "Add the location -71,117 to the Points of Interest",
    body: "I own the land that the Facemoon Gallery is on, and am asking for a POI on MeryShark's behalf. Mery has hosted 38 events and published wearables to match each theme. I feel that her contributions to DCL have earned this location a POI. Thank you!"
  },
  {
    id: "0x5f94d10cc56160b80f63ed718ce13bdd807c663c0f0aea3166aef8934f897e9a",
    daoCode: "snapshot.dcl.eth",
    title: "Player Compensation for Duel Arena\n",
    body: "Should the following $1,400 grant in the Core Unit category be approved?\n" +
      "\n" +
      "Abstract\n" +
      "The Duel Arena game, a grant-funded game within Decentraland, recently concluded a tournament with promised payouts. Unfortunately, the grant originally allocated for these payouts was revoked, and Injester chose to withhold the funds rather than distribute them to the tournament winners. This has resulted in significant disappointment and distrust among the players, who invested time and effort with the expectation of a fair reward."
  }
];

export default function Home() {

  const { address: userWalletAddress } = useAccount();

  const [caddieProposalResponse, setCaddieProposalResponse] = React.useState({});

  useEffect(() => {
    if (userWalletAddress) {
      const postBody = JSON.stringify(POSSIBLE_PROPOSALS.map(proposal => proposal.id));
      console.log("pb", postBody)
      fetch(`${process.env.NEXT_PUBLIC_CADDIE_BACKEND}/multiVotes?daoCode=dcl.eth&walletAddress=${userWalletAddress}`, {
        body: postBody,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST"
      }).then(r => r.json()).then( r => {
        setCaddieProposalResponse(r);
      }
      ).catch(console.error);
    }
  }
  , [userWalletAddress]);

  // @ts-ignore
  return (
    <Flex alignContent={"center"} justifyContent={"center"} w={"%100"}>
      <VStack maxW={"800px"} mt={12}>
        <Heading size={"4xl"}>
          Vote Caddie
        </Heading>
        <Heading size={"lg"}>
          Which proposals might interest you?
        </Heading>
        <Text>
          Understand which proposals might be something you want to vote on based on your voting history
        </Text>

        <Flex mt={10}>
          {/*<Status />*/}

          <br />
          <HStack gap={8}>
            <VStack w={"full"}>
              <Button
                w={"full"}
                colorScheme={"gray"}
                px={8}
                // onClick={() => {
                //   window.open("/propose", "_self");
                // }}
                // onClick={handleSignMessage}
                // isLoading={isPending}
                // className="custom-button"
              >
                Notify me
              </Button>
            </VStack>
            <VStack w={"full"}>
              <Button
                w={"full"}
                // mx={12}
                // py={8}
                px={8}
                colorScheme={"gray"}
                // onClick={() => {
                //   window.open("/vote", "_self");
                // }}
                // onClick={handleSignMessage}
                // isLoading={isPending}
                // className="custom-button"
              >
                Scan your past
              </Button>
            </VStack>
          </HStack>
        </Flex>
        <VStack mt={10} >
          <Heading alignSelf={"left"} w={"full"}>
            Active Proposals
          </Heading>
          <Text alignSelf={"left"} w={"full"}>
            Based on your previous votes and discussions proposals that you might be interested
          </Text>
          <br/>

          {POSSIBLE_PROPOSALS.map((proposal) => (
            <>
            {
              // @ts-expect-error - caddieProposalResponse is a dictionary
              caddieProposalResponse[proposal.id] && caddieProposalResponse[proposal.id].should_vote === true &&
                <VStack key={proposal.id} w={"full"} p={4} borderWidth={1} borderRadius={8}>
                  <Heading size={"md"} w={"full"} alignSelf={"left"}>
                    {proposal.title}
                  </Heading>
                  <Text>
                    {proposal.body.slice(0, 300) + '...'}
                  </Text>
                  <Text alignSelf={"left"} w={"full"} fontWeight={"bold"}>
                    Caddie proposal
                  </Text>
                  <HStack w={"full"}>
                    <Button colorScheme={"gray"} w={"full"}>Go to Voting</Button>
                  </HStack>
                </VStack>
            }
            </>
          ))}
        </VStack>
      </VStack>
    </Flex>

  );
}
