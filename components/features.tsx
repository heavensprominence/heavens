import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Coins, Users, TrendingUp, Globe } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Coins,
      title: "CRED Currency",
      description:
        "Stable coins pegged to world currencies. Transparent, environmentally friendly minting and burning.",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description:
        "Built with security and transparency at its core. Public ledger shows all transactions in real-time.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant transactions and real-time updates. Experience the fastest financial platform.",
    },
    {
      icon: Users,
      title: "Fair Marketplace",
      description: "Free classifieds and auctions. No hidden fees, just fair trading for everyone.",
    },
    {
      icon: TrendingUp,
      title: "Registration Rewards",
      description: "Early joiners get higher bonuses. The earlier you join, the more CRED you receive.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Support for all world currencies with local CRED variants. Trade globally, think locally.",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Heavenslive?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of finance with our transparent platform designed to help people live better lives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
