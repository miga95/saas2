'use client';

import { Suspense } from 'react';
import EditorClient from './editor-client';
import { useAuth } from '@/hooks/use-auth';

export default function Editor() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorClient />
    </Suspense>
  );
}