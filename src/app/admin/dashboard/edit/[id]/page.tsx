import { getConsignmentById } from '@/actions/consignment';
import EditForm from './EditForm';
import { notFound } from 'next/navigation';

export default async function EditPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await getConsignmentById(parseInt(params.id)) as any;

  if (!data) {
    notFound();
  }

  return <EditForm data={data} />;
}
