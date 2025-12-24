"use client";

interface FilterBarProps {
  filters: {
    language: string;
    level: string;
    price: string;
  };
  onFilterChange: (key: string, value: string) => void;
  languages: string[];
  levels: string[];
  prices: string[];
}

export default function FilterBar({
  filters,
  onFilterChange,
  languages,
  levels,
  prices,
}: FilterBarProps) {
  return (
    <div className="bg-black px-6 py-8 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Languages */}
        <div>
          <label className="block text-white text-sm mb-2">Languages</label>
          <div className="relative">
            <select
              value={filters.language}
              onChange={(e) => onFilterChange("language", e.target.value)}
              className="w-full appearance-none bg-white rounded-xl px-5 py-4 text-lg font-medium text-gray-900 focus:outline-none"
            >
              <option value="all">All Languages</option>
              {languages
                .filter((lang) => lang !== "all")
                .map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
            </select>
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
              ▼
            </span>
          </div>
        </div>

        {/* Level */}
        <div>
          <label className="block text-white text-sm mb-2">
            Level of knowledge
          </label>
          <div className="relative">
            <select
              value={filters.level}
              onChange={(e) => onFilterChange("level", e.target.value)}
              className="w-full appearance-none bg-white rounded-xl px-5 py-4 text-lg font-medium text-gray-900 focus:outline-none"
            >
              <option value="all">All Levels</option>
              {levels
                .filter((lvl) => lvl !== "all")
                .map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
            </select>
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
              ▼
            </span>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-white text-sm mb-2">Price</label>
          <div className="relative">
            <select
              value={filters.price}
              onChange={(e) => onFilterChange("price", e.target.value)}
              className="w-full appearance-none bg-white rounded-xl px-5 py-4 text-lg font-medium text-gray-900 focus:outline-none"
            >
              <option value="all">All Prices</option>
              {prices.map((price) => (
                <option key={price} value={price}>
                  {price} $
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-600">
              ▼
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
