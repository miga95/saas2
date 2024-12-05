'use client';

import { ScriptEditor } from './script-editor';
import { AvatarSelector } from './avatar-selector';

export function UGCCreator() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 space-y-8">
      <ScriptEditor />
      <AvatarSelector />
    </div>
  );
}