import {
  INITIAL_PRODUCTS,
  LIVE_AUCTIONS,
  DEMO_ORDERS,
  COLD_STORAGES,
  VEHICLES,
  GOVERNMENT_SCHEMES,
  REAL_MANDI_PRICES,
  DEMAND_INTELLIGENCE
} from './demoData'

const getLocal = (key, fallback) => {
  try {
    const data = localStorage.getItem(`farmfresh_${key}`)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

const setLocal = (key, val) => {
  try {
    localStorage.setItem(`farmfresh_${key}`, JSON.stringify(val))
  } catch (err) {
    console.error('Storage error', err)
  }
}

export const farmFreshStore = {
  getProducts: () => getLocal('products', INITIAL_PRODUCTS),
  
  addProduct: (product) => {
    const current = farmFreshStore.getProducts()
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'available',
      available_kg: Number(product.quantity_kg),
    }
    const updated = [newProduct, ...current]
    setLocal('products', updated)
    return newProduct
  },

  getAuctions: () => getLocal('auctions', LIVE_AUCTIONS),

  placeBid: (auctionId, bidAmount, bidderName = 'You') => {
    const auctions = farmFreshStore.getAuctions()
    const updated = auctions.map((a) => {
      if (a.id === auctionId) {
        return {
          ...a,
          current_highest_bid: Number(bidAmount),
          highest_bidder: bidderName,
          total_bids: (a.total_bids || 0) + 1,
        }
      }
      return a
    })
    setLocal('auctions', updated)
    
    // Add real notification
    farmFreshStore.addNotification({
      title: 'Auction Bid Placed',
      message: `Your bid of ₹${bidAmount}/kg for ${auctions.find(a=>a.id===auctionId)?.crop_name || 'produce'} was registered!`,
      type: 'auction'
    })

    return updated
  },

  getOrders: () => getLocal('orders', DEMO_ORDERS),

  createOrder: (orderData) => {
    const current = farmFreshStore.getOrders()
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now().toString().slice(-6)}`,
      order_number: `FF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      payment_status: 'escrow_hold',
      order_status: 'confirmed',
      created_at: new Date().toISOString(),
      tracking_id: `TRK-FF-${Math.floor(100000 + Math.random() * 900000)}`,
    }
    const updated = [newOrder, ...current]
    setLocal('orders', updated)

    farmFreshStore.addNotification({
      title: 'New Order Confirmed',
      message: `Order #${newOrder.order_number} for ${newOrder.crop_name} confirmed with Escrow Protection!`,
      type: 'order'
    })

    return newOrder
  },

  updateOrderStatus: (orderId, newStatus) => {
    const orders = farmFreshStore.getOrders()
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, order_status: newStatus }
      }
      return o
    })
    setLocal('orders', updated)
    return updated
  },

  getColdStorages: () => getLocal('cold_storages', COLD_STORAGES),

  addStorageBooking: (booking) => {
    const current = getLocal('storage_bookings', [])
    const newBooking = {
      ...booking,
      id: `sb-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    const updated = [newBooking, ...current]
    setLocal('storage_bookings', updated)

    farmFreshStore.addNotification({
      title: 'Cold Storage Reserved',
      message: `Chamber space booked for ${newBooking.crop} (${newBooking.quantity_quintals} Qtl).`,
      type: 'storage'
    })

    return newBooking
  },

  getVehicles: () => getLocal('vehicles', VEHICLES),

  getSchemes: () => GOVERNMENT_SCHEMES,

  getMandiPrices: () => REAL_MANDI_PRICES,

  getDemandIntelligence: () => DEMAND_INTELLIGENCE,

  // Payment Tracking
  getPayments: () => getLocal('payments', []),
  recordPayment: (payment) => {
    const current = farmFreshStore.getPayments()
    const updated = [payment, ...current]
    setLocal('payments', updated)
  },

  // Notifications
  getNotifications: () => getLocal('notifications', [
    { id: 'n1', title: 'Tomato Price Spike Alert', message: 'Anand APMC Tomato rate rose by +8.4% today.', type: 'demand', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'n2', title: 'Escrow Payout Released', message: '₹20,564 released for Order #FF-2026-8901.', type: 'payment', is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'n3', title: 'PM-KISAN 17th Installment', message: '₹2,000 DBT credited to your Aadhaar linked bank.', type: 'scheme', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  ]),

  addNotification: (notif) => {
    const current = farmFreshStore.getNotifications()
    const newNotif = {
      id: `n-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
      ...notif
    }
    setLocal('notifications', [newNotif, ...current])
  },

  markNotificationAsRead: (id) => {
    const current = farmFreshStore.getNotifications()
    const updated = current.map(n => n.id === id ? { ...n, is_read: true } : n)
    setLocal('notifications', updated)
  },

  // Support Tickets
  getSupportTickets: () => getLocal('support_tickets', [
    { id: 't-101', ticket_number: 'TK-89201', category: 'payment', subject: 'Escrow delay confirmation', description: 'Requesting confirmation for weight receipt verification at Vashi APMC.', status: 'in_progress', created_at: '2026-09-07T10:00:00Z', admin_reply: 'Our APMC assaying officer is verifying the electronic weighbridge slip.' }
  ]),

  createSupportTicket: (ticket) => {
    const current = farmFreshStore.getSupportTickets()
    const newTicket = {
      ...ticket,
      id: `t-${Date.now()}`,
      ticket_number: `TK-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'open',
      created_at: new Date().toISOString(),
    }
    const updated = [newTicket, ...current]
    setLocal('support_tickets', updated)
    return newTicket
  },

  // 8-10 Researched Crop Diversification Suggestions (Part 8.1 & Section 4 requirement)
  getCropDiversificationSuggestions: () => [
    { id: 'cd-1', crop: 'Colored Bell Peppers (Red & Yellow)', category: 'Horticulture', profit_increase: '+42%', water_saving: '35%', harvest_period: '65-75 days', demand_level: 'High (HORECA & Supermarkets)', description: 'Polyhouse cultivation yields ₹120-160/kg in nearby urban retail chains.' },
    { id: 'cd-2', crop: 'Dragon Fruit (Pitaya)', category: 'Exotic Fruit', profit_increase: '+65%', water_saving: '60%', harvest_period: 'Perennial (20+ yrs)', demand_level: 'Very High', description: 'Drought-hardy cactus crop requiring minimal water with premium export margins.' },
    { id: 'cd-3', crop: 'Broccoli (Green Magic)', category: 'Exotics', profit_increase: '+38%', water_saving: '25%', harvest_period: '55-60 days', demand_level: 'High (Cloud Kitchens)', description: 'Short duration winter crop fetching ₹50-65/kg compared to regular cabbage.' },
    { id: 'cd-4', crop: 'Button Mushroom (AC Chambers)', category: 'Protected', profit_increase: '+50%', water_saving: '80%', harvest_period: '35-40 days', demand_level: 'Constant High', description: 'Vertical indoor farming using paddy straw compost with year-round harvests.' },
    { id: 'cd-5', crop: 'Chandler Strawberries', category: 'High-Value Fruit', profit_increase: '+55%', water_saving: '30%', harvest_period: '80-90 days', demand_level: 'High Peak Season', description: 'Drip-mulched beds yield 12-15 tonnes per acre with direct resort demand.' },
    { id: 'cd-6', crop: 'Pusa Bold Yellow Mustard', category: 'Oilseeds', profit_increase: '+32%', water_saving: '45%', harvest_period: '105-115 days', demand_level: 'High (Govt MSP & Oil Mills)', description: 'Low irrigation requirement with 42% high oil extraction value.' },
    { id: 'cd-7', crop: 'Baby Corn (G-5414)', category: 'Vegetables', profit_increase: '+30%', water_saving: '20%', harvest_period: '50-55 days', demand_level: 'High (Export & Processing)', description: 'Allows 3 to 4 cropping cycles per year with nutritious green fodder leftover.' },
    { id: 'cd-8', crop: 'Organic Black Chia Seeds', category: 'Superfoods', profit_increase: '+48%', water_saving: '50%', harvest_period: '90-100 days', demand_level: 'High (Nutraceuticals)', description: 'Zero pest attack risk crop with rising domestic and export superfood demand.' }
  ],

  // "How I'm Doing" Village Sales Comparison (Part 16.1 requirement)
  getVillageSalesComparison: () => ({
    farmer_name: 'Your Farm (Ramesh Patel)',
    farmer_revenue: 1145000,
    farmer_yield_qtl: 482,
    village_avg_revenue: 820000,
    village_avg_yield_qtl: 350,
    top_performer_revenue: 1450000,
    top_performer_yield_qtl: 560,
    analysis: 'You are performing 39.6% above the Anand village average revenue! Shifting 2 acres to Grade A+ Himsona tomatoes & cold chain storage contributed to your top 10% ranking.'
  })
}
