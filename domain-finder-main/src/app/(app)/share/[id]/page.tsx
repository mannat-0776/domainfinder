import { SuspenseBoundary } from '@/components/ui/suspense-boundary';
import ShareContent from './share-content';

interface Props {
  params: { id: string };
}

export default function SharePage({ params }: Props) {
  return (
    <SuspenseBoundary>
      <ShareContent id={params.id} />
    </SuspenseBoundary>
  );
}
