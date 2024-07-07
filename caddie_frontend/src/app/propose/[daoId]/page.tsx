import DraftProposal from "@/app/propose/[daoId]/DraftProposal";


export default async function Home({
                                        params,
                                      }: {
  params: { daoId: string; };
}) {

  return (
    <DraftProposal daoId={params.daoId} />

  );
}
