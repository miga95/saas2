import { Suspense } from 'react';
import PreviewClient from './preview-client';

export default function PreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewClient />
    </Suspense>
  );
}