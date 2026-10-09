
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#f8faf5] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-green-50 text-6xl">
          🛒
        </div>

        <p className="mt-7 text-sm font-bold tracking-widest text-green-700">
          ERROR 404
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          দুঃখিত! তুমি যে পেজটি খুঁজছ, সেটি হয়তো সরানো হয়েছে অথবা ঠিকানাটি
          ভুল লেখা হয়েছে।
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white transition hover:bg-green-800"
        >
          ← হোম পেজে ফিরে যাও
        </Link>

        <p className="mt-8 text-sm text-gray-400">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
      </div>
    </main>
  );
}