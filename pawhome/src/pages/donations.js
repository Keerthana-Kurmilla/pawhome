import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IndianRupee, Heart, TrendingUp, Users, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

const PRESET_AMOUNTS = [
  { value: 100, label: '₹100', impact: 'Feeds a pet for 3 days', emoji: '🍖', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { value: 500, label: '₹500', impact: 'Covers a vet checkup', emoji: '🏥', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 1000, label: '₹1,000', impact: 'Shelter for a month', emoji: '🏠', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 5000, label: '₹5,000', impact: 'Full rescue & rehab', emoji: '⭐', color: 'bg-purple-50 border-purple-200 text-purple-700' },
];

const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { value: 'wallet', label: 'Wallet', icon: '👛' },
];

export default function Donations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1); // 1=amount, 2=details, 3=success
  const [processing, setProcessing] = useState(false);

  const { data: allDonations = [] } = useQuery({
    queryKey: ['all-donations-public'],
    queryFn: () => base44.entities.Donation.list('-created_date', 200),
  });

  const { data: myDonations = [] } = useQuery({
    queryKey: ['my-donations'],
    queryFn: () => base44.entities.Donation.list('-created_date', 50),
  });

  const stats = useMemo(() => {
    const total = allDonations.reduce((s, d) => s + (d.amount || 0), 0);
    const count = allDonations.length;
    const avg = count > 0 ? Math.round(total / count) : 0;
    return { total, count, avg };
  }, [allDonations]);

  const createDonation = useMutation({
    mutationFn: async (data) => base44.entities.Donation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-donations-public'] });
      queryClient.invalidateQueries({ queryKey: ['my-donations'] });
    },
  });

  const finalAmount = selectedAmount || parseInt(customAmount) || 0;
  const impactTier = PRESET_AMOUNTS.find(p => p.value === finalAmount);

  const openModal = () => { setStep(1); setShowModal(true); };

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1) {
      toast({ title: 'Please select or enter an amount', variant: 'destructive' });
      return;
    }
    if (step === 1) { setStep(2); return; }
    if (!donorName || !donorEmail) {
      toast({ title: 'Please fill your name and email', variant: 'destructive' });
      return;
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800)); // simulate payment
    await createDonation.mutateAsync({
      donor_name: donorName,
      donor_email: donorEmail,
      amount: finalAmount,
      payment_method: paymentMethod,
      impact_tier: impactTier?.impact || `₹${finalAmount} donation`,
      message,
      status: 'completed',
      currency: 'INR',
    });
    setProcessing(false);
    setStep(3);
  };

  const resetModal = () => {
    setShowModal(false);
    setStep(1);
    setSelectedAmount(null);
    setCustomAmount('');
    setPaymentMethod('upi');
    setDonorName('');
    setDonorEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-heading text-4xl font-bold text-foreground">Make a Difference</h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
          Every rupee you donate helps rescue, rehabilitate, and rehome animals in need.
        </p>
        <Button size="lg" className="mt-6 rounded-full px-10 text-base gap-2 shadow-lg" onClick={openModal}>
          <Heart className="w-5 h-5" /> Donate Now
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { icon: IndianRupee, label: 'Total Donations', value: `₹${stats.total.toLocaleString('en-IN')}`, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Users, label: 'Donations Made', value: stats.count.toString(), color: 'text-accent', bg: 'bg-accent/10' },
          { icon: TrendingUp, label: 'Average Donation', value: `₹${stats.avg.toLocaleString('en-IN')}`, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="text-center border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={`w-14 h-14 mx-auto rounded-2xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-7 h-7 ${s.color}`} />
                </div>
                <p className={`text-3xl font-heading font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Impact tiers */}
      <div className="mb-10">
        <h2 className="font-heading text-2xl font-bold text-center mb-6">Your Donation Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_AMOUNTS.map((tier, i) => (
            <motion.div key={tier.value} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={`border-2 cursor-pointer hover:shadow-lg transition-all text-center ${tier.color}`} onClick={() => { setSelectedAmount(tier.value); openModal(); }}>
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{tier.emoji}</div>
                  <p className="font-heading text-2xl font-bold">{tier.label}</p>
                  <p className="text-sm mt-2 font-medium">{tier.impact}</p>
                  <Button size="sm" className="mt-4 rounded-full w-full" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedAmount(tier.value); openModal(); }}>
                    Donate {tier.label}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent donations */}
      {myDonations.length > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold mb-4">My Donations</h2>
          <div className="space-y-3">
            {myDonations.slice(0, 5).map(d => (
              <Card key={d.id} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{d.impact_tier}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{d.payment_method} · {d.created_date ? new Date(d.created_date).toLocaleDateString('en-IN') : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-primary">₹{d.amount?.toLocaleString('en-IN')}</p>
                    <Badge variant="secondary" className="text-xs mt-1 bg-green-50 text-green-700 border-green-200">✓ {d.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Donate Modal */}
      <Dialog open={showModal} onOpenChange={(v) => { if (!v) resetModal(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {step === 3 ? '🎉 Thank You!' : step === 2 ? 'Your Details' : 'Choose Amount'}
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_AMOUNTS.map(tier => (
                    <button
                      key={tier.value}
                      onClick={() => { setSelectedAmount(tier.value); setCustomAmount(''); }}
                      className={`rounded-xl border-2 p-3 text-left transition-all ${selectedAmount === tier.value ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/40'}`}
                    >
                      <span className="text-2xl">{tier.emoji}</span>
                      <p className="font-heading font-bold text-sm mt-1">{tier.label}</p>
                      <p className="text-xs text-muted-foreground">{tier.impact}</p>
                    </button>
                  ))}
                </div>
                <div>
                  <Label className="text-sm mb-1 block">Custom Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map(m => (
                      <button
                        key={m.value}
                        onClick={() => setPaymentMethod(m.value)}
                        className={`rounded-xl border-2 p-2.5 flex items-center gap-2 text-sm font-medium transition-all ${paymentMethod === m.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                      >
                        <span>{m.icon}</span> {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                {finalAmount > 0 && (
                  <div className="bg-secondary/50 rounded-xl p-3 text-sm text-center font-medium">
                    Donating <span className="text-primary font-bold">₹{finalAmount.toLocaleString('en-IN')}</span>
                    {impactTier && <> · {impactTier.emoji} {impactTier.impact}</>}
                  </div>
                )}
                <Button className="w-full rounded-full" onClick={handleDonate} disabled={finalAmount < 1}>
                  Continue →
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="bg-secondary/50 rounded-xl p-3 text-sm text-center font-medium mb-2">
                  <span className="text-primary font-bold text-lg">₹{finalAmount.toLocaleString('en-IN')}</span> via <span className="capitalize">{paymentMethod}</span>
                  {impactTier && <p className="text-muted-foreground text-xs mt-0.5">{impactTier.emoji} {impactTier.impact}</p>}
                </div>
                <div>
                  <Label>Your Name *</Label>
                  <Input value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Full name" className="rounded-xl" />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} placeholder="your@email.com" className="rounded-xl" />
                </div>
                <div>
                  <Label>Message (optional)</Label>
                  <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="A note for the animals..." rows={2} className="rounded-xl" />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-full" onClick={() => setStep(1)}>← Back</Button>
                  <Button className="flex-1 rounded-full" onClick={handleDonate} disabled={processing}>
                    {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</> : `Pay ₹${finalAmount.toLocaleString('en-IN')}`}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-lg font-heading font-bold">Donation Successful!</p>
                <p className="text-muted-foreground text-sm">
                  Thank you, <span className="font-semibold text-foreground">{donorName}</span>! Your ₹{finalAmount.toLocaleString('en-IN')} donation will
                  {impactTier ? ` ${impactTier.impact.toLowerCase()}` : ' help animals in need'}.
                </p>
                <p className="text-xs text-muted-foreground">A confirmation will be sent to {donorEmail}</p>
                <Button className="rounded-full w-full" onClick={resetModal}>Done</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}