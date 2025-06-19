import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for auctions
    const mockAuctions = [
      {
        id: "1",
        title: "Rare Vintage Watch Collection",
        description: "Collection of 5 vintage watches from the 1960s-1980s. All in working condition.",
        type: "forward",
        startingPrice: 500,
        reservePrice: 800,
        buyNowPrice: 1200,
        currency: "USD-CRED",
        duration: 7,
        images: ["/placeholder.svg?height=200&width=300&text=Vintage+Watches"],
        location: "San Francisco, CA",
        status: "active",
        bidsVisible: true,
        createdAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        title: "Website Development Project",
        description: "Need a professional website for my small business. Looking for competitive bids.",
        type: "reverse",
        startingPrice: 2000,
        reservePrice: null,
        buyNowPrice: null,
        currency: "USD-CRED",
        duration: 5,
        images: ["/placeholder.svg?height=200&width=300&text=Website+Development"],
        location: "Remote",
        status: "active",
        bidsVisible: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        title: "Art Painting - Original Oil on Canvas",
        description: "Beautiful landscape painting by local artist. Perfect for home or office.",
        type: "forward",
        startingPrice: 150,
        reservePrice: 200,
        buyNowPrice: 350,
        currency: "USD-CRED",
        duration: 3,
        images: ["/placeholder.svg?height=200&width=300&text=Oil+Painting"],
        location: "Austin, TX",
        status: "active",
        bidsVisible: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        endsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    return NextResponse.json({
      auctions: mockAuctions,
    })
  } catch (error) {
    console.error("Failed to fetch auctions:", error)
    return NextResponse.json({ auctions: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auctionData = await request.json()

    // Simulate creating auction
    const newAuction = {
      id: `auction-${Date.now()}`,
      ...auctionData,
      status: "active",
      createdAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + auctionData.duration * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json({ success: true, auction: newAuction })
  } catch (error) {
    console.error("Failed to create auction:", error)
    return NextResponse.json({ error: "Failed to create auction" }, { status: 500 })
  }
}
