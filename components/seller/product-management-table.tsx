"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Eye, Trash2, Star } from "lucide-react"

interface Product {
  id: string
  title: string
  price: number
  currency: string
  category: string
  status: string
  stock: number
  views: number
  sales: number
  rating: number
  createdAt: string
}

interface ProductManagementTableProps {
  products: Product[]
  onProductUpdate: () => void
}

export function ProductManagementTable({ products, onProductUpdate }: ProductManagementTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (stock < 5) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock)
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images?.[0] || "/placeholder.svg?height=40&width=40"}
                      alt={product.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {product.price.toFixed(2)} {product.currency}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.stock}</p>
                    <Badge className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Eye className="h-3 w-3" />
                      <span>{product.views}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span>{product.sales} sales</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
