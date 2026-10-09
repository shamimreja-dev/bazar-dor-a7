
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

const API_URL = "https://api.api-store.workers.dev/api/bazardor";

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
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

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

function LoadingSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-gray-100 bg-white p-6"
        >
          <div className="h-16 w-16 rounded-2xl bg-gray-200" />
          <div className="mt-5 h-5 w-2/3 rounded bg-gray-200" />
          <div className="mt-4 h-8 w-1/2 rounded bg-gray-200" />
          <div className="mt-5 h-4 w-full rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `${API_URL}/products?category=${encodeURIComponent(slug)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        const result: Product[] = Array.isArray(data)
          ? data
          : data.products ?? [];

        if (!cancelled) {
          setProducts(result);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "low") {
      result.sort((a, b) => a.today - b.today);
    } else if (sort === "high") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sort]);

  const categoryName = products[0]?.categoryNameBn ?? slug;
  const categoryIcon = products[0]?.categoryIcon ?? "🛒";

  return (
    <main className="min-h-screen bg-[#f8faf5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="font-medium text-green-800 hover:underline"
        >
          ← হোম পেজ
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-to-r from-green-800 to-green-600 p-7 text-white sm:p-10">
          <div className="text-5xl">{categoryIcon}</div>
          <p className="mt-5 text-sm font-semibold text-green-100">
            বাজার দর ক্যাটাগরি
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {categoryName}
          </h1>
          <p className="mt-3 max-w-xl text-green-50">
            এই ক্যাটাগরির পণ্যের বর্তমান দাম দেখুন এবং নিজের প্রয়োজন অনুযায়ী
            সাজিয়ে নিন।
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                পণ্যের তালিকা
              </h2>
              {!loading && !error && (
                <p className="mt-1 text-sm text-gray-500">
                  মোট {taka(sortedProducts.length)}টি পণ্য
                </p>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
              দাম সাজান
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-600"
              >
                <option value="default">ডিফল্ট</option>
                <option value="low">দাম: কম থেকে বেশি</option>
                <option value="high">দাম: বেশি থেকে কম</option>
              </select>
            </label>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">⚠️</div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                পণ্য লোড করা যায়নি
              </h3>
              <p className="mt-2 text-gray-500">
                ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white"
              >
                আবার চেষ্টা করো
              </button>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">🧺</div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                এই ক্যাটাগরিতে কোনো পণ্য নেই
              </h3>
              <p className="mt-2 text-gray-500">
                অন্য ক্যাটাগরি থেকে পণ্য খুঁজে দেখো।
              </p>
              <Link
                href="/"
                className="mt-5 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white"
              >
                সব পণ্য দেখো
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-4xl">
                      {product.image || product.categoryIcon || "🛒"}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        product.change.dir === "up"
                          ? "bg-red-50 text-red-600"
                          : product.change.dir === "down"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.change.dir === "up"
                        ? "▲"
                        : product.change.dir === "down"
                          ? "▼"
                          : "●"}{" "}
                      {taka(product.change.pct)}%
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    {product.categoryNameBn}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-gray-900 group-hover:text-green-800">
                    {product.nameBn}
                  </h3>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">আজকের দাম</p>
                      <p className="mt-1 text-2xl font-extrabold text-green-800">
                        ৳{taka(product.today)}
                      </p>
                    </div>

                    <span className="pb-1 text-sm text-gray-500">
                      / {unitName(product.unit)}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4 text-sm font-semibold text-green-800">
                    বিস্তারিত দেখুন →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}