import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Tag,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  ShieldCheck,
  Utensils,
  Sparkles,
  Layers,
  Droplets,
  ArrowRight,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'
import { useFinance } from '../hooks/useFinance'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { ProductPriceModal } from '../components/finance/ProductPriceModal'
import { AddProductModal } from '../components/finance/AddProductModal'

export function ProductsPrices() {
  const toast = useToast()
  const {
    products,
    sales,
    deleteProduct,
    closings,
  } = useFinance()

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Calculate stats for each product
  const productStats = useMemo(() => {
    return products.map((p) => {
      const pSales = sales.filter((s) => s.productId === p.id || s.productName === p.productName)
      const totalSold = pSales.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0)
      const totalRevenue = pSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0)
      const margin = (Number(p.sellingPrice) || 0) - (Number(p.costPrice) || 0)
      const marginPct =
        Number(p.sellingPrice) > 0 ? Math.round((margin / Number(p.sellingPrice)) * 100) : 0

      return {
        ...p,
        totalSold,
        totalRevenue,
        margin,
        marginPct,
      }
    })
  }, [products, sales])

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      deleteProduct(id)
      toast.info('Product Removed', `"${name}" removed from the catalog.`)
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <PageHeader
        title="PRODUCTS & PRICE MANAGEMENT"
        description="Event menu catalog and price controls. Edit dish selling prices with day scope protection (Current Day, Future Days, or All 3 Days)."
        badge="Pricing Engine"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add New Dish / Product
            </Button>
            <Link to="/sales">
              <Button variant="outline" size="sm">
                Sales Ledger
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Scope Info Banner */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <strong className="block font-bold">Historical Audit & Scope Protection</strong>
          <p>
            When updating dish prices, you can choose whether the new price applies only to the current day,
            upcoming future days, or all 3 days. Any days that are already locked and closed will NEVER have
            their historical revenues altered.
          </p>
        </div>
      </div>

      {/* 3. Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {productStats.map((prod) => (
          <Card
            key={prod.id}
            className={`border transition-all flex flex-col justify-between ${
              prod.productName.includes('Biryani')
                ? 'border-[#163324]/40 hover:border-[#163324]'
                : prod.productName.includes('Popcorn')
                ? 'border-amber-400 hover:border-amber-600'
                : prod.productName.includes('Water')
                ? 'border-sky-400 hover:border-sky-600'
                : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
            }`}
          >
            <div>
              {/* Card Top */}
              <div className="p-4 border-b border-[#f1f5f9] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
                      {prod.category}
                    </span>
                    <Badge variant={prod.status === 'Active' ? 'success' : 'neutral'} size="xs">
                      {prod.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-black text-[#0f172a] mt-1.5">{prod.productName}</h3>
                  <p className="text-xs text-[#64748b] mt-0.5">{prod.unit}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#64748b] block">Selling Price</span>
                  <span className="text-2xl font-black text-[#163324] font-mono">
                    ₹{prod.sellingPrice}
                  </span>
                </div>
              </div>

              {/* Card Middle: Economics */}
              <div className="p-4 space-y-2.5 text-xs text-[#475569]">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="text-[10px] uppercase font-bold text-[#64748b] block">Cost Price</span>
                    <span className="text-sm font-bold text-[#0f172a] font-mono">
                      ₹{prod.costPrice}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Unit Margin</span>
                    <span className="text-sm font-black text-emerald-700 font-mono">
                      ₹{prod.margin} ({prod.marginPct}%)
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
                  <div className="flex justify-between">
                    <span>3-Day Total Sold:</span>
                    <strong className="font-mono text-[#0f172a]">
                      {formatNumber(prod.totalSold)} {prod.unit}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Generated Revenue:</span>
                    <strong className="font-mono text-[#163324] font-bold">
                      {formatCurrency(prod.totalRevenue)}
                    </strong>
                  </div>
                </div>

                {prod.notes && (
                  <p className="text-[11px] text-[#64748b] italic line-clamp-2">
                    "{prod.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Card Footer: Actions */}
            <div className="p-3.5 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingProduct(prod)
                  setIsPriceModalOpen(true)
                }}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Price
              </Button>

              {!['prod-01', 'prod-02', 'prod-06'].includes(prod.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(prod.id, prod.productName)}
                  className="text-red-600 hover:text-red-700"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* 4. MODALS */}
      {/* Product Price Modal */}
      <ProductPriceModal
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false)
          setEditingProduct(null)
        }}
        product={editingProduct}
        currentDayNumber={selectedDayNumber}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}
export default ProductsPrices

