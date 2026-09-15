import BODList from "@/components/bod/BODList";

export default function BoardOfDirectorsPage() {
  return (
    <div className="min-h-screen pt-24 px-8 max-w-7xl mx-auto flex flex-col">
      <div className="mb-12 relative z-10 pointer-events-none text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Board of Directors</h1>
        <p className="text-gray-400 text-lg">
          Meet the dedicated team leading the Electronics & Computer Students Association.
        </p>
      </div>

      <BODList />
    </div>
  );
}
