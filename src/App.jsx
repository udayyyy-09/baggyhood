import { useState, useEffect } from 'react'
import {
  ArrowDownRight, ArrowRight, Check, Menu, ShieldCheck, Truck,
  Weight, Footprints, Ruler, Instagram, Youtube, MessageCircle, X,
  Sparkles, Flame, Clock, Bell, Layers, Compass,
  ChevronLeft, ChevronRight, Maximize2, ZoomIn, Eye
} from 'lucide-react'

const shades = [
  {
    name: 'Vintage Washed Grey',
    short: 'Washed Grey',
    price: '₹1,350',
    length: '42″',
    tone: '#666866',
    image: '/Oversized Indigo Jeans and Chunky Boots.png',
    slug: 'vintage-washed-grey',
    angles: [
      {
        id: 'front',
        tag: '01 // FRONT',
        title: 'Front Stance',
        subtitle: 'Natural wide drape & calibrated high rise',
        fileName: 'vintage-washed-grey-front.png',
        image: '/vintage-washed-grey-front.png',
        fallback: '/Oversized Indigo Jeans and Chunky Boots.png',
      },
      {
        id: 'stack',
        tag: '02 // STACK',
        title: 'Sneaker Stack',
        subtitle: 'Heavy puddle hem break resting over chunky footwear',
        fileName: 'vintage-washed-grey-stack.png',
        image: '/vintage-washed-grey-stack.png',
        fallback: '/Oversized Indigo Jeans and Chunky Boots.png',
      },
      {
        id: 'side',
        tag: '03 // PROFILE',
        title: 'Side Silhouette',
        subtitle: 'Full 360° relaxed thigh-to-hem volume',
        fileName: 'vintage-washed-grey-side.png',
        image: '/vintage-washed-grey-side.png',
        fallback: '/Oversized Indigo Jeans and Chunky Boots.png',
      },
      {
        id: 'back',
        tag: '04 // DETAILS',
        title: 'Back Construction',
        subtitle: 'Pocket placement, rear rise & double-needle stitch',
        fileName: 'vintage-washed-grey-back.png',
        image: '/vintage-washed-grey-back.png',
        fallback: '/Wide-Leg Denim Jeans Front and Back Views- ForestGreen.png',
      },
    ],
  },
  {
    name: 'Dark Brown',
    short: 'Dark Brown',
    price: '₹1,350',
    length: '42″',
    tone: '#4b3326',
    image: '/Baggy Black Denim Streetwear Look.png',
    slug: 'dark-brown',
    angles: [
      {
        id: 'front',
        tag: '01 // FRONT',
        title: 'Front Stance',
        subtitle: 'Heavyweight dark tint streetwear silhouette',
        fileName: 'dark-brown-front.png',
        image: '/dark-brown-front.png',
        fallback: '/Baggy Black Denim Streetwear Look.png',
      },
      {
        id: 'stack',
        tag: '02 // STACK',
        title: 'Sneaker Stack',
        subtitle: 'Deep outseam break pooling cleanly over sole',
        fileName: 'dark-brown-stack.png',
        image: '/dark-brown-stack.png',
        fallback: '/Baggy Black Denim Streetwear Look.png',
      },
      {
        id: 'side',
        tag: '03 // PROFILE',
        title: 'Side Silhouette',
        subtitle: 'Architectural drape with relaxed thigh room',
        fileName: 'dark-brown-side.png',
        image: '/dark-brown-side.png',
        fallback: '/Baggy Black Denim Streetwear Look.png',
      },
      {
        id: 'back',
        tag: '04 // DETAILS',
        title: 'Back Construction',
        subtitle: 'Low-slung back pockets & reinforced hem',
        fileName: 'dark-brown-back.png',
        image: '/dark-brown-back.png',
        fallback: '/Wide-Leg Denim Jeans Front and Back Views- ForestGreen.png',
      },
    ],
  },
  {
    name: 'Vintage Olive / Green',
    short: 'Vintage Olive',
    price: '₹1,500',
    length: '44″',
    tone: '#555b3b',
    image: '/Oversized Blue Wide-Leg Jeans Look.png',
    slug: 'vintage-olive',
    angles: [
      {
        id: 'front',
        tag: '01 // FRONT',
        title: 'Front Stance',
        subtitle: 'Iconic oversized streetwear proportions',
        fileName: 'vintage-olive-front.png',
        image: '/vintage-olive-front.png',
        fallback: '/Oversized Blue Wide-Leg Jeans Look.png',
      },
      {
        id: 'stack',
        tag: '02 // STACK',
        title: 'Sneaker Stack',
        subtitle: 'Calibrated puddle drape over chunky boots',
        fileName: 'vintage-olive-stack.png',
        image: '/vintage-olive-stack.png',
        fallback: '/Oversized Blue Wide-Leg Jeans Look.png',
      },
      {
        id: 'side',
        tag: '03 // PROFILE',
        title: 'Side Silhouette',
        subtitle: 'Unrestricted leg movement & clean fall',
        fileName: 'vintage-olive-side.png',
        image: '/vintage-olive-side.png',
        fallback: '/Oversized Blue Wide-Leg Jeans Look.png',
      },
      {
        id: 'back',
        tag: '04 // DETAILS',
        title: 'Back Construction',
        subtitle: 'Authentic rear yoke & clean back drape',
        fileName: 'vintage-olive-back.png',
        image: '/vintage-olive-back.png',
        fallback: '/Wide-Leg Denim Jeans Front and Back Views- ForestGreen.png',
      },
    ],
  },
]

const upcomingDrips = [
  {
    // tag: 'DROP #02 // LAB',
    title: 'Navy Oxford Shirt',
    sub: 'Garment-Dyed Cotton',
    price: 'Starting from ₹799',
    desc: 'Navy Blue Oxford Shirt, designed for a clean, sophisticated, and versatile look. Featuring a classic button-down collar, full sleeves, and a neat front button closure',
    status: 'Sampling Phase',
    badge: 'From ₹799',
    image: '/Navy Oxford Shirt on Wooden Hanger.png',
  },
  {
    // tag: 'DROP #03 // ARCHIVE',
    title: 'Carpenter Baggy Denim',
    sub: 'Heavy Duck Canvas & Denim',
    price: 'Starting from ₹799',
    desc: 'Double-knee reinforcement, authentic hammer loop, and an extra stacked 44″–46″ drape for heavy sneaker stacking.',
    status: 'In Patterning',
    badge: 'From ₹799',
    image: '/upcoming-drip.jpeg',
  },
  {
    // tag: 'DROP #04 // VAULT',
    title: 'Relaxed Oxford Button-Down',
    sub: 'Garment-Dyed Cotton',
    price: 'Starting from ₹799',
    desc: 'A relaxed button-down cut with an easy streetwear drape, chest pocket, and garment-washed vintage softness.',
    status: 'Secret Vault',
    badge: 'From ₹799',
    image: '/Dusty Pink Oxford Shirt on Wooden Hanger.png',
  },
]

const features = [
  { icon: Weight, title: 'Heavyweight feel', text: 'Substantial denim with a texture you can see and feel.' },
  { icon: Ruler, title: 'Structured fit', text: 'Room through the thigh with a considered waist-to-leg shape.' },
  { icon: Footprints, title: 'Clean sneaker stack', text: 'A long, relaxed drape designed to sit right over your kicks.' },
  { icon: ShieldCheck, title: 'Quality checked', text: 'We verify the pair before it makes its way to you.' },
]

const sizeChartData = [
  { name: 'Waist', values: ['28″', '30″', '32″', '34″', '36″'], highlight: false },
  { name: 'Jeans length', values: ['42″', '42″', '44″', '45″', '46″'], highlight: true, note: 'Deep sneaker stack length' },
  { name: 'Front rise', values: ['11″', '11.5″', '12″', '12.5″', '13″'], highlight: false },
  { name: 'Inseam', values: ['30″', '31″', '32″', '33″', '34″'], highlight: false },
  { name: 'Leg opening', values: ['10″', '10.5″', '11″', '11.5″', '12″'], highlight: false },
]

const collectionProducts = [
  // 1. Denim
  {
    id: 'denim-grey',
    category: 'denim',
    categoryLabel: 'Denim',
    name: 'Vintage Washed Grey Wide-Leg Jeans',
    tag: '14 OZ RIGID COTTON',
    badge: 'DROP #01 PRIORITY',
    price: '₹1,350',
    size: 'Length: 42″',
    jeansLength: '42″',
    silhouette: 'Wide-Leg Sneaker Stack',
    priceEstimate: 'Drop #01 — ₹1,350',
    image: '/vintage-washed-grey-front.png',
    gallery: [
      '/vintage-washed-grey-front.png',
      '/vintage-washed-grey-back.png',
      '/vintage-washed-grey-stack.png',
    ],
    specs: [
      'Jeans length: 42″ (deep sneaker stack)',
      '100% Heavyweight Cotton (14 oz)',
      'Roomy relaxed fit through hips and thighs',
      'Reinforced seams & silver nickel rivets',
    ],
    description:
      'Our signature wide-leg jeans in a vintage faded grey wash. Cut in a 42″ length so they pool cleanly over your sneakers without dragging on the ground. Sturdy, comfortable, and made to get softer with every wear.',
  },
  {
    id: 'denim-brown',
    category: 'denim',
    categoryLabel: 'Denim',
    name: 'Dark Mocha Brown Wide-Leg Jeans',
    tag: '14 OZ VINTAGE WASH',
    badge: 'SIGNATURE COLORWAY',
    price: '₹1,350',
    size: 'Length: 42″',
    jeansLength: '42″',
    silhouette: 'Relaxed Wide Fit',
    priceEstimate: 'Drop #01 — ₹1,350',
    image: '/dark-brown-front.png',
    gallery: [
      '/dark-brown-front.png',
      '/dark-brown-back.png',
      '/dark-brown-side.png',
    ],
    specs: [
      'Jeans length: 42″ (deep sneaker stack)',
      'Deep mocha wash with subtle vintage fade',
      'Heavy 14 oz cotton that holds its structure',
      'Classic 5-pocket cut with reinforced back yoke',
    ],
    description:
      'Rich chocolate brown denim with a subtle vintage wash. Cut in a 42″ length with generous room through the thighs and legs for easy all-day comfort, hanging in a clean straight fall that pairs perfectly with chunky sneakers or boots.',
  },
  {
    id: 'denim-olive',
    category: 'denim',
    categoryLabel: 'Denim',
    name: 'Vintage Olive Green Wide-Leg Jeans',
    tag: '14 OZ MILITARY WASH',
    badge: 'LIMITED QUANTITY',
    price: '₹1,500',
    size: 'Length: 44″',
    jeansLength: '44″',
    silhouette: 'Oversized Streetwear Fit',
    priceEstimate: 'Drop #01 — ₹1,500',
    image: '/vintage-olive-front.png',
    gallery: [
      '/vintage-olive-front.png',
      '/vintage-olive-back.png',
      '/vintage-olive-stack.png',
    ],
    specs: [
      'Jeans length: 44″ (extra stacked drape)',
      'Earthy olive green stonewashed finish',
      '14 oz durable rigid cotton denim',
      'Heavy-duty pocket liners & sturdy waist patch',
    ],
    description:
      'An earthy olive green shade with an authentic stonewashed look. Cut in a longer 44″ length for an extra-stacked puddle over your kicks, giving you complete freedom to move with zero bunching.',
  },
  // 2. Heavyweight Tees & Tops
  {
    id: 'tee-smiley',
    category: 'tees',
    categoryLabel: 'Heavyweight Tees',
    name: 'Smileyworld "Mission Unknown" Boxy Tee — Washed Brown',
    tag: '280 GSM COMBED COTTON',
    badge: 'COMMUNITY FAVORITE',
    price: '₹799',
    size: 'L',
    silhouette: 'Boxy Drop-Shoulder Fit',
    priceEstimate: 'Drop #01 — ₹799',
    image: '/Smileyworld Mission Unknown T-Shirt.png',
    gallery: [
      '/Smileyworld Mission Unknown T-Shirt.png',
      '/Vintage Smileyworld Oversized T-Shirt.png',
    ],
    specs: [
      'Size: L (Boxy drop-shoulder fit)',
      'Heavy 280 GSM cotton that drapes cleanly',
      'Detailed "Mission Unknown" graphic back print',
      'Pre-shrunk vintage enzyme wash for ultra-soft hand',
    ],
    description:
      'A heavyweight vintage-washed brown tee featuring the bold Smileyworld "Mission Into The Unknown" artwork on the back and subtle smiley icons on the chest. Cut boxy in Size L with relaxed drop shoulders and a thick collar that stays flat.',
  },
  {
    id: 'tee-birds',
    category: 'tees',
    categoryLabel: 'Heavyweight Tees',
    name: 'Flying Birds Oversized Graphic Tee — Washed Black',
    tag: '280 GSM HEAVY COTTON',
    badge: 'NEW ARRIVAL',
    price: '₹1099',
    size: 'L',
    silhouette: 'Oversized Streetwear Fit',
    priceEstimate: 'Drop #01 — ₹1,099',
    image: '/Oversized Black T-Shirt with Colourful Birds.png',
    gallery: [
      '/Oversized Black T-Shirt with Colourful Birds.png',
    ],
    specs: [
      'Size: L (Oversized relaxed drape)',
      'Vibrant painted swallows artwork across the back',
      'Substantial 280 GSM combed cotton',
      'Durable ribbed collar that holds shape after wash',
    ],
    description:
      'A washed black heavyweight t-shirt featuring vivid blue and yellow painted flying birds across the back. Cut in Size L with dropped shoulders, delivering an easy, comfortable drape over your favorite baggy jeans.',
  },
  {
    id: 'tee-henley',
    category: 'tees',
    categoryLabel: 'Tops & Layers',
    name: 'Waffle-Knit Long-Sleeve Henley — Dark Charcoal',
    tag: 'TEXTURED WAFFLE KNIT',
    badge: 'DAILY ESSENTIAL',
    price: '₹899',
    size: 'M',
    silhouette: 'Relaxed Casual Fit',
    priceEstimate: 'Drop #01 — ₹899',
    image: '/Dark Charcoal Henley on Wooden Hanger.png',
    gallery: [
      '/Dark Charcoal Henley on Wooden Hanger.png',
    ],
    specs: [
      'Size: M (Comfortable everyday fit)',
      'Textured waffle-knit cotton for breathable warmth',
      'Traditional 4-button front henley placket',
      'Versatile dark charcoal that matches any wash',
    ],
    description:
      'A versatile dark charcoal long-sleeve henley crafted from soft, textured waffle-knit cotton. Cut in Size M with a 4-button placket and snug cuffs, making it effortless to wear alone or layered under jackets and overshirts.',
  },
  {
    id: 'tee-yokohama',
    category: 'tees',
    categoryLabel: 'Heavyweight Tees',
    name: 'Yokohama Varsity Athletic Jersey — Black & White',
    tag: 'VARSITY MESH KNIT',
    badge: 'LIMITED EDITION',
    price: '₹1,199',
    size: 'M',
    silhouette: 'Boxy Athletic Fit',
    priceEstimate: 'Drop #01 — ₹1,199',
    image: '/Black Yokohama Varsity Jersey.png',
    gallery: [
      '/Black Yokohama Varsity Jersey.png',
    ],
    specs: [
      'Size: M (Athletic streetwear cut)',
      'Breathable poly-cotton athletic mesh knit',
      'Archival Yokohama lettering & Kanji script',
      'Contrast ribbed V-neck & striped sleeve bands',
    ],
    description:
      'A retro Tokyo street jersey inspired by classic Japanese motorsport varsity wear. Cut in Size M with arched "YOKOHAMA" lettering across the chest, striped sleeve bands, and a roomy cut that pairs effortlessly with wide denim.',
  },
  // 3. Sweatshirts & Hoodies
  {
    id: 'crewneck-beige',
    category: 'sweatshirts',
    categoryLabel: 'Sweatshirts & Fleece',
    name: 'ABRAX Minimalist Crewneck Sweatshirt — Sand Beige',
    tag: '460 GSM HEAVY FLEECE',
    badge: 'WARDROBE STAPLE',
    price: '₹1,299',
    size: 'M',
    silhouette: 'Drop-Shoulder Boxy Crew',
    priceEstimate: 'Drop #01 — ₹1,299',
    image: '/Beige ABRAX Crewneck Sweatshirt Display.png',
    gallery: [
      '/Beige ABRAX Crewneck Sweatshirt Display.png',
    ],
    specs: [
      'Size: M (Boxy drop-shoulder fall)',
      'Heavyweight 460 GSM fleece with cozy brushed interior',
      'Minimal ABRAX woven label on the left chest',
      'Stretchy ribbed neck, cuffs, and hem that hold shape',
    ],
    description:
      'A super cozy crewneck sweatshirt in a clean sand beige hue. Built in Size M from thick 460 GSM fleece with dropped shoulders and a subtle chest tab, giving you a laid-back, clean look that sits comfortably over baggy jeans.',
  },
]

function App() {
  const [selectedShade, setSelectedShade] = useState(0)
  const [productCategory, setProductCategory] = useState('all')
  const [inspectProduct, setInspectProduct] = useState(null)
  const [inspectImage, setInspectImage] = useState(null)
  const [activeLightbox, setActiveLightbox] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [savedVip, setSavedVip] = useState(() => {
    try {
      const data = localStorage.getItem('baggyhood_droplist_vip')
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(() => {
    try {
      return Boolean(localStorage.getItem('baggyhood_droplist_vip'))
    } catch {
      return false
    }
  })
  const [submitting, setSubmitting] = useState(false)
  const [preferredSize, setPreferredSize] = useState(() => {
    try {
      const data = localStorage.getItem('baggyhood_droplist_vip')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.size) return parsed.size
      }
    } catch { }
    return '32 (44″ Length)'
  })

  const openInspect = (product) => {
    setInspectProduct(product)
    setInspectImage(product.image)
  }

  const closeInspect = () => {
    setInspectProduct(null)
    setInspectImage(null)
  }

  useEffect(() => {
    if (!activeLightbox && !inspectProduct) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLightbox(null)
        closeInspect()
      }
      if (e.key === 'ArrowRight' && activeLightbox) {
        setActiveLightbox((prev) => prev && {
          ...prev,
          angleIndex: (prev.angleIndex + 1) % shades[prev.shadeIndex].angles.length,
        })
      }
      if (e.key === 'ArrowLeft' && activeLightbox) {
        setActiveLightbox((prev) => prev && {
          ...prev,
          angleIndex: (prev.angleIndex - 1 + shades[prev.shadeIndex].angles.length) % shades[prev.shadeIndex].angles.length,
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeLightbox, inspectProduct])

  const filteredProducts = productCategory === 'all'
    ? collectionProducts
    : collectionProducts.filter((p) => p.category === productCategory)

  const joinWaitlist = async (event) => {
    event.preventDefault()
    const cleanEmail = email.trim()
    if (!cleanEmail || submitting) return
    setSubmitting(true)

    const payload = {
      email: cleanEmail,
      size: preferredSize,
      shade: shades[selectedShade]?.name || 'Unspecified',
      timestamp: new Date().toISOString(),
    }

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || ''
      const apiUrl = `${apiBase.replace(/\/$/, '')}/api/droplist`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.warn('Droplist API response not 200, still recording user state')
      }
    } catch (err) {
      console.warn('Network issue reaching droplist API, still showing confirmed state for customer:', err)
    } finally {
      try {
        localStorage.setItem('baggyhood_droplist_vip', JSON.stringify(payload))
      } catch (e) {
        console.warn('Could not save to localStorage:', e)
      }
      setSavedVip(payload)
      setSubmitted(true)
      setSubmitting(false)
    }
  }

  const resetDroplist = () => {
    try {
      localStorage.removeItem('baggyhood_droplist_vip')
    } catch (e) {
      console.warn('Could not clear localStorage:', e)
    }
    setSavedVip(null)
    setEmail('')
    setSubmitted(false)
  }

  const scrollToWaitlist = () => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToWardrobe = () => document.getElementById('wardrobe')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToComingSoon = () => document.getElementById('coming-soon')?.scrollIntoView({ behavior: 'smooth' })

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'The denim', href: '#denim' },
    { label: 'Shades', href: '#shades' },
    { label: 'Wardrobe', href: '#wardrobe' },
    { label: 'Fit & size', href: '#fit' },
    { label: 'Coming soon', href: '#coming-soon' },
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-10">
          <a href="#home" className="font-display text-[26px] font-black tracking-[-1.8px]">baggy<span className="text-olive">Hood</span><span className="text-olive">.</span></a>
          <nav className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[.16em] text-white/70 md:flex">
            {navItems.map((item) => (
              <a key={item.label} className="nav-link" href={item.href}>{item.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <button onClick={scrollToComingSoon} className="rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white/80 transition hover:border-[#a9ad87] hover:text-[#a9ad87]">Future Drip</button>
            <button onClick={scrollToWaitlist} className="rounded-full bg-paper px-5 py-2.5 text-xs font-bold text-ink transition hover:bg-olive hover:text-white inline-flex items-center">
              {submitted ? 'VIP Confirmed' : 'Join Drop #1'} <ArrowRight size={14} className="ml-2" />
            </button>
          </div>
          <button aria-label="Toggle menu" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileOpen && <div className="border-t border-white/10 bg-ink px-5 py-4 md:hidden">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="block py-3 text-sm text-white/75">{item.label}</a>
          ))}
          <button onClick={() => { setMobileOpen(false); scrollToWaitlist() }} className="mt-3 w-full rounded-full bg-paper py-3 font-bold text-ink">
            {submitted ? 'View VIP Spot' : 'Join waitlist'}
          </button>
        </div>}
      </header>

      <main>
        <section id="home" className="hero relative flex min-h-[720px] items-end pt-28 md:min-h-[790px]">
          <video
            src="/Model_rotating_in_jeans_20261022140503.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-black/20" />
          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 md:grid-cols-[1.05fr_.95fr] md:items-end md:px-10 md:pb-20">
            <div className="max-w-2xl">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[.28em] text-[#c5c7b5]">Oversized denim for the next generation</p>
              <h1 className="max-w-[720px] font-display text-5xl font-black leading-[.94] tracking-[-.055em] sm:text-6xl md:text-7xl lg:text-[88px]">BUILT FOR THE<br />STREETS.<br /><span className="text-[#a9ad87]">MADE FOR YOUR FIT.</span></h1>
              <p className="mt-6 max-w-md text-sm leading-6 text-white/75 md:text-base">Heavy denim. Room to move. A clean stack over your favourite sneakers. This is baggyHood — made for the way you wear it.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button onClick={scrollToWaitlist} className="group inline-flex items-center rounded-full bg-paper px-6 py-4 text-sm font-bold text-ink transition hover:bg-[#b9bd98]">
                  {submitted ? 'VIP Spot Reserved' : 'Join Drop #1 Waitlist'} <ArrowRight className="ml-3 transition group-hover:translate-x-1" size={16} />
                </button>
                <span className="text-[10px] font-semibold uppercase tracking-[.16em] text-white/65">
                  {submitted ? 'Early VIP Access Confirmed' : 'Limited first drop'}
                </span>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[.18em] text-white/55"><span>01 / No guesswork fit</span><span>•</span><span>02 / Quality checked</span><span>•</span><span>03 / Drop culture</span></div>
            </div>
            <div className="hidden justify-end pb-10 md:flex">
              <div className="rotate-[-7deg] border-l border-[#c3c5ad] pl-4 font-display text-3xl font-bold italic leading-tight text-[#d2d1c4]">More room.<br />Better fits.<br /><span className="text-[#a9ad87]">Bigger vibes.</span><ArrowDownRight className="mt-3" size={28} /></div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15" />
        </section>

        <section id="denim" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:px-10 md:py-21">
          <div className="group relative min-h-[240px] overflow-hidden rounded-sm border border-white/10 bg-black/40 md:min-h-[270px]">
            <video
              src="/Wide-Tshirt Unboxing.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-[370px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="pointer-events-none absolute bottom-5 left-5">
              <p className="text-[10px] uppercase tracking-[.22em] text-white/70">The details matter</p>
              <p className="mt-1 text-xl font-bold">Texture. Weight. Drape.</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">01 — The denim</p>
            <h2 className="section-title mt-4">QUALITY YOU<br />CAN <span className="text-[#a9ad87]">FEEL.</span></h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/60">Not just wide-leg jeans. We're building the everyday pair around the details that make the fit: fabric with substance, room where you need it, and a hem that works with your rotation.</p>
            <div className="mt-9 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-[#b9bd98]"><Icon size={20} strokeWidth={1.5} /></div><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-white/55">{text}</p></div></div>)}
            </div>
          </div>
        </section>

        <section id="shades" className="bg-paper py-20 text-ink md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow-dark">02 — The first drop</p>
                <h2 className="section-title-dark mt-4">
                  THREE SHADES.<br />
                  ENDLESS FITS.
                </h2>
                <p className="mt-4 text-sm text-ink/65">
                  A tight palette. A lot of ways to make it yours.
                </p>
                
              </div>
              <p className="max-w-xs text-xs leading-6 text-ink/60">
                Drop #1 is in the works. Pick your shade and join the waitlist to get first access when the collection goes live.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {shades.map((shade, index) => (
                <button
                  key={shade.name}
                  onClick={() => setSelectedShade(index)}
                  className={`shade-card text-left ${selectedShade === index ? 'shade-selected' : ''}`}
                >
                  <div className="relative overflow-hidden bg-[#d7d5cd]">
                    <img
                      src={shade.image}
                      alt={`${shade.name} denim inspiration`}
                      className="h-[300px] w-full object-cover object-bottom transition duration-700 hover:scale-105 sm:h-[360px]"
                    />
                    {/* Top floating pill tags (Place 1) */}
                    <div className="absolute left-4 top-4 flex items-center gap-1.5">
                      <span className="rounded-full bg-paper/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.15em]">
                        0{index + 1}
                      </span>
                      <span className="rounded-full bg-black/85 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-md">
                        {shade.price || '₹1,400'}
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedShade(index)
                          setActiveLightbox({ shadeIndex: index, angleIndex: 0 })
                        }}
                        title="Inspect all angles"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-black/40 text-white transition hover:bg-white hover:text-ink hover:scale-110"
                      >
                        <Maximize2 size={13} />
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-black/20 text-white">
                        {selectedShade === index && <Check size={15} />}
                      </span>
                    </div>
                  </div>

                  {/* Card bottom info (Place 2) */}
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full ring-1 ring-black/20" style={{ backgroundColor: shade.tone }} />
                      <div>
                        <span className="text-sm font-bold block">{shade.name}</span>
                        <span className="text-[11px] font-medium text-ink/65">
                          Jeans length: <strong className="text-ink">{shade.length || (index === 2 ? '44″' : '42″')}</strong>
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-[#656a4d]">
                      {shade.price || '₹1,400'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Dynamic 4-Angle Cards for the Selected Shade */}
            <div className="mt-8 rounded-2xl border border-black/10 bg-[#e8e6df]/70 p-5 backdrop-blur-sm sm:p-7">
              <div className="flex flex-col gap-3 pb-5 border-b border-black/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full ring-1 ring-black/20" style={{ backgroundColor: shades[selectedShade].tone }} />
                    <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#656a4d]">
                      Multi-Angle Inspection
                    </p>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl flex flex-wrap items-baseline gap-2.5">
                    <span>{shades[selectedShade].name}</span>
                    <span className="text-sm font-extrabold text-[#656a4d]">
                      {shades[selectedShade].price || '₹1,400'}
                    </span>
                    <span className="rounded-full border border-black/15 bg-white/70 px-2.5 py-0.5 text-xs font-semibold text-ink/75">
                      Jeans length: {shades[selectedShade].length || (selectedShade === 2 ? '44″' : '42″')}
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-2 self-start rounded-full border border-black/15 bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold text-ink/80 sm:self-auto shadow-sm">
                  <Eye size={13} className="text-[#656a4d]" />
                  <span>Click any angle card to expand full-screen</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {shades[selectedShade].angles.map((angle, idx) => (
                  <div
                    key={angle.id}
                    onClick={() => setActiveLightbox({ shadeIndex: selectedShade, angleIndex: idx })}
                    className="group flex flex-col justify-between overflow-hidden rounded-xl border border-black/10 bg-white/90 p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#777b59] hover:shadow-xl cursor-pointer"
                  >
                    <div>
                      <div className="relative overflow-hidden rounded-lg bg-[#d7d5cd]">
                        <img
                          src={angle.image}
                          alt={`${shades[selectedShade].name} - ${angle.title}`}
                          onError={(e) => {
                            if (e.currentTarget.src !== angle.fallback) {
                              e.currentTarget.src = angle.fallback
                            }
                          }}
                          className="h-[240px] w-full object-cover object-bottom transition duration-500 group-hover:scale-105 sm:h-[270px]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink shadow-md transition hover:scale-110">
                            <ZoomIn size={16} />
                          </span>
                        </div>
                      </div>

                      <div className="pt-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-ink">{angle.title}</h4>
                          <Maximize2 size={12} className="text-ink/40 transition group-hover:text-ink" />
                        </div>
                        <p className="mt-1 text-[11px] leading-4 text-ink/65">{angle.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-between gap-4 border-t border-black/15 pt-6 sm:flex-row sm:items-center">
              <p className="text-xs text-ink/65">
                Currently selected: <strong className="text-ink">{shades[selectedShade].name}</strong> — <strong className="text-[#656a4d]">{shades[selectedShade].price || '₹1,400'}</strong> (Jeans Length: <strong>{shades[selectedShade].length || (selectedShade === 2 ? '44″' : '42″')}</strong>)
              </p>
              <button
                onClick={scrollToWaitlist}
                className="inline-flex items-center gap-3 self-start rounded-full bg-ink px-6 py-3.5 text-xs font-bold text-white transition hover:bg-olive sm:self-auto"
              >
                Get first access <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* 03 — COMPLETE WARDROBE VAULT (JEANS, TEES & SWEATSHIRTS) */}
        <section id="wardrobe" className="relative bg-[#0a0d0b] py-20 text-white md:py-28 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            {/* Section Header */}
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow">03 — Complete Wardrobe Vault</p>
                <h2 className="section-title mt-4">
                  BUILT FOR THE ROTATION.<br />
                  <span className="text-[#a9ad87]">JEANS, TEES & SWEATSHIRTS.</span>
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
                  Every silhouette in our rotation is custom milled with heavyweight substance: 14oz rigid puddle-stack denim (₹1,400), 280 GSM graphic tees (from ₹899), waffle henleys (₹899), and heavy fleece (₹1,299).
                </p>
              </div>

              {/* Interactive Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[.03] p-1.5 backdrop-blur-md">
                {[
                  { key: 'all', label: 'All Pieces', count: collectionProducts.length },
                  { key: 'denim', label: 'Wide Denim', count: collectionProducts.filter((p) => p.category === 'denim').length },
                  { key: 'tees', label: 'Tees & Tops', count: collectionProducts.filter((p) => p.category === 'tees').length },
                  { key: 'sweatshirts', label: 'Fleece & Hoodies', count: collectionProducts.filter((p) => p.category === 'sweatshirts').length },
                ].map((tab) => {
                  const active = productCategory === tab.key
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setProductCategory(tab.key)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition duration-200 ${
                        active
                          ? 'bg-[#a9ad87] text-ink shadow-lg shadow-[#a9ad87]/20'
                          : 'text-white/65 hover:bg-white/[.06] hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                          active ? 'bg-ink text-[#a9ad87]' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[.05] via-white/[.02] to-transparent p-4 transition duration-300 hover:border-[#a9ad87]/60 hover:shadow-2xl hover:shadow-[#a9ad87]/10"
                >
                  {/* Image Presentation */}
                  <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-xl bg-black/50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Shadow scrim */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition duration-300 group-hover:opacity-30" />

                    {/* Top floating price & size badge (Price Place 1) */}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5">
                      <span className="rounded-full border border-white/20 bg-black/85 px-2.5 py-1 text-[11px] font-black tracking-wide text-[#a9ad87] backdrop-blur-md shadow-md">
                        {product.price}
                      </span>
                      <span className="rounded-full border border-white/15 bg-black/65 px-2 py-1 text-[10px] font-bold text-white/85 backdrop-blur-md">
                        {product.category === 'denim' ? product.size : `Size: ${product.size}`}
                      </span>
                    </div>

                    {/* Bottom floating details & inspect trigger */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                      <span className="truncate rounded-ful px-2.5 py-1 text-[9px] font-semibold text-white/80 backdrop-blur-md">
                        {/* {product.silhouette} */}
                      </span>
                      <button
                        type="button"
                        onClick={() => openInspect(product)}
                        title="Quick Inspect"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/70 text-white shadow-lg backdrop-blur-md transition hover:scale-110 hover:border-[#a9ad87] hover:bg-[#a9ad87] hover:text-ink"
                      >
                        <Maximize2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a9ad87]">
                          {product.categoryLabel} • {product.badge}
                        </p>
                        {/* Price (Price Place 2) */}
                        <span className="text-xs font-black text-[#d8dcbe]">
                          {product.price}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-bold text-white transition group-hover:text-[#d8dcbe]">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/55">
                        {product.description}
                      </p>

                      {/* Specs badges */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {product.specs.slice(0, 2).map((spec, i) => (
                          <span
                            key={i}
                            className="rounded-md border border-white/10 bg-white/[.03] px-2 py-0.5 text-[10px] text-white/60"
                          >
                            ✦ {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3.5">
                      <button
                        type="button"
                        onClick={() => openInspect(product)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 transition hover:text-white"
                      >
                        <Eye size={13} className="text-[#a9ad87]" /> View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (product.category === 'denim') {
                            const idx = shades.findIndex((s) =>
                              product.name.toLowerCase().includes(s.name.toLowerCase().split(' ')[0])
                            )
                            if (idx !== -1) setSelectedShade(idx)
                          }
                          scrollToWaitlist()
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#a9ad87] hover:text-ink"
                      >
                        Reserve Fit <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Capsule Banner */}
            <div className="mt-14 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[.02] p-6 backdrop-blur-md sm:p-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#a9ad87]/30 bg-[#a9ad87]/10 text-[#a9ad87]">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Entire Wardrobe Drop Calibrated In Harmony</h4>
                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/60">
                    Boxy drop-shoulder tees and heavyweight 480 GSM hoodies drape proportionally over our signature wide puddle hem jeans. Select your preferences to lock in priority access before the public launch.
                  </p>
                </div>
              </div>
              <button
                onClick={scrollToWaitlist}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-paper px-6 py-3.5 text-xs font-bold text-ink transition hover:bg-[#b9bd98]"
              >
                Join Drop Waitlist <ArrowRight size={14} className="ml-2" />
              </button>
            </div>
          </div>
        </section>

        <section id="fit" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <p className="eyebrow">04 — Fit & size</p>
              <h2 className="section-title mt-4">ROOM TO MOVE.<br /><span className="text-[#a9ad87]">FIT THAT MAKES SENSE.</span></h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/60">The right oversized fit shouldn't mean guessing your size. We provide complete measurements including waist and total jeans length for the ideal stacked silhouette.</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-lg border border-[#a9ad87]/30 bg-[#a9ad87]/5 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#a9ad87]">Stack Calibrated</p>
                  <p className="mt-0.5 text-xs text-white/80">42″–46″ outseam engineered for puddle drapes</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[.02] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">True Waist</p>
                  <p className="mt-0.5 text-xs text-white/80">Size 28 through 36 true-to-size</p>
                </div>
              </div>

              <button onClick={() => document.getElementById('size-guide')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-xs font-bold transition hover:border-[#a9ad87] hover:text-[#c3c7a3]">Explore the size guide <ArrowRight size={15} /></button>
              <p className="mt-4 text-[10px] text-white/40">Verified factory dimensions for Drop #01 production batch.</p>
            </div>

            <div id="size-guide" className="overflow-hidden rounded-xl border border-white/15 bg-white/[.03] shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[.2em] text-[#a9ad87]">Fit reference</p>
                  <h3 className="mt-1 text-lg font-bold">Size guide <span className="text-white/40 font-normal">(inches)</span></h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-[#a9ad87]">
                  <Ruler size={16} />
                  <span className="text-[11px] font-semibold text-white/80">Waist & Length Matrix</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[.02] text-[10px] uppercase tracking-[.15em] text-white/45">
                      <th className="px-5 py-4 font-semibold text-white/60">Measurement</th>
                      {['28', '30', '32', '34', '36'].map((v) => (
                        <th key={v} className="px-4 py-4 font-bold text-center text-white/90">W {v}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChartData.map((row) => (
                      <tr
                        key={row.name}
                        className={`transition-colors ${row.highlight
                            ? 'bg-[#a9ad87]/15 border-y border-[#a9ad87]/40'
                            : 'border-b border-white/5 hover:bg-white/[.02]'
                          }`}
                      >
                        <th className="px-5 py-4 font-medium text-white flex items-center gap-2 whitespace-nowrap">
                          <span className={row.highlight ? 'font-bold text-[#d8dcbe]' : ''}>{row.name}</span>
                          {row.highlight && (
                            <span className="rounded-full bg-[#a9ad87] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-ink shadow-sm">
                              Stack Length
                            </span>
                          )}
                        </th>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className={`px-4 py-4 text-center tabular-nums ${row.highlight
                                ? 'text-base font-extrabold text-[#c8cca8]'
                                : 'text-white/75'
                              }`}
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/10 px-6 py-4 bg-black/20 text-[11px] text-white/50 gap-2">
                <p>✦ Measurements calibrated specifically for oversized streetwear stack.</p>
                <p className="text-[#a9ad87]/80 font-medium">Model is 5'9" wearing W30 (43″ Length)</p>
              </div> */}
            </div>
          </div>
        </section>

        <section id="waitlist" className="relative overflow-hidden border-y border-white/10 bg-[#171b15]">
          <div className="waitlist-image absolute inset-0 opacity-25" /><div className="absolute inset-0 bg-gradient-to-r from-[#10130f] via-[#171b15]/90 to-[#171b15]/70" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1fr_.9fr] md:items-center md:px-10 md:py-24">
            <div>
              <p className="eyebrow">The first drop is coming</p>
              <h2 className="mt-4 font-display text-4xl font-black tracking-[-.04em] sm:text-5xl">DON'T JUST<br />WATCH THE DROP.</h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/65">Get the first look at the collection, launch updates and early access. No spam — just denim.</p>
            </div>
            <div>
              {submitted ? (
                <div className="rounded-xl border border-[#a9ad87]/40 bg-black/40 p-6 sm:p-7 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#a9ad87] text-ink shadow-md shadow-[#a9ad87]/20">
                      <Check size={22} className="stroke-[2.5]" />
                    </div>
                    <span className="rounded-full border border-[#a9ad87]/30 bg-[#a9ad87]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#a9ad87]">
                      VIP Spot Confirmed
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">You're on the list.</h3>

                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Thanks for backing baggyHood early. We've reserved size <strong className="text-white">{savedVip?.size || preferredSize}</strong> ({savedVip?.shade || shades[selectedShade]?.name}) for <strong className="text-[#d8dcbe] underline decoration-white/20 underline-offset-4">{savedVip?.email || email}</strong>.
                  </p>

                  <div className="mt-4 rounded-lg border border-white/10 bg-white/[.04] p-3 text-xs leading-5 text-white/60">
                    📩 <strong>VIP pass dispatched:</strong> Check your inbox for confirmation. You will receive private drop access 2 hours before the public launch.
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/45">
                    <span>Joined Drop #01 early access</span>
                    <button
                      type="button"
                      onClick={resetDroplist}
                      className="font-medium text-[#a9ad87] transition hover:text-white hover:underline"
                    >
                      Use another email or change size →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={joinWaitlist} className="rounded-xl border border-white/10 bg-black/35 p-5 sm:p-7 backdrop-blur-md">
                  <div className="mb-4">
                    <label htmlFor="pref-size" className="mb-2 block text-xs font-semibold text-white/80">Select Your Size (Waist & Length)</label>
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                      {[
                        { w: '28', l: '42″' },
                        { w: '30', l: '42″' },
                        { w: '32', l: '44″' },
                        { w: '34', l: '45″' },
                        { w: '36', l: '46″' },
                      ].map((item) => {
                        const val = `${item.w} (${item.l} Length)`
                        const active = preferredSize === val
                        return (
                          <button
                            key={item.w}
                            type="button"
                            onClick={() => setPreferredSize(val)}
                            className={`flex flex-col items-center justify-center rounded-lg border py-2 text-center transition ${active
                                ? 'border-[#a9ad87] bg-[#a9ad87]/20 text-white'
                                : 'border-white/10 bg-white/[.04] text-white/60 hover:border-white/20 hover:text-white'
                              }`}
                          >
                            <span className="text-xs font-bold leading-none">{item.w}</span>
                            <span className="mt-1 text-[9px] text-[#a9ad87] leading-none">{item.l}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <label htmlFor="email" className="mb-2 block text-xs font-semibold text-white/80">Your email address</label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[.06] px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#a9ad87]"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center rounded-full bg-paper px-6 py-4 text-xs font-bold text-ink transition hover:bg-[#b9bd98] shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Locking in your spot...' : <>Join waitlist <ArrowRight size={15} className="ml-2" /></>}
                    </button>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-white/50">
                    <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#a9ad87]" /> No spam, drop invites only</span>
                    <span className="flex items-center gap-2"><Truck size={14} className="text-[#a9ad87]" /> Priority Drop #1 access</span>
                  </div>
                  <p className="mt-4 text-[10px] leading-5 text-white/35">Selected preference: <strong>{preferredSize}</strong>. Early access pass is sent directly to your inbox before public launch.</p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* COMING SOON - AESTHETIC DRIP TO COME BANNER */}
        <section id="coming-soon" className="relative overflow-hidden bg-[#070908] pt-14 pb-24 border-b border-white/10">
          {/* Streetwear Animated Marquee Ticker */}
          <div className="mb-14 overflow-hidden border-y border-white/10 bg-white/[.03] py-3.5 backdrop-blur-sm">
            <div className="animate-marquee whitespace-nowrap text-xs font-extrabold tracking-[.24em] text-[#a9ad87] uppercase">
              <span className="mx-6 flex items-center gap-3"><Sparkles size={14} className="text-white" /> MORE AESTHETIC DRIP TO COME</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6 flex items-center gap-3"><Flame size={14} className="text-white" /> DROP #02 IN THE VAULT</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6">480 GSM HEAVYWEIGHT FLEECE</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6">DOUBLE KNEE CARPENTER 46″ STACK</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6 flex items-center gap-3"><Layers size={14} className="text-white" /> MINERAL ACID WASH SERIES</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6 flex items-center gap-3"><Sparkles size={14} className="text-white" /> MORE AESTHETIC DRIP TO COME</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6 flex items-center gap-3"><Flame size={14} className="text-white" /> DROP #02 IN THE VAULT</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6">480 GSM HEAVYWEIGHT FLEECE</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6">DOUBLE KNEE CARPENTER 46″ STACK</span>
              <span className="mx-6 text-white/40">✦</span>
              <span className="mx-6 flex items-center gap-3"><Layers size={14} className="text-white" /> MINERAL ACID WASH SERIES</span>
              <span className="mx-6 text-white/40">✦</span>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-5 md:px-10">
            {/* Header / Intro */}
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#a9ad87]/30 bg-[#a9ad87]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[.22em] text-[#c9ce9f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#a9ad87] animate-pulse" />
                  In The Lab // Vault Preview
                </div>
                <h2 className="mt-4 font-display text-4xl font-black tracking-[-.05em] sm:text-6xl md:text-7xl lg:text-8xl">
                  AESTHETIC DRIP<br />
                  <span className="bg-gradient-to-r from-[#a9ad87] via-[#d6dab3] to-[#8f936f] bg-clip-text text-transparent">
                    TO COME.
                  </span>
                </h2>
              </div>
              <div className="max-w-md">
                <p className="text-sm leading-6 text-white/70">
                  We're not stopping at the first denim cut. The archive is expanding into a full oversized silhouette lineup: ultra-heavy fleece, double-knee workwear, and stone-washed grails.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#a9ad87]/30 bg-[#a9ad87]/15 px-3.5 py-1 text-xs font-bold text-[#a9ad87]">
                  <span>Future drops starting from ₹799</span>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#a9ad87]">
                  <span className="flex items-center gap-1.5"><Clock size={15} /> Early Access Queue Active</span>
                  <span>•</span>
                  <span>Limited Factory Batches</span>
                </div>
              </div>
            </div>

            {/* Showcase Cards Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingDrips.map((item, idx) => (
                <div
                  key={item.title}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[.02] transition-all duration-500 hover:border-[#a9ad87]/60 hover:bg-white/[.05] glow-drip"
                >
                  <div className="relative h-[290px] overflow-hidden bg-black/40 sm:h-[320px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:brightness-110 filter saturate-[.85]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/20" />

                    {/* Floating pill tags */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      {/* <span className="rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-white backdrop-blur-md border border-white/15">
                        {item.tag}
                      </span> */}
                      <span className="rounded-full bg-[#a9ad87] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink shadow-lg">
                        {item.badge}
                      </span>
                    </div>

                    {/* <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">
                        Status: <span className="text-[#a9ad87] font-semibold">{item.status}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-white/40">0{idx + 2}</span>
                    </div> */}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a9ad87]">{item.sub}</p>
                      <h3 className="mt-1 text-xl font-bold tracking-tight text-white group-hover:text-[#d7dcbc] transition">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-xs leading-5 text-white/60">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[11px] font-bold text-[#a9ad87]">{item.price || 'Starting from ₹799'}</span>
                      <button
                        onClick={scrollToWaitlist}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white transition hover:text-[#a9ad87] group-hover:translate-x-1"
                      >
                        Join Queue <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* VIP Drip Unlock Banner Callout */}
            <div className="mt-14 overflow-hidden rounded-2xl border border-[#a9ad87]/30 bg-gradient-to-r from-[#161a14] via-[#10130f] to-[#161a14] p-7 md:p-10 relative">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#a9ad87]/10 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a9ad87]">
                    <Bell size={15} />
                    <span>VIP Archive Alert</span>
                  </div>
                  <h4 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
                    NEVER MISS A LIMITED SILHOUETTE.
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-white/65 leading-relaxed">
                    Once Drop #01 closes, future aesthetics roll out in strictly limited numbered batches. Waitlist members get unlocked access 2 hours before Instagram announcements.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={scrollToWaitlist}
                    className="group inline-flex items-center rounded-full bg-paper px-6 py-3.5 text-xs font-bold text-ink transition hover:bg-[#a9ad87] hover:text-ink shadow-lg"
                  >
                    Get Priority Access <ArrowRight size={14} className="ml-2 transition group-hover:translate-x-1" />
                  </button>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-xs font-bold text-white transition hover:border-[#a9ad87] hover:text-[#a9ad87]"
                  >
                    <Instagram size={14} /> BTS Sneak Peeks
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <a href="#home" className="font-display text-2xl font-black tracking-[-1.5px]">baggy<span className="text-[#a9ad87]">Hood</span><span className="text-[#a9ad87]">.</span></a>
        <p className="text-[10px] uppercase tracking-[.16em] text-white/35">Built for the streets. Made for your fit.</p>
        <div className="flex items-center gap-4 text-white/60"><a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="transition hover:text-white"><Instagram size={17} /></a><a aria-label="YouTube" href="https://youtube.com" target="_blank" rel="noreferrer" className="transition hover:text-white"><Youtube size={17} /></a><a aria-label="WhatsApp" href="https://wa.me/" target="_blank" rel="noreferrer" className="transition hover:text-white"><MessageCircle size={17} /></a><span className="ml-2 text-[10px] text-white/30">© 2026 baggyHood</span></div>
      </footer>

      {/* Lightbox Modal for Fullscreen Angle Inspection */}
      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all sm:p-8"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-ink p-5 text-white shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 rounded-full ring-2 ring-white/30"
                  style={{ backgroundColor: shades[activeLightbox.shadeIndex].tone }}
                />
                <div>
                  <p className="text-xs font-semibold text-[#a9ad87] uppercase tracking-wider">
                    {shades[activeLightbox.shadeIndex].name}
                  </p>
                  <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {shades[activeLightbox.shadeIndex].angles[activeLightbox.angleIndex].title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden font-mono text-[10px] uppercase text-white/40 sm:inline-block">ESC to close</span>
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main Image Display with Navigation Arrows */}
            <div className="relative my-4 flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-black/40">
              <img
                src={shades[activeLightbox.shadeIndex].angles[activeLightbox.angleIndex].image}
                alt={shades[activeLightbox.shadeIndex].angles[activeLightbox.angleIndex].title}
                onError={(e) => {
                  const fallback = shades[activeLightbox.shadeIndex].angles[activeLightbox.angleIndex].fallback
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback
                  }
                }}
                className="max-h-[55vh] w-auto max-w-full rounded-lg object-contain"
              />

              {/* Prev / Next buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveLightbox((prev) => ({
                    ...prev,
                    angleIndex: (prev.angleIndex - 1 + shades[prev.shadeIndex].angles.length) % shades[prev.shadeIndex].angles.length,
                  }))
                }}
                aria-label="Previous angle"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-white hover:text-ink"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveLightbox((prev) => ({
                    ...prev,
                    angleIndex: (prev.angleIndex + 1) % shades[prev.shadeIndex].angles.length,
                  }))
                }}
                aria-label="Next angle"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-white hover:text-ink"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Bottom details & Thumbnails */}
            <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-white/70">
                  {shades[activeLightbox.shadeIndex].angles[activeLightbox.angleIndex].subtitle}
                </p>
              </div>

              {/* Angle thumbnails */}
              <div className="flex items-center gap-2">
                {shades[activeLightbox.shadeIndex].angles.map((ang, i) => (
                  <button
                    key={ang.id}
                    onClick={() => setActiveLightbox((prev) => ({ ...prev, angleIndex: i }))}
                    className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition ${activeLightbox.angleIndex === i
                        ? 'border-[#a9ad87] ring-1 ring-[#a9ad87]'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={ang.image}
                      alt={ang.title}
                      onError={(e) => {
                        if (e.currentTarget.src !== ang.fallback) {
                          e.currentTarget.src = ang.fallback
                        }
                      }}
                      className="h-full w-full object-cover object-bottom"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail & Inspection Modal */}
      {inspectProduct && (
        <div
          onClick={closeInspect}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md transition-all duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121614] shadow-2xl md:flex-row"
          >
            {/* Close button */}
            <button
              onClick={closeInspect}
              aria-label="Close details"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-white hover:text-ink"
            >
              <X size={16} />
            </button>

            {/* Left Image View */}
            <div className="relative aspect-[3/4] w-full md:w-1/2 overflow-hidden bg-black/50">
              <img
                src={inspectImage || inspectProduct.image}
                alt={inspectProduct.name}
                className="h-full w-full object-cover transition duration-300"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating badges */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-white/20 bg-black/85 px-3 py-1 text-[11px] font-black tracking-wider text-[#a9ad87] backdrop-blur-md">
                  {inspectProduct.price}
                </span>
                <span className="rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur-md">
                  {inspectProduct.category === 'denim' ? inspectProduct.size : `Size: ${inspectProduct.size}`}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-white/80 backdrop-blur-md">
                  {inspectProduct.silhouette}
                </span>
              </div>

              {/* Gallery angle switcher */}
              {inspectProduct.gallery && inspectProduct.gallery.length > 1 && (
                <div className="absolute top-4 left-4 z-20 flex gap-2 rounded-xl border border-white/15 bg-black/75 p-1.5 backdrop-blur-md">
                  {inspectProduct.gallery.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInspectImage(img)}
                      title={`View angle ${i + 1}`}
                      className={`h-11 w-11 overflow-hidden rounded-lg border-2 transition ${
                        (inspectImage || inspectProduct.image) === img
                          ? 'border-[#a9ad87] ring-1 ring-[#a9ad87] scale-105'
                          : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Information & Craftsmanship */}
            <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 sm:p-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#a9ad87]">
                  {inspectProduct.categoryLabel} // {inspectProduct.badge}
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {inspectProduct.name}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <span className="text-2xl font-black text-[#a9ad87]">
                    {inspectProduct.price}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white">
                    {inspectProduct.category === 'denim' ? inspectProduct.size : `Size: ${inspectProduct.size}`}
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/50">
                  Cut: <strong className="text-white">{inspectProduct.silhouette}</strong>
                </p>

                <p className="mt-4 text-xs leading-6 text-white/70">
                  {inspectProduct.description}
                </p>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/85">
                    Fabrication & Signature Specs
                  </h4>
                  <ul className="mt-3 grid gap-2.5">
                    {inspectProduct.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-white/70">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#a9ad87]/20 text-[#a9ad87]">
                          <Check size={11} className="stroke-[3]" />
                        </span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Footer / Droplist CTA */}
              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">Price &amp; Availability</p>
                  <p className="text-sm font-bold text-[#a9ad87]">{inspectProduct.price} • {inspectProduct.priceEstimate}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (inspectProduct.category === 'denim') {
                      const idx = shades.findIndex((s) =>
                        inspectProduct.name.toLowerCase().includes(s.name.toLowerCase().split(' ')[0])
                      )
                      if (idx !== -1) setSelectedShade(idx)
                    }
                    closeInspect()
                    scrollToWaitlist()
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-paper px-6 py-3 text-xs font-bold text-ink transition hover:bg-[#b9bd98]"
                >
                  Reserve This Fit <ArrowRight size={14} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

