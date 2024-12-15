import { Suspense } from 'react';
import EditorClient from './editor-client';

export default function Editor() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorClient />
    </Suspense>
  );
}