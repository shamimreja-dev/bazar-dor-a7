
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

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    const products: Product[] = Array.isArray(data)
      ? data
      : data.products ?? [];

    return products.find((product) => product.slug === slug) ?? null;
  } catch {
    return null;
  }
}

function taka(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

function unitName(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "টি",
    pcs: "টি",
  };

  return units[unit] ?? unit;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8faf5] px-5 py-20 text-center">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 shadow-sm">
          <div className="text-6xl">🔎</div>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            পণ্যটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="mt-3 text-gray-500">
            পণ্যটি মুছে ফেলা হয়েছে অথবা ঠিকানা ভুল।
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white"
          >
            হোম পেজে ফিরে যাও
          </Link>
        </div>
      </main>
    );
  }

  const marketPrices = product.markets ?? [];
  const prices = marketPrices.flatMap((market) => [
    market.min,
    market.max,
  ]);

  const minimum = prices.length
    ? Math.min(...prices)
    : product.today;

  const maximum = prices.length
    ? Math.max(...prices)
    : product.today;

  const average = marketPrices.length
    ? Math.round(
        marketPrices.reduce(
          (total, market) => total + (market.min + market.max) / 2,
          0,
        ) / marketPrices.length,
      )
    : product.today;

  const changeColor =
    product.change.dir === "up"
      ? "text-red-600 bg-red-50"
      : product.change.dir === "down"
        ? "text-green-700 bg-green-50"
        : "text-gray-600 bg-gray-100";

  return (
    <main className="min-h-screen bg-[#f8faf5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-medium text-green-800 hover:underline"
        >
          ← হোম পেজ
        </Link>

        <section className="mt-6 grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
          <div className="flex min-h-72 items-center justify-center rounded-3xl bg-gradient-to-br from-green-100 to-amber-50 p-8">
            <div className="text-center">
              <div className="text-8xl sm:text-9xl">
                {product.image || product.categoryIcon || "🛒"}
              </div>
              <p className="mt-5 inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-green-800">
                {product.categoryNameBn}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-green-700">
              আজকের বাজার দর
            </p>

            <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.nameBn}
            </h1>

            <p className="mt-3 text-gray-500">
              প্রতি {unitName(product.unit)}-এর বর্তমান মূল্য
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-extrabold text-green-800 sm:text-5xl">
                ৳{taka(product.today)}
              </span>
              <span className="pb-1 text-gray-500">
                / {unitName(product.unit)}
              </span>
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-3 py-2 text-sm font-semibold ${changeColor}`}
              >
                {product.change.dir === "up"
                  ? "▲ দাম বেড়েছে"
                  : product.change.dir === "down"
                    ? "▼ দাম কমেছে"
                    : "● দাম অপরিবর্তিত"}{" "}
                {taka(product.change.pct)}%
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
                <p className="mt-2 text-xl font-bold text-green-800">
                  ৳{taka(minimum)}
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-sm text-gray-500">গড় দাম</p>
                <p className="mt-2 text-xl font-bold text-blue-800">
                  ৳{taka(average)}
                </p>
              </div>

              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
                <p className="mt-2 text-xl font-bold text-orange-800">
                  ৳{taka(maximum)}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-gray-500">
              বাজার ও সময় অনুযায়ী দাম পরিবর্তিত হতে পারে।
              কেনার আগে স্থানীয় বাজারে দাম যাচাই করে নিন।
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🏪 বাজারভিত্তিক দাম
            </h2>
            <p className="mt-2 text-gray-500">
              বিভিন্ন বাজারে এই পণ্যের সর্বনিম্ন ও সর্বোচ্চ দাম।
            </p>
          </div>

          {marketPrices.length === 0 ? (
            <p className="mt-6 rounded-xl bg-gray-50 p-5 text-gray-500">
              বাজারের দামের তথ্য এখন পাওয়া যাচ্ছে না।
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-sm text-gray-500">
                    <th className="rounded-l-xl px-4 py-4">বাজার</th>
                    <th className="px-4 py-4">বিভাগ</th>
                    <th className="px-4 py-4">সর্বনিম্ন</th>
                    <th className="rounded-r-xl px-4 py-4">সর্বোচ্চ</th>
                  </tr>
                </thead>

                <tbody>
                  {marketPrices.map((market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className="border-b last:border-0 hover:bg-green-50/50"
                    >
                      <td className="px-4 py-4 font-semibold text-gray-800">
                        {market.market}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {market.division}
                      </td>
                      <td className="px-4 py-4 font-semibold text-green-700">
                        ৳{taka(market.min)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-orange-700">
                        ৳{taka(market.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-sm text-gray-500">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
      </div>
    </main>
  );
}