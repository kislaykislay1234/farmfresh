import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Plus, 
  Check, 
  X, 
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { PaymentModal } from '../../components/common/PaymentModal'
import toast, { Toaster } from 'react-hot-toast'

export const MarketplacePage = () => {
  const { t } = useLanguage()
  const { role, profile } = useAuth()
  const [products, setProducts] = useState(() => farmFreshStore.getProducts())
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [grade, setGrade] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProductForOrder, setSelectedProductForOrder] = useState(null)
  const [orderQty, setOrderQty] = useState(100)

  // Form State for Adding Product
  const [formData, setFormData] = useState({
    crop_name: '',
    category: 'Vegetables',
    variety: '',
    grade: 'A+',
    quantity_kg: '',
    price_per_kg: '',
    location: profile?.district ? `${profile.district}, ${profile.state}` : 'Anand, Gujarat',
    shelf_life_days: 10,
    freshness_score: 95,
    is_organic: false,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    description: '',
  })

  const categories = [
    { key: 'All', label: t('allCategories') },
    { key: 'Vegetables', label: t('vegetables') },
    { key: 'Fruits', label: t('fruits') },
    { key: 'Grains', label: t('grains') },
    { key: 'Spices', label: t('spices') },
    { key: 'Organic', label: t('certifiedOrganic') },
  ]

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'All' ? true : (category === 'Organic' ? p.is_organic : p.category === category)
    const matchesGrade = grade === 'All' ? true : p.grade === grade
    return matchesSearch && matchesCategory && matchesGrade
  })

  const handleCreateProduct = (e) => {
    e.preventDefault()
    if (!formData.crop_name || !formData.quantity_kg || !formData.price_per_kg) {
      toast.error('Please fill in crop name, quantity, and price')
      return
    }

    const created = farmFreshStore.addProduct({
      ...formData,
      farmer_name: profile?.full_name || 'Ramesh Patel',
      farmer_phone: profile?.phone || '+91 98251 44520',
      quantity_kg: Number(formData.quantity_kg),
      price_per_kg: Number(formData.price_per_kg),
      mandi_benchmark_price: Number(formData.price_per_kg) * 0.92,
      harvest_date: new Date().toISOString().split('T')[0],
    })

    setProducts(farmFreshStore.getProducts())
    setShowAddModal(false)
    toast.success(`Produce "${created.crop_name}" listed successfully!`)
  }

  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!selectedProductForOrder) return
    setIsPaymentOpen(true)
  }

  const handlePaymentSuccess = (paymentResult) => {
    const total = Number(orderQty) * selectedProductForOrder.price_per_kg
    const newOrder = farmFreshStore.createOrder({
      buyer_name: profile?.full_name || 'Priya Sharma (Retail Buyer)',
      buyer_phone: profile?.phone || '+91 94290 12890',
      farmer_name: selectedProductForOrder.farmer_name,
      farmer_phone: selectedProductForOrder.farmer_phone,
      crop_name: selectedProductForOrder.crop_name,
      quantity_kg: Number(orderQty),
      price_per_kg: selectedProductForOrder.price_per_kg,
      total_amount: total,
      farmer_payout: total * 0.97,
      platform_fee: total * 0.03,
      delivery_address: 'Central Distribution Hub, Mumbai APMC Sector 19',
    })

    setSelectedProductForOrder(null)
    setIsPaymentOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">
            {t('marketplaceTitle')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('marketplaceSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-farm text-xs py-2.5 px-4 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{t('listCrop')}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchProducePlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-farm pl-10"
            />
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{t('qualityGradeLbl')}:</span>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="input-farm py-2 text-xs w-auto cursor-pointer"
            >
              <option value="All">{t('all')}</option>
              <option value="A+">{t('gradeAPlus')}</option>
              <option value="A">{t('gradeA')}</option>
              <option value="B">{t('gradeB')}</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
                category === cat.key
                  ? 'bg-farm-700 text-white shadow-xs font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="glass-card overflow-hidden rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-200"
          >
            {/* Image & Badges */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={product.crop_name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="glass-badge bg-white/90 text-farm-800 border-farm-200">
                  Grade {product.grade}
                </span>
                {product.is_organic && (
                  <span className="glass-badge bg-emerald-600 text-white border-emerald-500">
                    {t('certifiedOrganic')}
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 right-3">
                <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-harvest-400" />
                  <span>{product.freshness_score}% {t('navFreshness')}</span>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-gray-900 leading-tight">
                    {product.crop_name}
                  </h3>
                  <div className="font-mono font-bold text-lg text-farm-700 whitespace-nowrap">
                    ₹{product.price_per_kg}<span className="text-xs text-gray-500 font-normal">{t('perKg')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{product.location}</span>
                </div>
              </div>

              {/* Farmer & Mandi Info */}
              <div className="pt-2 border-t border-gray-100 text-xs space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <span>{t('availableQty')}:</span>
                  <span className="font-semibold text-gray-900">{product.available_kg} {t('kg')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('mandiBenchmark')}:</span>
                  <span className="text-harvest-700 font-medium">₹{product.mandi_benchmark_price || (product.price_per_kg * 0.95).toFixed(1)}{t('perKg')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('shelfLife')}:</span>
                  <span className="text-gray-900">{product.shelf_life_days} {t('days')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedProductForOrder(product)}
                className="w-full btn-farm text-xs py-2.5 mt-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('buyNow')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">{t('noNotifications')}</p>
        </div>
      )}

      {/* MODAL: ADD PRODUCE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-gray-900">{t('modalListCropTitle')}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('cropNameInput')} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hybrid Tomato (Himsona)"
                  value={formData.crop_name}
                  onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                  className="input-farm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('categorySelect')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-farm"
                  >
                    <option value="Vegetables">{t('vegetables')}</option>
                    <option value="Fruits">{t('fruits')}</option>
                    <option value="Grains">{t('grains')}</option>
                    <option value="Spices">{t('spices')}</option>
                    <option value="Pulses">{t('pulses')}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('qualityGradeLbl')}</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="input-farm"
                  >
                    <option value="A+">{t('gradeAPlus')}</option>
                    <option value="A">{t('gradeA')}</option>
                    <option value="B">{t('gradeB')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('quantityInput')} *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2000"
                    value={formData.quantity_kg}
                    onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                    className="input-farm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('pricePerUnitInput')} *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="e.g. 28.00"
                    value={formData.price_per_kg}
                    onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                    className="input-farm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('farmLocationInput')}</label>
                <input
                  type="text"
                  placeholder="e.g. Anand, Gujarat"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-farm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organicCheck"
                  checked={formData.is_organic}
                  onChange={(e) => setFormData({ ...formData, is_organic: e.target.checked })}
                  className="rounded text-farm-600 focus:ring-farm-500"
                />
                <label htmlFor="organicCheck" className="text-gray-700 font-medium">
                  {t('isOrganicCheckbox')}
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  {t('cancel')}
                </button>
                <button type="submit" className="btn-farm text-xs py-2 px-5">
                  {t('submitListingBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BUY PRODUCE VIA ESCROW */}
      {selectedProductForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">{t('paymentModalTitle')}</h3>
              <button onClick={() => setSelectedProductForOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-farm-50 p-3 rounded-xl border border-farm-200 text-farm-900">
                <div className="font-bold">{selectedProductForOrder.crop_name}</div>
                <div className="text-[11px] text-farm-700">{t('sellerNameLbl')}: {selectedProductForOrder.farmer_name} ({selectedProductForOrder.location})</div>
                <div className="font-mono mt-1">{t('price')}: ₹{selectedProductForOrder.price_per_kg}{t('perKg')}</div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('quantity')} ({t('kg')}):</label>
                <input
                  type="number"
                  min="10"
                  max={selectedProductForOrder.available_kg}
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  className="input-farm"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-xl space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-gray-600">
                  <span>{t('produceCost')}:</span>
                  <span>₹{(Number(orderQty) * selectedProductForOrder.price_per_kg).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('platformFee')} (3%):</span>
                  <span>₹{(Number(orderQty) * selectedProductForOrder.price_per_kg * 0.03).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1 text-xs">
                  <span>{t('payableTotal')}:</span>
                  <span className="text-farm-800">₹{(Number(orderQty) * selectedProductForOrder.price_per_kg * 1.03).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-farm-600 shrink-0" />
                <span>{t('paymentModalSubtitle')}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductForOrder(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  {t('cancel')}
                </button>
                <button onClick={handlePlaceOrder} className="btn-farm text-xs py-2 px-5 font-bold">
                  {t('paySecurelyBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT GATEWAY MODAL */}
      {selectedProductForOrder && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          amount={Number(orderQty) * selectedProductForOrder.price_per_kg * 1.03}
          purpose={`${t('buyNow')}: ${selectedProductForOrder.crop_name} (${orderQty} kg)`}
          relatedType="order"
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
