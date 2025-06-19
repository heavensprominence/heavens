"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"
import { Wallet, Send, ArrowDownUp, History, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WalletPage() {
  const { user, updateCredBalance } = useAuth()
  const { toast } = useToast()
  const [sendAmount, setSendAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      // Load transaction history
      const userTransactions = localStorage.getItem(`transactions_${user.id}`)
      if (userTransactions) {
        setTransactions(JSON.parse(userTransactions))
      }
    }
  }, [user])

  const generateWalletAddress = (userId: string) => {
    return `HL${userId.slice(0, 8).toUpperCase()}${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  }

  const handleSendCred = () => {
    if (!user || !sendAmount || !recipientAddress) return

    const amount = Number.parseFloat(sendAmount)
    if (amount <= 0 || amount > user.credBalance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount within your balance.",
        variant: "destructive",
      })
      return
    }

    // Create transaction
    const transaction = {
      id: Date.now().toString(),
      type: "send",
      amount: amount,
      recipient: recipientAddress,
      timestamp: new Date().toISOString(),
      status: "completed",
    }

    // Update balance
    const newBalance = user.credBalance - amount
    updateCredBalance(newBalance)

    // Save transaction
    const updatedTransactions = [transaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions))

    // Add to public ledger
    const publicLedger = JSON.parse(localStorage.getItem("public_ledger") || "[]")
    publicLedger.unshift({
      id: transaction.id,
      from: user.name,
      to: recipientAddress,
      amount: amount,
      timestamp: transaction.timestamp,
      type: "transfer",
    })
    localStorage.setItem("public_ledger", JSON.stringify(publicLedger.slice(0, 100))) // Keep last 100

    toast({
      title: "Transaction Sent",
      description: `Successfully sent ₡${amount} CRED to ${recipientAddress}`,
    })

    setSendAmount("")
    setRecipientAddress("")
  }

  const copyAddress = () => {
    if (user) {
      const address = generateWalletAddress(user.id)
      navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Your wallet address has been copied to clipboard",
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Please sign in to access your wallet</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Wallet</h1>
          <p className="text-gray-400">Manage your CRED and transactions</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-yellow-500" />
                CRED Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-500 mb-2">₡{user.credBalance.toLocaleString()}</div>
              <p className="text-gray-400">≈ ${(user.credBalance * 0.001).toFixed(2)} USD</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Wallet Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-700 px-3 py-2 rounded text-yellow-500 flex-1 text-sm">
                  {generateWalletAddress(user.id)}
                </code>
                <Button size="sm" onClick={copyAddress} className="bg-gray-700 hover:bg-gray-600">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Share this address to receive CRED</p>
            </CardContent>
          </Card>
        </div>

        {/* Send CRED */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Send className="mr-2 h-5 w-5 text-blue-500" />
              Send CRED
            </CardTitle>
            <CardDescription className="text-gray-400">Transfer CRED to another wallet address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-gray-300">
                  Recipient Address
                </Label>
                <Input
                  id="recipient"
                  placeholder="Enter wallet address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">
                  Amount (CRED)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <Button
              onClick={handleSendCred}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!sendAmount || !recipientAddress}
            >
              Send CRED
            </Button>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <History className="mr-2 h-5 w-5 text-green-500" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${tx.type === "send" ? "bg-red-500/20" : "bg-green-500/20"}`}
                      >
                        {tx.type === "send" ? (
                          <Send className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowDownUp className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {tx.type === "send" ? "Sent to" : "Received from"} {tx.recipient || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${tx.type === "send" ? "text-red-500" : "text-green-500"}`}>
                        {tx.type === "send" ? "-" : "+"}₡{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions yet. Start sending or receiving CRED!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
