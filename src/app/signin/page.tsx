
"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন");
      return;
    }

    // Better Auth integration will be added later.
    toast("Better Auth এখনো সংযুক্ত করা হয়নি।");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf5] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-9">
        <Link href="/" className="text-sm font-semibold text-green-800">
          ← হোম পেজ
        </Link>

        <div className="mt-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-4xl">
            🛒
          </div>
          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            আবার স্বাগতম!
          </h1>
          <p className="mt-2 text-gray-500">
            বাজার দর অ্যাকাউন্টে সাইন ইন করুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
              ইমেইল ঠিকানা
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
          >
            সাইন ইন করুন
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={() => toast("Google Login পরে সংযুক্ত করা হবে।")}
          className="w-full rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          G  Google দিয়ে চালিয়ে যান
        </button>

        <button
          type="button"
          onClick={() => toast("GitHub Login পরে সংযুক্ত করা হবে।")}
          className="mt-3 w-full rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          <span className="mr-2">⌘</span> GitHub দিয়ে চালিয়ে যান
        </button>

        <p className="mt-7 text-center text-sm text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-semibold text-green-800 hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </main>
  );
}