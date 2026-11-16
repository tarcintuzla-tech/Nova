import React from 'react';
import { Card } from './Card';
import { Heading, Muted } from './Text';

export function EmptyState({ title, body }: { title?: string; body: string }) {
  return (
    <Card>
      {title ? <Heading style={{ fontSize: 16 }}>{title}</Heading> : null}
      <Muted>{body}</Muted>
    </Card>
  );
}
