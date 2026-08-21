// ─── Blog Content Layer ────────────────────────────────────────────────────────────────────
// Static content for Phase 3. Phase 10 migrates to MDX files.
// Each article is a self-contained object — no CMS dependency.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  readingTimeMinutes: number;
  author: string;
  tags: string[];
  content: BlogSection[];
}

export interface BlogSection {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'callout' | 'tip';
  text?: string;
  items?: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-name-your-startup',
    title: 'How to Name Your Startup: A Practical Framework',
    description:
      'A step-by-step guide to choosing a startup name that is memorable, available, and built to last. Covers brand scoring, domain strategy, and common mistakes.',
    datePublished: '2025-01-15',
    dateModified: '2025-07-01',
    readingTimeMinutes: 8,
    author: 'Domain Finder Team',
    tags: ['naming', 'branding', 'startups', 'domains'],
    content: [
      {
        type: 'p',
        text: 'Naming a startup is one of the highest-leverage decisions you will make. A great name compounds over time — it makes every marketing dollar work harder, every word-of-mouth referral stickier, and every investor pitch more memorable.',
      },
      {
        type: 'h2',
        text: 'The five properties of a great startup name',
      },
      {
        type: 'ul',
        items: [
          'Memorable — two to three syllables, distinct phoneme pattern',
          'Pronounceable — anyone can say it correctly on first attempt',
          'Spellable — heard once, typed correctly',
          'Available — .com domain and trademark clear',
          'Scalable — does not box you into a single product or geography',
        ],
      },
      {
        type: 'h2',
        text: 'The three naming strategies that work',
      },
      {
        type: 'h3',
        text: '1. Invented words (highest ceiling)',
      },
      {
        type: 'p',
        text: 'Spotify, Xerox, Kodak — invented words have no prior associations to fight against. They are hard to trademark-conflict and easy to own globally. The downside: they require more marketing investment to build meaning.',
      },
      {
        type: 'h3',
        text: '2. Metaphors (fastest meaning transfer)',
      },
      {
        type: 'p',
        text: 'Amazon (vast, everything), Apple (approachable, human), Stripe (clean, precise). A well-chosen metaphor transfers an entire emotional landscape instantly. The risk: the metaphor can feel dated or limiting as you scale.',
      },
      {
        type: 'h3',
        text: '3. Compound words (clearest positioning)',
      },
      {
        type: 'p',
        text: 'Facebook, YouTube, Salesforce. Two familiar words combined create immediate comprehension. The challenge: .com domains for compound words are almost always taken.',
      },
      {
        type: 'h2',
        text: 'Domain strategy: beyond .com',
      },
      {
        type: 'p',
        text: '.com remains the gold standard — it carries trust signals that no other TLD has fully replicated. But the landscape has shifted. .io is now widely accepted in tech. .ai signals artificial intelligence focus. .co is clean and professional.',
      },
      {
        type: 'callout',
        text: 'Rule of thumb: if your .com is taken and costs more than $5,000, consider a different name rather than a different TLD. The brand confusion cost of a non-.com is real and compounds over years.',
      },
      {
        type: 'h2',
        text: 'The five mistakes to avoid',
      },
      {
        type: 'ol',
        items: [
          'Choosing a name that is hard to spell from sound alone',
          'Picking a name that is too similar to an existing trademark',
          'Using hyphens or numbers in your domain',
          'Choosing a name that limits your future product scope',
          'Optimising for cleverness over clarity',
        ],
      },
      {
        type: 'tip',
        text: 'Test your shortlist: say each name out loud to five people who have never heard it. Ask them to spell it. If more than one person misspells it, reconsider.',
      },
    ],
  },
  {
    slug: 'best-domain-extensions-for-startups',
    title: 'Best Domain Extensions for Startups in 2025',
    description:
      'A data-driven comparison of .com, .io, .co, .ai, .app, and .dev for startup founders. Covers trust signals, pricing, availability, and when to use each.',
    datePublished: '2025-02-10',
    dateModified: '2025-07-01',
    readingTimeMinutes: 6,
    author: 'Domain Finder Team',
    tags: ['domains', 'TLD', 'startups', 'branding'],
    content: [
      {
        type: 'p',
        text: 'The domain extension you choose sends a signal before anyone reads a single word of your copy. Here is a practical breakdown of every TLD worth considering in 2025.',
      },
      {
        type: 'h2',
        text: '.com — still the default',
      },
      {
        type: 'p',
        text: '.com carries 30 years of trust. Users default to typing .com. Email deliverability is highest on .com. If you can get a clean .com for under $2,000, do it.',
      },
      {
        type: 'h2',
        text: '.io — the developer favourite',
      },
      {
        type: 'p',
        text: 'Originally the country code for British Indian Ocean Territory, .io became the de facto TLD for developer tools and SaaS products. GitHub, Notion, and Linear all used .io early. Pricing: $35–$50/yr.',
      },
      {
        type: 'h2',
        text: '.ai — the signal of the moment',
      },
      {
        type: 'p',
        text: 'If your product has any AI component, .ai immediately communicates it. The downside: it is expensive ($60–$100/yr), and the signal may feel dated as AI becomes ubiquitous.',
      },
      {
        type: 'h2',
        text: '.co — clean and professional',
      },
      {
        type: 'p',
        text: '.co is the closest alternative to .com in terms of trust and recognition. It is used by AngelList (angel.co) and many Y Combinator companies. Pricing: $25–$35/yr.',
      },
      {
        type: 'h2',
        text: '.app and .dev — Google-backed clarity',
      },
      {
        type: 'p',
        text: '.app and .dev are Google-operated TLDs with mandatory HTTPS. They are excellent for product-specific domains (myapp.app) but less suited as primary brand domains.',
      },
      {
        type: 'callout',
        text: 'Decision framework: (1) Can you get the .com? Take it. (2) Is your audience technical? .io is fine. (3) Is AI core to your product? Consider .ai. (4) Otherwise: .co is your best alternative.',
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS;
}
