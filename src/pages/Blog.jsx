import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

// 🏺 Local Metal Images Import from src/assets/
import metal1 from '../assets/metal1.png';
import metal2 from '../assets/metal2.png';
import metal3 from '../assets/metal3.png';
import metal4 from '../assets/metal4.png';
import metal5 from '../assets/metal5.png';
import metal6 from '../assets/metal6.png';
import metal7 from '../assets/metal7.png';
import metal8 from '../assets/metal8.png';
import metal9 from '../assets/metal9.png';
import metal10 from '../assets/metal10.png';

const BLOG_CATEGORIES = ['All', 'Moradabad Heritage', 'Metal Crafts', 'Wedding Trays', 'Corporate Hampers', 'Festive Baskets'];

const BLOG_POSTS = [
  {
    id: 1,
    category: 'Moradabad Heritage',
    title: 'Moradabad Handcrafted Brass Trunks: The Timeless Backbone of Luxury Hampers',
    excerpt: 'Explore how centuries of metal casting and hand-carving from Moradabad create durable heirloom trunks that elevate dry fruit and sweet presentations.',
    author: 'Handy Hampers Studio',
    date: 'Oct 08, 2026',
    readTime: '5 min read',
    image: metal1,
    featured: true,
  },
  {
    id: 2,
    category: 'Metal Crafts',
    title: 'The Charm of Wire-Mesh Baskets: Lightweight Elegance for Modern Gifting',
    excerpt: 'Lattice and cage wire metallic baskets bring an airy, contemporary aesthetic to artisanal snack arrangements and festive giveaways.',
    author: 'Aisha Khan',
    date: 'Oct 05, 2026',
    readTime: '4 min read',
    image: metal2,
    featured: false,
  },
  {
    id: 3,
    category: 'Wedding Trays',
    title: 'Golden Shagun Platters: Setting New Benchmarks in Indian Wedding Trousseau',
    excerpt: 'From ring ceremonies to bridal trousseau display, polished brass flat platters make every gifting item look royal and photogenic.',
    author: 'Simran Walia',
    date: 'Sep 29, 2026',
    readTime: '6 min read',
    image: metal3,
    featured: false,
  },
  {
    id: 4,
    category: 'Corporate Hampers',
    title: 'Executive Desk Trays: Premium Metal Organizers for VIP Corporate Swag',
    excerpt: 'Why Fortune companies are ditching cardboard boxes for reusable brass and metallic crates that double up as executive desktop storage.',
    author: 'Rahul Verma',
    date: 'Sep 24, 2026',
    readTime: '5 min read',
    image: metal4,
    featured: false,
  },
  {
    id: 5,
    category: 'Moradabad Heritage',
    title: 'The Art of Antique Gold Lacquer: Preserving Shine and Preventing Tarnish',
    excerpt: 'A behind-the-scenes look at how clear food-safe lacquer coatings protect brass gift baskets from oxidation while retaining their rich hue.',
    author: 'Handy Hampers Team',
    date: 'Sep 18, 2026',
    readTime: '4 min read',
    image: metal5,
    featured: false,
  },
  {
    id: 6,
    category: 'Festive Baskets',
    title: 'Diwali Saffron & Sweet Hampers in Hand-Hammered Oval Metal Caddies',
    excerpt: 'How handcrafted hammered textures create festive warmth when paired with traditional mithai, scented candles, and brass diyas.',
    author: 'Pooja Sharma',
    date: 'Sep 12, 2026',
    readTime: '4 min read',
    image: metal6,
    featured: false,
  },
  {
    id: 7,
    category: 'Metal Crafts',
    title: 'Silver Finish vs Antique Gold: Choosing the Right Metallic Tone for Gifting',
    excerpt: 'Understanding the aesthetic difference between cool nickel-silver platters and royal warm gold hampers for corporate and festive occasions.',
    author: 'Handy Hampers Studio',
    date: 'Aug 30, 2026',
    readTime: '5 min read',
    image: metal7,
    featured: false,
  },
  {
    id: 8,
    category: 'Wedding Trays',
    title: 'Handle-Equipped Metal Hampers: Seamless Mobility for Grand Indian Celebrations',
    excerpt: 'Ergonomic arched handles combined with ornate metal wire structures ensure effortless serving and trousseau presentation during weddings.',
    author: 'Neha Kapoor',
    date: 'Aug 22, 2026',
    readTime: '3 min read',
    image: metal8,
    featured: false,
  },
  {
    id: 9,
    category: 'Festive Baskets',
    title: 'Compact Metallic Dry Fruit Jars & Basket Sets for Doorstep PAN India Delivery',
    excerpt: 'Durable, shatterproof metallic gifting units engineered specifically to withstand long-distance courier transit without breakage.',
    author: 'Vikram Mehra',
    date: 'Aug 14, 2026',
    readTime: '4 min read',
    image: metal9,
    featured: false,
  },
  {
    id: 10,
    category: 'Moradabad Heritage',
    title: 'Supporting Moradabad Artisans: Preserving Traditional Metalwork in Gifting',
    excerpt: 'Every metal hamper crafted in Moradabad directly supports multigenerational master metal-smiths sustaining their generational craft heritage.',
    author: 'Handy Hampers Studio',
    date: 'Aug 05, 2026',
    readTime: '5 min read',
    image: metal10,
    featured: false,
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-14 space-y-12">
        {/* HEADER SECTION */}
        <section className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200">
            Handy Hampers Journal
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#2C1A11] tracking-tight">
            Moradabad Metal Art & <span className="text-amber-600">Gifting Guides</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Moradabad ke handcrafted brass hampers, royal wedding trousseau baskets aur premium metal gifting ki complete stories aur insights yahan explore karein.
          </p>
        </section>

        {/* FEATURED STORY SHOWCASE */}
        {featuredPost && (
          <section className="bg-white rounded-3xl p-5 md:p-8 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 h-64 md:h-96 rounded-2xl overflow-hidden bg-amber-50 relative group">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-[#2C1A11] text-amber-300 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                Featured Story
              </span>
            </div>

            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700">
                <span className="bg-amber-50 px-2.5 py-1 rounded-md">{featuredPost.category}</span>
                <span>•</span>
                <span className="text-stone-400">{featuredPost.readTime}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-[#2C1A11] leading-tight hover:text-amber-600 transition-colors cursor-pointer">
                {featuredPost.title}
              </h2>
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-[11px] text-stone-500 font-semibold">
                <span>By {featuredPost.author}</span>
                <span>{featuredPost.date}</span>
              </div>
            </div>
          </section>
        )}

        {/* CATEGORY FILTER TABS */}
        <section className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 py-2">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* ARTICLES GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="h-52 overflow-hidden bg-stone-100 relative">
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#2C1A11] text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs z-10">
                    {post.category}
                  </span>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-sm md:text-base font-black text-[#2C1A11] line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-400">{post.author}</span>
                  <span className="text-xs font-black text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer">
                    Read Story →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* NEWSLETTER BANNER */}
        <section className="bg-gradient-to-r from-[#2C1A11] to-amber-950 text-white rounded-3xl p-6 md:p-10 shadow-lg text-center space-y-4">
          <span className="text-2xl block">📬</span>
          <h3 className="text-xl md:text-2xl font-black text-amber-50">
            Stay Updated on Moradabad Metal Crafts & Launches
          </h3>
          <p className="text-xs md:text-sm text-stone-300 max-w-lg mx-auto">
            Hamare latest metal hamper collections, royal brass platters aur festive bulk deals ke updates seedhe pane ke liye judiye.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="w-full bg-white/10 text-white text-xs px-4 py-3 rounded-xl border border-amber-300/30 outline-none placeholder:text-stone-400 focus:border-amber-400"
            />
            <button className="w-full sm:w-auto shrink-0 bg-amber-500 hover:bg-amber-600 text-[#2C1A11] font-black text-xs px-5 py-3 rounded-xl shadow-xs transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
