import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Heavenslive</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The world's most transparent financial platform with CRED currency and fair marketplace.
            </p>
            <p className="text-xs text-muted-foreground">
              Mission: Helping people live better lives through transparent finance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/currencies" className="text-muted-foreground hover:text-foreground">
                  CRED Currency
                </Link>
              </li>
              <li>
                <Link href="/trading" className="text-muted-foreground hover:text-foreground">
                  Trading
                </Link>
              </li>
              <li>
                <Link href="/classifieds" className="text-muted-foreground hover:text-foreground">
                  Classifieds
                </Link>
              </li>
              <li>
                <Link href="/auctions" className="text-muted-foreground hover:text-foreground">
                  Auctions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-muted-foreground hover:text-foreground">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="text-muted-foreground hover:text-foreground">
                  Transparency Report
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Heavenslive. All rights reserved. Built with ❤️ to help people live better lives.</p>
        </div>
      </div>
    </footer>
  )
}
