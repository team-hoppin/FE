import ClientAlbumAnalysis from "../_client-album-analysis";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AlbumAnalysisPage({ params }: Props) {
  const { id } = await params;

  return <ClientAlbumAnalysis promotionId={Number(id)} />;
}
