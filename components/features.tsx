import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, ShoppingBag, Gavel, Wallet, Globe, TrendingUp, Shield, Users, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Coins,
    title: "CRED Currency System",
    description: "Our stable currency backed by 180+ global currencies with real-time conversion rates.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: ShoppingBag,
    title: "Global Marketplace",
    description: "Buy and sell products worldwide with integrated currency conversion and secure payments.",
    color: "text-green-600 dark:text-green-400",
  },
  {
    icon: Gavel,
    title: "Auction Platform",
    description: "Participate in forward and reverse auctions with transparent bidding and automatic settlements.",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Wallet,
    title: "Multi-Currency Wallet",
    description: "Store, send, and receive any of our 180+ supported currencies with instant conversion.",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with users worldwide and trade in their local currencies seamlessly.",
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Rates",
    description: "Live currency exchange rates updated continuously for accurate pricing.",
    color: "text-red-600 dark:text-red-400",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Bank-level security with encrypted transactions and fraud protection.",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join a growing community of global traders and marketplace participants.",
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: BarChart3,
    title: "Public Ledger",
    description: "Complete transparency with our public transaction ledger and audit trail.",
    color: "text-yellow-600 dark:text-yellow-400",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for Global Trading
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive tools and features designed to make international trading simple, secure, and profitable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
