'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

export function ProductFineTuning() {
  const [triggerWord, setTriggerWord] = useState('');
  const [trainingProgress, setTrainingProgress] = useState(0);

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Fine-tuning</h1>
        <Button size="lg">Start Training</Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-8 p-4 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Upload Images</h2>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Drag and drop your product images here, or click to select files
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger-word">Trigger Word</Label>
            <Input
              id="trigger-word"
              placeholder="Enter trigger word"
              value={triggerWord}
              onChange={(e) => setTriggerWord(e.target.value)}
            />
          </div>

          {trainingProgress > 0 && (
            <div className="space-y-2">
              <Label>Training Progress</Label>
              <Progress value={trainingProgress} />
              <p className="text-sm text-muted-foreground text-right">
                {trainingProgress}%
              </p>
            </div>
          )}
        </Card>

        <Card className="col-span-4 p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Training Parameters</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="training-steps">Training Steps</Label>
                <Input
                  id="training-steps"
                  type="number"
                  placeholder="1000"
                  min="100"
                  max="10000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="learning-rate">Learning Rate</Label>
                <Input
                  id="learning-rate"
                  type="number"
                  placeholder="0.0001"
                  step="0.0001"
                  min="0.0001"
                  max="0.01"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}