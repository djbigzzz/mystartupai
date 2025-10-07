import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  Search,
  RefreshCw,
  Zap,
  Shield
} from "lucide-react";
import { SiSolana } from "react-icons/si";

export default function GatewayMonitor() {
  const { toast } = useToast();
  const [searchSignature, setSearchSignature] = useState("");
  const [lookupSignature, setLookupSignature] = useState<string | null>(null);

  // Check Gateway status
  const { data: gatewayStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/gateway/status"],
  });

  // Get recent transactions
  const { data: transactionsData, isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ["/api/gateway/transactions"],
  });

  // Get specific transaction details
  const { data: transactionDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["/api/gateway/transaction", lookupSignature],
    queryFn: async () => {
      if (!lookupSignature) return null;
      const response = await fetch(`/api/gateway/transaction/${lookupSignature}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      return response.json();
    },
    enabled: !!lookupSignature,
  });

  const handleSearch = () => {
    if (searchSignature.length < 32) {
      toast({
        title: "Invalid Signature",
        description: "Please enter a valid transaction signature (at least 32 characters)",
        variant: "destructive",
      });
      return;
    }
    setLookupSignature(searchSignature);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const shortenSignature = (sig: string) => {
    if (!sig || sig.length < 16) return sig;
    return `${sig.slice(0, 8)}...${sig.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-purple-400" />
                Sanctum Gateway Monitor
              </h1>
              <p className="text-gray-300">
                Real-time transaction monitoring and observability powered by Sanctum Gateway
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SiSolana className="w-8 h-8 text-purple-400" />
              {gatewayStatus?.configured && (
                <Badge className="bg-green-500">
                  <Zap className="w-3 h-3 mr-1" />
                  Gateway Active
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Gateway Status Card */}
        <Card className="mb-6 bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Gateway Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configuration and network information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="text-gray-400">Loading status...</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Status</div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    {gatewayStatus?.configured ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Configured
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        Not Configured
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Network</div>
                  <div className="text-white font-semibold uppercase">
                    {gatewayStatus?.network || 'Unknown'}
                  </div>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Message</div>
                  <div className="text-white text-sm">
                    {gatewayStatus?.message || 'Checking...'}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Search */}
        <Card className="mb-6 bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-400" />
              Transaction Lookup
            </CardTitle>
            <CardDescription className="text-gray-400">
              Search for any Solana transaction by signature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                data-testid="input-transaction-signature"
                placeholder="Enter transaction signature..."
                value={searchSignature}
                onChange={(e) => setSearchSignature(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                data-testid="button-search-transaction"
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {detailsLoading && lookupSignature && (
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg text-gray-400">
                Looking up transaction...
              </div>
            )}

            {transactionDetails && lookupSignature && (
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">Transaction Found</span>
                  <a
                    href={`https://explorer.solana.com/tx/${lookupSignature}?cluster=${gatewayStatus?.network}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm"
                  >
                    View on Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Signature: </span>
                    <span className="text-white font-mono">{shortenSignature(lookupSignature)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status: </span>
                    {getStatusBadge(transactionDetails.status?.value?.confirmationStatus || 'unknown')}
                  </div>
                  <div>
                    <span className="text-gray-400">Via: </span>
                    <Badge className="bg-purple-600">{transactionDetails.via}</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your recent Solana payments via Gateway
                </CardDescription>
              </div>
              <Button
                data-testid="button-refresh-transactions"
                onClick={() => refetchTransactions()}
                variant="outline"
                size="sm"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="text-gray-400">Loading transactions...</div>
            ) : !transactionsData?.transactions?.length ? (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Purchase credits to see transactions here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactionsData.transactions.map((tx: any, index: number) => (
                  <div
                    key={tx.signature || index}
                    data-testid={`transaction-${index}`}
                    className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <SiSolana className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-mono text-sm">
                          {shortenSignature(tx.signature)}
                        </span>
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=${gatewayStatus?.network}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      {getStatusBadge(tx.status)}
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Credits: </span>
                        <span className="text-white font-semibold">{tx.amount}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Amount: </span>
                        <span className="text-white">{tx.currency}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Method: </span>
                        <Badge variant="outline" className="text-xs">
                          {tx.paymentMethod?.replace('SOLANA_', '')}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-400">Time: </span>
                        <span className="text-white text-xs">{formatDate(tx.timestamp)}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-gray-400 text-xs">{tx.description}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-purple-900/20 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white mb-1">About Sanctum Gateway</p>
                <p>
                  Sanctum Gateway optimizes and delivers Solana transactions through multiple channels
                  including standard RPCs, Triton Cascade, Paladin, and Jito Bundles. This ensures
                  maximum transaction success rates and provides real-time observability.
                </p>
                <p className="mt-2">
                  <strong>Key Benefits:</strong> Automatic compute unit optimization, dynamic priority fees,
                  multi-channel delivery, and automatic Jito tip refunds if RPC lands first.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
