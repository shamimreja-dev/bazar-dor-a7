
import Link from "next/link";

const API_URL = "https://api.api-store.workers.dev/api/bazardor";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

const taka = (value: number) =>
  `${new Intl.NumberFormat("bn-BD").format(value)} টাকা`;

const units: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
};

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data) ? data : data.products ?? [];
  } catch {
    return [];
  }
}

function PriceChange({ product }: { product: Product }) {
  const direction = product.change?.dir ?? "flat";
  const percentage = product.change?.pct ?? 0;

  if (direction === "up") {
    return (
      <span className="change-badge change-up">
        ▲ {percentage.toLocaleString("bn-BD")}%
      </span>
    );
  }

  if (direction === "down") {
    return (
      <span className="change-badge change-down">
        ▼ {percentage.toLocaleString("bn-BD")}%
      </span>
    );
  }

  return <span className="change-badge change-flat">— ০.০%</span>;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card"
    >
      <div className="product-image">
        <span>{product.image || product.categoryIcon || "🛒"}</span>
        <span className="product-category">
          {product.categoryNameBn}
        </span>
      </div>

      <div className="product-info">
        <h3>{product.nameBn}</h3>
        <p className="product-unit">
          {units[product.unit] || `প্রতি ${product.unit}`}
        </p>

        <div className="price-divider" />

        <div className="price-row">
          <div>
            <p className="price-label">আজকের দাম</p>
            <p className="product-price">{taka(product.today)}</p>
          </div>

          <PriceChange product={product} />
        </div>

        <div className="card-footer">
          <span>বিস্তারিত দেখুন</span>
          <span aria-hidden="true">↗</span>
        </div>
      </div>
    </Link>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  id,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  id?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="content-section" id={id}>
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">বাজারের সর্বশেষ আপডেট</p>
          <h2>{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        {id && (
          <span className="section-count">
            {products.length.toLocaleString("bn-BD")}টি পণ্য
          </span>
        )}
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const products = await getProducts();

  const risers = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  const categories = Array.from(
    new Map(
      products.map((product) => [
        product.category,
        {
          slug: product.category,
          name: product.categoryNameBn,
          icon: product.categoryIcon,
        },
      ])
    ).values()
  );

  const tickerProducts = products.length
    ? [...products, ...products]
    : [];

  return (
    <main>
      <header className="site-header">
        <div className="header-main container">
          <Link href="/" className="brand">
            <span className="brand-icon">🛒</span>
            <span>
              <strong>বাজার দর</strong>
              <small>
                {new Date().toLocaleDateString("bn-BD", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Dhaka",
                })}
              </small>
            </span>
          </Link>

          <div className="header-note">
            <span className="live-dot" />
            প্রতিদিনের বাজারদর, এক নজরে
          </div>

          <div className="auth-links">
            <Link href="/signin" className="signin-link">
              সাইন ইন
            </Link>
            <Link href="/signup" className="signup-link">
              সাইন আপ <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="category-nav">
          <nav className="container category-links" aria-label="পণ্যের বিভাগ">
            <Link href="/" className="category-link active">
              সব পণ্য
            </Link>

            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="category-link"
              >
                {category.icon} {category.name}
              </Link>
            ))}
          </nav>
        </div>

        {products.length > 0 && (
          <div className="ticker">
            <div className="ticker-label">বাজার আপডেট</div>
            <div className="ticker-window">
              <div className="ticker-track">
                {tickerProducts.map((product, index) => (
                  <span
                    className="ticker-item"
                    key={`${product.id}-${index}`}
                  >
                    <span>{product.image}</span>
                    <strong>{product.nameBn}</strong>
                    <span>{taka(product.today)}</span>
                    <PriceChange product={product} />
                    <span className="ticker-separator">✳</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span className="live-dot" />
              আপনার প্রতিদিনের বাজার সহযোগী
            </span>

            <h1>
              বাজারের সঠিক ধারণা,
              <br />
              <span>সাশ্রয়ী কেনাকাটা।</span>
            </h1>

            <p className="hero-description">
              চাল, ডাল, সবজি, মাছসহ নিত্যপ্রয়োজনীয় পণ্যের
              আজকের দাম জানুন। বিভিন্ন বাজারের দামের তুলনা
              করে নিন আপনার কেনাকাটার সঠিক সিদ্ধান্ত।
            </p>

            <div className="hero-actions">
              <a href="#সব-পণ্য" className="primary-button">
                সব পণ্যের দাম দেখুন <span>↓</span>
              </a>
              <span className="hero-trust">✓ সহজ · দ্রুত · এক নজরে</span>
            </div>

            <div className="hero-stats">
              <div>
                <strong>{products.length.toLocaleString("bn-BD")}+</strong>
                <span>নিত্যপণ্য</span>
              </div>
              <div className="stats-divider" />
              <div>
                <strong>
                  {new Set(products.flatMap((p) => p.markets ?? []).map((m) => m.market)).size.toLocaleString("bn-BD")}+
                </strong>
                <span>বাজারের তথ্য</span>
              </div>
              <div className="stats-divider" />
              <div>
                <strong>২৪/৭</strong>
                <span>তথ্য দেখুন</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-visual-label">
              <span className="live-dot" />
              আজকের বাজার
            </div>

            <div className="hero-emoji hero-rice">🍚</div>
            <div className="hero-emoji hero-vegetables">🥬</div>
            <div className="hero-emoji hero-potato">🥔</div>
            <div className="hero-emoji hero-fish">🐟</div>
            <div className="hero-emoji hero-onion">🧅</div>

            <div className="hero-center">
              <span>🛒</span>
              <strong>বাজার দর</strong>
              <small>দাম জানুন, সাশ্রয় করুন</small>
            </div>

            <div className="floating-price">
              <span>🍚 স্বর্ণমাছি চাল</span>
              <strong>১৪৮ টাকা <small>/ কেজি</small></strong>
              <em>▲ ২.১%</em>
            </div>
          </div>
        </div>
      </section>

      <div className="container market-notice">
        <span className="notice-icon">ℹ</span>
        <p>
          বাজারদর স্থান ও সময় অনুযায়ী পরিবর্তিত হতে পারে।
          কেনার আগে স্থানীয় বাজারে দাম যাচাই করুন।
        </p>
      </div>

      <div className="container home-content">
        {products.length === 0 ? (
          <div className="empty-products">
            <span>🛒</span>
            <h2>পণ্যের তথ্য লোড করা যায়নি</h2>
            <p>ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।</p>
            <Link href="/" className="primary-button">
              আবার চেষ্টা করুন ↻
            </Link>
          </div>
        ) : (
          <>
            <ProductSection
              title="আজ দাম বেড়েছে ▲"
              subtitle="যেসব পণ্যের দাম গতকালের তুলনায় বেড়েছে"
              products={risers}
            />

            <ProductSection
              title="আজ দাম কমেছে ▼"
              subtitle="যেসব পণ্যের দাম গতকালের তুলনায় কমেছে"
              products={fallers}
            />

            <ProductSection
              id="সব-পণ্য"
              title="সব পণ্য"
              subtitle="নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম এক জায়গায়"
              products={products}
            />
          </>
        )}
      </div>

      <footer className="site-footer">
        <div className="container footer-inner">
          <Link href="/" className="footer-brand">
            🛒 <strong>বাজার দর</strong>
            <span>— প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
          </Link>
          <p>
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
          <span className="copyright">
            © ২০২৬ বাজার দর
          </span>
        </div>
      </footer>
    </main>
  );
}