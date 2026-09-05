// ─────────────────────────────────────────────────────
//  MOCK DATA — Orders feature
//  Replace this with real Redux selector data when
//  connecting the backend. The shape matches the real
//  Order model returned by the API.
// ─────────────────────────────────────────────────────

export const MOCK_ORDERS = [
  // ── Order 1 ── Multi-seller, mixed statuses ──────────
  {
    _id: "ORD-2025-001",
    createdAt: "2025-08-28T10:22:00.000Z",
    subtotal: 19800,
    currency: "INR",
    status: "partially_shipped",
    paymentStatus: "paid",
    items: [
      {
        _id: "item-001",
        product: "prod-a1",
        seller: { _id: "seller-1", fullname: "Noir House Studio" },
        title: "Obsidian Linen Tuxedo",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80&auto=format&fit=crop",
        variantId: "var-01",
        variantTitle: "Size L / Charcoal Black",
        quantity: 1,
        price: { amount: 12500, currency: "INR" },
        lineTotal: 12500,
        status: "shipped",
      },
      {
        _id: "item-002",
        product: "prod-a2",
        seller: { _id: "seller-1", fullname: "Noir House Studio" },
        title: "Midnight Silk Pocket Square",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80&auto=format&fit=crop",
        variantId: "var-02",
        variantTitle: "Monochrome / One Size",
        quantity: 2,
        price: { amount: 1400, currency: "INR" },
        lineTotal: 2800,
        status: "shipped",
      },
      {
        _id: "item-003",
        product: "prod-b1",
        seller: { _id: "seller-2", fullname: "Aurelian Atelier" },
        title: "Burnished Gold Leather Belt",
        image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format&fit=crop",
        variantId: "var-03",
        variantTitle: "Size 32 / Cognac",
        quantity: 1,
        price: { amount: 4500, currency: "INR" },
        lineTotal: 4500,
        status: "pending",
      },
    ],
    sellerOrders: [
      { seller: { _id: "seller-1", fullname: "Noir House Studio" }, status: "shipped" },
      { seller: { _id: "seller-2", fullname: "Aurelian Atelier" }, status: "pending" },
    ],
  },

  // ── Order 2 ── Single seller, delivered ──────────────
  {
    _id: "ORD-2025-002",
    createdAt: "2025-08-15T14:05:00.000Z",
    subtotal: 8200,
    currency: "INR",
    status: "delivered",
    paymentStatus: "paid",
    items: [
      {
        _id: "item-004",
        product: "prod-c1",
        seller: { _id: "seller-3", fullname: "Velvet Vault" },
        title: "Editorial Wool Overcoat",
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80&auto=format&fit=crop",
        variantId: "var-04",
        variantTitle: "Size M / Ivory Cream",
        quantity: 1,
        price: { amount: 8200, currency: "INR" },
        lineTotal: 8200,
        status: "delivered",
      },
    ],
    sellerOrders: [
      { seller: { _id: "seller-3", fullname: "Velvet Vault" }, status: "delivered" },
    ],
  },

  // ── Order 3 ── Processing, multiple items ─────────────
  {
    _id: "ORD-2025-003",
    createdAt: "2025-09-01T08:47:00.000Z",
    subtotal: 14600,
    currency: "INR",
    status: "processing",
    paymentStatus: "paid",
    items: [
      {
        _id: "item-005",
        product: "prod-d1",
        seller: { _id: "seller-4", fullname: "The Dark Wardrobe" },
        title: "Carbon Mesh Bomber Jacket",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80&auto=format&fit=crop",
        variantId: "var-05",
        variantTitle: "Size XL / Matte Black",
        quantity: 1,
        price: { amount: 9800, currency: "INR" },
        lineTotal: 9800,
        status: "processing",
      },
      {
        _id: "item-006",
        product: "prod-d2",
        seller: { _id: "seller-4", fullname: "The Dark Wardrobe" },
        title: "Phantom Slim Trousers",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80&auto=format&fit=crop",
        variantId: "var-06",
        variantTitle: "Size 30 / Anthracite",
        quantity: 1,
        price: { amount: 4800, currency: "INR" },
        lineTotal: 4800,
        status: "processing",
      },
    ],
    sellerOrders: [
      { seller: { _id: "seller-4", fullname: "The Dark Wardrobe" }, status: "processing" },
    ],
  },

  // ── Order 4 ── Cancelled ───────────────────────────────
  {
    _id: "ORD-2025-004",
    createdAt: "2025-07-19T19:30:00.000Z",
    subtotal: 3200,
    currency: "INR",
    status: "cancelled",
    paymentStatus: "refunded",
    items: [
      {
        _id: "item-007",
        product: "prod-e1",
        seller: { _id: "seller-5", fullname: "Solstice Supply" },
        title: "Raw-Edge Linen Kurta",
        image: "https://images.unsplash.com/photo-1607007829892-8424e7820eed?w=400&q=80&auto=format&fit=crop",
        variantId: "var-07",
        variantTitle: "Size S / Natural Beige",
        quantity: 2,
        price: { amount: 1600, currency: "INR" },
        lineTotal: 3200,
        status: "cancelled",
      },
    ],
    sellerOrders: [
      { seller: { _id: "seller-5", fullname: "Solstice Supply" }, status: "cancelled" },
    ],
  },
];
