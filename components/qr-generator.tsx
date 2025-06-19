"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WORLD_CURRENCIES } from "@/lib/currencies"
import { QrCode, Download } from "lucide-react"

export function QRGenerator() {
  const [qrData, setQrData] = useState({
    currency: "USD-CRED",
    amount: "",
    recipient: "",
    message: "",
    customData: "",
  })

  const generateQRCode = () => {
    const qrContent = {
      type: "CRED_PAYMENT",
      currency: qrData.currency,
      amount: Number.parseFloat(qrData.amount) || 0,
      recipient: qrData.recipient,
      message: qrData.message,
      customData: qrData.customData,
      timestamp: new Date().toISOString(),
    }

    // In a real implementation, you'd use a QR code library here
    const qrString = JSON.stringify(qrContent)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}`

    return qrUrl
  }

  const downloadQR = () => {
    const qrUrl = generateQRCode()
    const link = document.createElement("a")
    link.href = qrUrl
    link.download = `${qrData.currency}-QR-${Date.now()}.png`
    link.click()
  }

  return (
    <section className="mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Generator
          </CardTitle>
          <p className="text-muted-foreground">Generate custom QR codes for CRED payments and transactions</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={qrData.currency} onValueChange={(value) => setQrData({ ...qrData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORLD_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={`${currency.code}-CRED`}>
                        {currency.emoji} {currency.code}-CRED
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={qrData.amount}
                  onChange={(e) => setQrData({ ...qrData, amount: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="recipient">Recipient (Optional)</Label>
                <Input
                  id="recipient"
                  placeholder="Email or wallet address"
                  value={qrData.recipient}
                  onChange={(e) => setQrData({ ...qrData, recipient: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Input
                  id="message"
                  placeholder="Payment description"
                  value={qrData.message}
                  onChange={(e) => setQrData({ ...qrData, message: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="customData">Custom Data (Optional)</Label>
                <Textarea
                  id="customData"
                  placeholder="Any additional data you want to include"
                  value={qrData.customData}
                  onChange={(e) => setQrData({ ...qrData, customData: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="mb-4">
                <img
                  src={generateQRCode() || "/placeholder.svg"}
                  alt="Generated QR Code"
                  className="border rounded-lg"
                  width={300}
                  height={300}
                />
              </div>
              <Button onClick={downloadQR} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
