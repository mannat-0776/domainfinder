import { SuspenseBoundary } from '@/components/ui/suspense-boundary';
import CompareContent from './compare-content';

export default function ComparePage() {
  return (
    <SuspenseBoundary>
      <CompareContent />
    </SuspenseBoundary>
  );
}
