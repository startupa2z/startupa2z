import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  ApiError,
  fetchAdminSponsorPayments,
  type SponsorPayment,
  updateSponsorFulfillment,
} from "@/lib/api";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

const paymentBadge = (status: string) => {
  if (status === "paid") return "default" as const;
  if (status.includes("refund") || status === "disputed") return "destructive" as const;
  return "secondary" as const;
};

const SponsorPaymentManagement = () => {
  const [payments, setPayments] = useState<SponsorPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const { data } = await fetchAdminSponsorPayments();
      setPayments(data ?? []);
    } catch (error) {
      toast({
        title: "Could not load sponsorship payments",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const paidTotal = useMemo(
    () => payments.filter((payment) => payment.payment_status === "paid").reduce((sum, payment) => sum + payment.amount_total, 0),
    [payments],
  );
  const pendingFulfillment = payments.filter(
    (payment) => payment.payment_status === "paid" && payment.fulfillment_status !== "fulfilled",
  ).length;

  const changeFulfillment = async (
    payment: SponsorPayment,
    status: SponsorPayment["fulfillment_status"],
  ) => {
    setUpdatingId(payment.id);
    try {
      const { data } = await updateSponsorFulfillment(payment.id, status);
      setPayments((current) => current.map((item) => item.id === data.id ? data : item));
      toast({ title: "Sponsorship status updated" });
    } catch (error) {
      toast({
        title: "Could not update sponsorship",
        description: error instanceof ApiError ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Payments</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{payments.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Paid total</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{money(paidTotal, "usd")}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Needs follow-up</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{pendingFulfillment}</CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Stripe payments are recorded automatically. Fulfillment is managed here.</p>
        <Button variant="outline" size="sm" onClick={loadPayments} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Customer</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Fulfillment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-muted-foreground">
                  <CreditCard className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  {loading ? "Loading payments…" : "No sponsorship payments yet."}
                </TableCell>
              </TableRow>
            ) : payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="font-medium">{payment.customer_name || "Name not provided"}</div>
                  <div className="text-xs text-muted-foreground">{payment.customer_email || "Email not provided"}</div>
                </TableCell>
                <TableCell>
                  <div>{payment.package_name || payment.package_id || "Sponsorship"}</div>
                  {!payment.livemode && <Badge variant="outline" className="mt-1">TEST</Badge>}
                </TableCell>
                <TableCell className="font-medium">
                  {money(payment.amount_total, payment.currency)}
                  {payment.amount_refunded > 0 && <div className="text-xs text-destructive">{money(payment.amount_refunded, payment.currency)} refunded</div>}
                </TableCell>
                <TableCell><Badge variant={paymentBadge(payment.payment_status)}>{payment.payment_status.replaceAll("_", " ")}</Badge></TableCell>
                <TableCell>
                  <select
                    value={payment.fulfillment_status}
                    onChange={(event) => changeFulfillment(payment, event.target.value as SponsorPayment["fulfillment_status"])}
                    disabled={updatingId === payment.id || payment.payment_status !== "paid"}
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-60"
                    aria-label={`Fulfillment status for ${payment.customer_email || payment.id}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="fulfilled">Fulfilled</option>
                  </select>
                  {payment.fulfillment_status === "fulfilled" && <CheckCircle2 className="ml-2 inline h-4 w-4 text-green-600" />}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(payment.paid_at || payment.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SponsorPaymentManagement;
