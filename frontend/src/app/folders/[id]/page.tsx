import FolderDetail from "@/components/FolderDetail.client";

type Props = {
    params: { id: string };
};

export default function FolderPage({ params }: Props) {
    const { id } = params;
    return <FolderDetail folderId={Number(id)} />;
}
