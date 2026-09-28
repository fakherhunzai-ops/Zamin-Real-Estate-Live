export type BlogCategory = 'Buying' | 'Selling' | 'Area Guides';

export type BlogBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string };

export type BlogArticle = {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  tags: string[];
  content: BlogBlock[];
};

export const blogCategories: BlogCategory[] = ['Buying', 'Selling', 'Area Guides'];

export const blogArticles: BlogArticle[] = [
  {
    slug: 'hunza-valley-area-guide',
    title: 'Hunza Valley Area Guide: Where to Buy and Why',
    category: 'Area Guides',
    excerpt:
      'From orchard retreats in Gulmit to modern homes near Aliabad, here is a practical look at where to buy in Hunza Valley and what drives value.',
    author: 'Shazia Karim',
    role: 'Head of Sales',
    date: '18 Aug 2026',
    readTime: '7 min read',
    featured: true,
    image:
      'https://readdy.ai/api/search-image?query=Sweeping%20view%20of%20Hunza%20Valley%20in%20Gilgit%20Baltistan%20Pakistan%20with%20terraced%20green%20fields%2C%20apricot%20orchards%2C%20traditional%20stone%20houses%20and%20snow%20capped%20Rakaposhi%20peak%20under%20clear%20blue%20sky%2C%20warm%20golden%20afternoon%20light%2C%20travel%20editorial%20landscape%20photography%2C%20vibrant%20natural%20colours&width=1200&height=800&seq=zamin-blog-hunza-guide&orientation=landscape',
    tags: ['Hunza', 'Area Guide', 'Investment'],
    content: [
      {
        type: 'paragraph',
        text: 'Hunza is the most recognisable name in Gilgit-Baltistan property, and for good reason. The valley combines reliable tourism, strong community infrastructure and some of the most striking scenery in the country. But "buying in Hunza" can mean very different things depending on which village you choose.',
      },
      { type: 'heading', text: 'Understanding the valley in three parts' },
      {
        type: 'paragraph',
        text: 'Buyers usually group Hunza into Lower Hunza, Central Hunza and Upper Hunza (Gojal). Each has a different feel, price band and typical buyer. A few minutes of orientation saves months of searching.',
      },
      {
        type: 'list',
        items: [
          'Lower Hunza — closest to Gilgit city, easiest year-round access and the strongest demand for family homes.',
          'Central Hunza — the tourism heartland around Karimabad and Aliabad, where guesthouses and orchard plots command a premium.',
          'Upper Hunza — wide open, dramatic and increasingly popular with buyers seeking land for hospitality projects.',
        ],
      },
      { type: 'heading', text: 'What actually drives value' },
      {
        type: 'paragraph',
        text: 'Three factors move prices more than anything else: road access, reliable utilities and tourism footfall. A plot with clear road frontage near a known viewpoint will always outperform a similar plot further inland, even if the raw land is identical.',
      },
      {
        type: 'quote',
        text: 'In Hunza, a five-minute drive can change a property’s value by a third. Location is not a cliché here — it is the whole game.',
      },
      { type: 'heading', text: 'Practical buying notes' },
      {
        type: 'paragraph',
        text: 'Ownership in the valley is often held through community and family arrangements rather than a single modern title. Before committing, confirm the transfer history, involve the local community council where relevant, and have every document reviewed by someone who knows the area.',
      },
      {
        type: 'paragraph',
        text: 'If you are buying from overseas, work with a local representative who can physically inspect the plot, film it for you and verify ownership on the ground. Tours and phone calls cannot replace a walk along the boundary.',
      },
    ],
  },
  {
    slug: 'first-time-buyer-guide-gilgit-baltistan',
    title: 'First-Time Buyer? How to Buy Property in Gilgit-Baltistan',
    category: 'Buying',
    excerpt:
      'A step-by-step walkthrough of buying your first home — budgeting, shortlisting, verification and transfer — written for the region’s real market.',
    author: 'Ghulam Abbas',
    role: 'Founder & Principal Consultant',
    date: '12 Aug 2026',
    readTime: '8 min read',
    image:
      'https://readdy.ai/api/search-image?query=Young%20couple%20outside%20a%20traditional%20stone%20and%20wood%20house%20in%20a%20green%20mountain%20village%20in%20Gilgit%20Baltistan%20Pakistan%20holding%20a%20set%20of%20keys%2C%20happy%20expressions%2C%20warm%20afternoon%20light%2C%20lifestyle%20real%20estate%20photography%2C%20clean%20natural%20setting&width=1200&height=800&seq=zamin-blog-first-buyer&orientation=landscape',
    tags: ['Buying', 'Beginners', 'Documents'],
    content: [
      {
        type: 'paragraph',
        text: 'Buying your first property anywhere is a big step, and in Gilgit-Baltistan a little local knowledge goes a long way. The process is not complicated once you know the sequence, but the details matter.',
      },
      { type: 'heading', text: 'Start with a realistic budget' },
      {
        type: 'paragraph',
        text: 'Set two numbers before you look at a single listing: the maximum you can comfortably pay, and the hidden costs above the purchase price. Registration, transfer fees and minor legal charges are easy to forget.',
      },
      { type: 'heading', text: 'Shortlist, then inspect in person' },
      {
        type: 'paragraph',
        text: 'Photos help you filter, but always visit in daylight. Check water supply, electricity reliability, road access in winter and how the plot drains after rain. Walk the boundaries with the seller or owner present.',
      },
      { type: 'heading', text: 'Verify before you pay' },
      {
        type: 'list',
        items: [
          'Confirm the seller is the recognised owner and can legally transfer.',
          'Match the documents against the physical plot — size, boundaries and access.',
          'Check for any disputes, loans or family claims tied to the property.',
          'Agree the payment schedule in writing before handing over any money.',
        ],
      },
      { type: 'heading', text: 'Complete the transfer properly' },
      {
        type: 'paragraph',
        text: 'The final stage is the sale agreement and the mutation of records. Work with people who have completed transfers in the same area before, and keep copies of every signed page.',
      },
      {
        type: 'quote',
        text: 'The cheapest mistake to avoid is rushing the documents. A slow, careful transfer always costs less than a fast, messy one.',
      },
    ],
  },
  {
    slug: 'documents-to-verify-before-buying',
    title: 'Property Documents You Must Verify Before Buying',
    category: 'Buying',
    excerpt:
      'Ownership proof, mutation records, CNIC copies and more — the paperwork checklist that protects your money in Gilgit-Baltistan.',
    author: 'Ghulam Abbas',
    role: 'Founder & Principal Consultant',
    date: '05 Aug 2026',
    readTime: '6 min read',
    image:
      'https://readdy.ai/api/search-image?query=Close%20up%20of%20property%20ownership%20documents%20and%20a%20stamp%20on%20a%20wooden%20desk%20with%20reading%20glasses%20and%20a%20pen%2C%20soft%20warm%20natural%20light%2C%20professional%20business%20photography%2C%20clean%20minimal%20composition&width=1200&height=800&seq=zamin-blog-documents&orientation=landscape',
    tags: ['Buying', 'Documents', 'Legal'],
    content: [
      {
        type: 'paragraph',
        text: 'Most property disputes we see in the region start with paperwork that was never properly checked. A few hours of verification can save years of trouble.',
      },
      { type: 'heading', text: 'The core documents' },
      {
        type: 'list',
        items: [
          'Proof of ownership — the document that establishes who the recognised owner is.',
          'Mutation records — the official record of how the property changed hands over time.',
          'CNIC copies of the seller and any co-owners.',
          'A recent sale agreement or intent letter once terms are agreed.',
          'Site plan or boundary description where available.',
        ],
      },
      { type: 'heading', text: 'Match the paper to the ground' },
      {
        type: 'paragraph',
        text: 'It is not enough for documents to look complete. Walk the plot and compare the described size, boundaries and access road with what is actually there. Small mismatches are the earliest warning sign.',
      },
      { type: 'heading', text: 'Watch for red flags' },
      {
        type: 'paragraph',
        text: 'Be cautious if the seller cannot produce original documents, if ownership is split across several relatives without a clear agreement, or if you are pressured to pay before any verification. None of these are automatically disqualifying, but they demand care.',
      },
    ],
  },
  {
    slug: 'cost-to-buy-home-hunza',
    title: 'What Does It Really Cost to Buy a Home in Hunza?',
    category: 'Buying',
    excerpt:
      'Purchase price is only part of the picture. Here is a full breakdown of the costs buyers should plan for when purchasing in Hunza.',
    author: 'Nasreen Bano',
    role: 'Investment Advisor',
    date: '29 Jul 2026',
    readTime: '6 min read',
    image:
      'https://readdy.ai/api/search-image?query=Modern%20home%20exterior%20in%20a%20green%20mountain%20valley%20in%20Gilgit%20Baltistan%20Pakistan%20with%20a%20calculator%20and%20notebook%20on%20a%20nearby%20outdoor%20table%2C%20warm%20daylight%2C%20clean%20lifestyle%20finance%20photography&width=1200&height=800&seq=zamin-blog-hunza-cost&orientation=landscape',
    tags: ['Buying', 'Budget', 'Hunza'],
    content: [
      {
        type: 'paragraph',
        text: 'When buyers ask what a home in Hunza costs, the honest answer is a range — because the total depends on far more than the asking price of the property.',
      },
      { type: 'heading', text: 'Beyond the purchase price' },
      {
        type: 'list',
        items: [
          'Agency commission, typically 2.5% to 3% of the sale value.',
          'Registration and transfer charges.',
          'Minor legal and documentation costs.',
          'Any renovation or utility connections needed after handover.',
        ],
      },
      { type: 'heading', text: 'Location is the biggest lever' },
      {
        type: 'paragraph',
        text: 'A plot or home near the main tourism routes and viewpoints carries a meaningful premium over similar property a short distance inland. Decide early whether you are paying for views and footfall or for space and quiet.',
      },
      { type: 'heading', text: 'Plan a contingency' },
      {
        type: 'paragraph',
        text: 'Set aside a small buffer for the unexpected — a boundary issue, an extra connection fee or a repair discovered at handover. Buyers who budget for this rarely feel squeezed.',
      },
    ],
  },
  {
    slug: 'how-to-price-your-property',
    title: 'How to Price Your Property Correctly in Gilgit-Baltistan',
    category: 'Selling',
    excerpt:
      'Priced too high and it sits; too low and you lose money. Here is how to find the number that actually gets your property sold.',
    author: 'Shazia Karim',
    role: 'Head of Sales',
    date: '22 Jul 2026',
    readTime: '5 min read',
    image:
      'https://readdy.ai/api/search-image?query=Real%20estate%20agent%20and%20homeowner%20reviewing%20a%20property%20price%20chart%20on%20a%20tablet%20in%20a%20bright%20modern%20room%20with%20mountain%20views%20through%20the%20window%2C%20warm%20natural%20light%2C%20professional%20lifestyle%20photography&width=1200&height=800&seq=zamin-blog-pricing&orientation=landscape',
    tags: ['Selling', 'Pricing', 'Strategy'],
    content: [
      {
        type: 'paragraph',
        text: 'Pricing is the single decision that most affects how quickly your property sells. Get it right and you attract serious buyers within weeks. Get it wrong and even a beautiful home will sit untouched.',
      },
      { type: 'heading', text: 'Look at what actually sold' },
      {
        type: 'paragraph',
        text: 'Asking prices tell you little. Recent completed sales of comparable properties in the same area tell you almost everything. Start there and adjust for condition, access and views.',
      },
      { type: 'heading', text: 'The three-price approach' },
      {
        type: 'list',
        items: [
          'Your ideal price — the number you would love to achieve.',
          'Your target price — a realistic figure supported by comparable sales.',
          'Your floor price — the minimum you would genuinely accept.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Listing slightly above your target gives room to negotiate without drifting into unrealistic territory that scares buyers away.',
      },
      { type: 'heading', text: 'Review after three weeks' },
      {
        type: 'paragraph',
        text: 'If you have had plenty of views but no serious offers, the market is telling you something about the price. A small, early adjustment almost always beats a big reduction after months of no interest.',
      },
    ],
  },
  {
    slug: 'preparing-your-home-for-sale',
    title: 'Preparing Your Home for Sale: A 7-Step Checklist',
    category: 'Selling',
    excerpt:
      'Small, affordable improvements can add real value and speed up a sale. Here are the seven steps that matter most.',
    author: 'Imran Hussain',
    role: 'Rental & Property Manager',
    date: '15 Jul 2026',
    readTime: '5 min read',
    image:
      'https://readdy.ai/api/search-image?query=Bright%20tidy%20living%20room%20of%20a%20mountain%20home%20in%20Gilgit%20Baltistan%20Pakistan%20being%20prepared%20for%20sale%2C%20fresh%20cushions%2C%20clean%20windows%2C%20natural%20light%20streaming%20in%2C%20warm%20neutral%20interior%2C%20editorial%20real%20estate%20photography&width=1200&height=800&seq=zamin-blog-home-prep&orientation=landscape',
    tags: ['Selling', 'Presentation', 'Checklist'],
    content: [
      {
        type: 'paragraph',
        text: 'Presentation will not fix a wrong price, but it will absolutely win the comparison against a similar property down the road. The good news is that most of it costs very little.',
      },
      { type: 'heading', text: 'The seven steps' },
      {
        type: 'list',
        items: [
          'Declutter every room so buyers can see the space, not your belongings.',
          'Let in as much natural light as possible and clean every window.',
          'Fix small defects — dripping taps, cracked tiles, sticking doors.',
          'Neutralise strong colours and personal decor where practical.',
          'Tidy the garden, paths and any outdoor seating areas.',
          'Deep clean the kitchen and bathrooms, which sell homes.',
          'Arrange a tidy entrance — it is the very first impression.',
        ],
      },
      { type: 'heading', text: 'Presentation and photography go together' },
      {
        type: 'paragraph',
        text: 'Good photography turns these improvements into a listing that stops people scrolling. Bright, wide shots taken in daylight consistently outperform rushed phone photos.',
      },
    ],
  },
  {
    slug: 'selling-to-overseas-buyers',
    title: 'Selling to Overseas Buyers: What Local Sellers Should Know',
    category: 'Selling',
    excerpt:
      'Overseas buyers are a major force in Gilgit-Baltistan property. Here is how to market and sell to them with confidence.',
    author: 'Nasreen Bano',
    role: 'Investment Advisor',
    date: '08 Jul 2026',
    readTime: '6 min read',
    image:
      'https://readdy.ai/api/search-image?query=Peaceful%20mountain%20village%20scene%20in%20Gilgit%20Baltistan%20Pakistan%20at%20golden%20hour%20with%20traditional%20houses%20and%20terraced%20fields%2C%20warm%20cinematic%20landscape%20photography%2C%20serene%20atmosphere&width=1200&height=800&seq=zamin-blog-overseas&orientation=landscape',
    tags: ['Selling', 'Overseas', 'Marketing'],
    content: [
      {
        type: 'paragraph',
        text: 'A large share of demand for property in Gilgit-Baltistan comes from families and investors living overseas. Selling to them is very achievable — it just requires a different kind of presentation.',
      },
      { type: 'heading', text: 'Remote buyers rely on evidence' },
      {
        type: 'paragraph',
        text: 'An overseas buyer cannot walk the boundary or stand in the kitchen. They decide based on what you show them. Clear photos, a short walk-through video and honest written details build the trust that a viewing normally would.',
      },
      { type: 'heading', text: 'Be transparent about the practical details' },
      {
        type: 'list',
        items: [
          'Road access and how it changes in winter.',
          'Water and electricity reliability.',
          'How ownership and transfer work for a buyer abroad.',
          'Any recurring community or maintenance obligations.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Buyers who feel informed move quickly. Buyers who feel something is being hidden walk away, usually without telling you why.',
      },
      {
        type: 'quote',
        text: 'For a remote buyer, documentation is not boring — it is the product. The cleaner your paperwork, the faster your sale.',
      },
    ],
  },
  {
    slug: 'skardu-area-guide',
    title: 'Skardu Area Guide: Lakes, Land and Investment Potential',
    category: 'Area Guides',
    excerpt:
      'Skardu’s lakes, deserts and mountains are turning it into a serious property market. Here is where buyers are looking and why.',
    author: 'Nasreen Bano',
    role: 'Investment Advisor',
    date: '01 Jul 2026',
    readTime: '7 min read',
    image:
      'https://readdy.ai/api/search-image?query=Turquoise%20lake%20with%20sandy%20shores%20and%20snow%20capped%20Karakoram%20mountains%20near%20Skardu%20in%20Gilgit%20Baltistan%20Pakistan%2C%20bright%20clear%20day%2C%20wide%20cinematic%20travel%20landscape%20photography%2C%20vibrant%20natural%20colours&width=1200&height=800&seq=zamin-blog-skardu-guide&orientation=landscape',
    tags: ['Skardu', 'Area Guide', 'Investment'],
    content: [
      {
        type: 'paragraph',
        text: 'Skardu has quietly become one of the most interesting property markets in Gilgit-Baltistan. Its combination of lakes, cold desert and access to the high mountains draws a steady and growing flow of visitors.',
      },
      { type: 'heading', text: 'Where buyers are looking' },
      {
        type: 'list',
        items: [
          'Skardu city — the hub for services, schools and year-round living.',
          'Nearby lakeside areas — premium for hospitality and tourism projects.',
          'The wider Baltistan valleys — larger land parcels for those wanting space.',
        ],
      },
      { type: 'heading', text: 'The tourism angle' },
      {
        type: 'paragraph',
        text: 'Tourism is the engine here. Guesthouses and small hotels see strong seasonal demand, which makes well-located land near known attractions attractive to investors planning a hospitality build.',
      },
      { type: 'heading', text: 'What to be careful about' },
      {
        type: 'paragraph',
        text: 'Seasonality matters. A property that earns well in summer may be quiet in winter, so factor that into any yield calculation. And, as everywhere in the region, verify ownership carefully before committing.',
      },
    ],
  },
  {
    slug: 'living-in-gilgit-guide',
    title: 'Living in Gilgit: Neighbourhoods, Costs and Lifestyle',
    category: 'Area Guides',
    excerpt:
      'Thinking of making Gilgit home? Here is a grounded look at neighbourhoods, day-to-day costs and what the lifestyle is really like.',
    author: 'Imran Hussain',
    role: 'Rental & Property Manager',
    date: '24 Jun 2026',
    readTime: '6 min read',
    image:
      'https://readdy.ai/api/search-image?query=Gilgit%20city%20in%20Gilgit%20Baltistan%20Pakistan%20with%20green%20trees%2C%20the%20river%20and%20dramatic%20mountain%20peaks%20rising%20behind%2C%20clear%20sky%2C%20warm%20daylight%2C%20wide%20travel%20lifestyle%20landscape%20photography&width=1200&height=800&seq=zamin-blog-living-gilgit&orientation=landscape',
    tags: ['Gilgit', 'Area Guide', 'Lifestyle'],
    content: [
      {
        type: 'paragraph',
        text: 'Gilgit is the administrative and commercial centre of the region, which makes it the practical choice for families who want services, schools and connectivity alongside the mountains.',
      },
      { type: 'heading', text: 'Choosing a neighbourhood' },
      {
        type: 'paragraph',
        text: 'The city centre offers the easiest access to markets, offices and transport. Surrounding areas trade a little convenience for more space, quieter streets and, often, better views.',
      },
      { type: 'heading', text: 'Day-to-day costs' },
      {
        type: 'paragraph',
        text: 'Rents and property prices in the centre run higher than the surrounding valleys, while utilities and daily living costs tend to be moderate. Heating in winter is the cost most newcomers underestimate.',
      },
      { type: 'heading', text: 'The lifestyle' },
      {
        type: 'paragraph',
        text: 'Life here is calmer and more community-focused than in the big cities, with extraordinary nature on the doorstep. If you value space, air and access to the outdoors over endless options for nightlife, Gilgit is hard to beat.',
      },
    ],
  },
];