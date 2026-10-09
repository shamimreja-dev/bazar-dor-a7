
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f8faf5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-8 w-40 rounded-lg bg-gray-200" />

        <div className="mt-8 rounded-3xl bg-green-100 p-8 sm:p-12">
          <div className="h-5 w-32 rounded bg-green-200" />
          <div className="mt-5 h-10 max-w-lg rounded-lg bg-green-200" />
          <div className="mt-4 h-5 max-w-md rounded bg-green-200" />
          <div className="mt-7 h-12 w-40 rounded-xl bg-green-200" />
        </div>

        <div className="mt-10 h-8 w-56 rounded-lg bg-gray-200" />

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-100 bg-white p-6"
            >
              <div className="h-16 w-16 rounded-2xl bg-gray-200" />
              <div className="mt-5 h-5 w-2/3 rounded bg-gray-200" />
              <div className="mt-4 h-8 w-1/2 rounded bg-gray-200" />
              <div className="mt-5 h-4 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}