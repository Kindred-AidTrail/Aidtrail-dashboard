import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-md p-6 bg-slate-900 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="emerald" size="sm">Solvency Verified</Badge>
          <span className="text-xs font-mono text-slate-400">Prog #1</span>
        </div>
        <CardTitle className="text-lg">Clean Water & Borehole Initiative</CardTitle>
        <CardDescription className="text-xs">
          Funds locked securely in Soroban escrow smart contract.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Escrow Value:</span>
          <span className="font-mono font-bold text-emerald-400">$112,500 USDC</span>
        </div>
        <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
          View Milestones
        </Button>
      </CardContent>
    </Card>
  ),
};
