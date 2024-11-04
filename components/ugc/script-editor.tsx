'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Info, Wand2 } from 'lucide-react';

export function ScriptEditor() {
  const [script, setScript] = useState('');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl">Script</h2>
          <Info className="w-4 h-4 text-slate-400" />
        </div>
        <Button variant="outline" className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">
          <Wand2 className="w-4 h-4 mr-2" />
          AI script writer
        </Button>
      </div>
      <div className="relative">
        <Textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter your script here..."
          className="min-h-[200px] bg-slate-900/50 border-slate-800 resize-none rounded-xl"
          maxLength={3600}
        />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Button variant="ghost" className="text-slate-400 hover:text-white">
            Add pause
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-white">
            Edit pronunciation
          </Button>
        </div>
        <div className="absolute bottom-4 right-4 text-sm text-slate-400">
          {script.length}/3600
        </div>
      </div>
    </div>
  );
}