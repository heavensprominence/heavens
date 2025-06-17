import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, ShoppingBag, Gavel, HandHeart, Shield, Globe, Zap, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-black">
        <div className="container mx-auto text-center max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">Welcome to Heavenslive</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            The world's most transparent financial platform featuring CRED cryptocurrency, global marketplace, and
            interest-free financial assistance.
          </p>

          {/* Registration Bonus Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md mx-auto mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Coins className="h-6 w-6 text-white" />
              <h3 className="text-xl font-semibold text-white">Registration Bonus</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-4xl font-bold text-white mb-2">10,000 CRED</div>
                <div className="text-gray-400">Bonus for next registration</div>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Users className="h-4 w-4" />
                <span>Limited spots available</span>
              </div>

              <div className="text-sm bg-gray-800 px-4 py-2 rounded-full text-gray-300">First Come, First Served</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold">
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-900 px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">Platform Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Coins className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-4">CRED Currency</CardTitle>
                <CardDescription className="text-gray-400 leading-relaxed">
                  Fully transparent, environmentally friendly cryptocurrency with global parity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  Start Trading
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-4">Global Marketplace</CardTitle>
                <CardDescription className="text-gray-400 leading-relaxed">
                  Buy and sell goods and services worldwide with built-in escrow protection
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  Browse Listings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Gavel className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-4">Auction System</CardTitle>
                <CardDescription className="text-gray-400 leading-relaxed">
                  Forward and reverse auctions for competitive pricing and service procurement
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  View Auctions
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <HandHeart className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-4">Financial Assistance</CardTitle>
                <CardDescription className="text-gray-400 leading-relaxed">
                  Grants, interest-free loans, and competitive lending with transparent approval
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Heavenslive Section */}
      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">Why Choose Heavenslive?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <Shield className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Fully Transparent</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Every transaction is recorded on our public ledger. No hidden fees, no surprises.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <Globe className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Global Reach</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Trade with anyone, anywhere. Multi-currency support with real-time parity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <Zap className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Instant transactions, real-time updates, and immediate confirmations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Transaction Ledger Section */}
      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Public Transaction Ledger</h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-4xl mx-auto">
              Complete transparency - view all platform transactions in real-time. Privacy is maintained while ensuring
              full accountability.
            </p>
          </div>

          <Card className="bg-gray-900 border-gray-800 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No transactions yet. Be the first to join and receive your registration bonus!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Join thousands of users already benefiting from our transparent financial platform
          </p>
          <Button size="lg" className="bg-gray-800 text-white hover:bg-gray-700 px-12 py-4 text-xl font-semibold">
            Create Your Free Account
          </Button>
        </div>
      </section>
    </div>
  )
}
