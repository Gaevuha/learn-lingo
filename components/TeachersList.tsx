"use client";

import { useState, useEffect, useMemo } from "react";
import TeacherCard from "./TeacherCard";
import FilterBar from "./FilterBar";
import { Teacher } from "@/types/teacher";
import { useTeachers } from "@/hooks/useTeachers";

interface TeachersListProps {
  initialTeachers: Teacher[];
  totalCount: number;
}

export default function TeachersList({
  initialTeachers,
  totalCount: initialTotalCount,
}: TeachersListProps) {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>(initialTeachers);
  const [currentFilters, setCurrentFilters] = useState({
    language: "all",
    level: "all",
    price: "all",
  });
  const [currentOffset, setCurrentOffset] = useState(0);

  const { data, isLoading, error } = useTeachers({
    ...currentFilters,
    offset: currentOffset,
    limit: 4,
  });

  // Update allTeachers when receiving new data
  useEffect(() => {
    if (!data?.teachers) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllTeachers((prev) => {
      // Якщо offset === 0, просто замінюємо
      if (currentOffset === 0) {
        if (JSON.stringify(prev) !== JSON.stringify(data.teachers)) {
          console.log("Updating allTeachers (reset)", data.teachers);
          return data.teachers;
        }
        return prev;
      }

      // Для додавання нових викладачів
      const newTeachers = data.teachers.filter(
        (t) => !prev.some((prevT) => prevT.id === t.id)
      );
      if (newTeachers.length === 0) return prev;

      console.log("Appending new teachers:", newTeachers);
      return [...prev, ...newTeachers];
    });
  }, [data, currentOffset]);

  const teachers = allTeachers;
  const totalCount = data?.totalCount || initialTotalCount;

  const handleFilterBarChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    setCurrentOffset(0);
    setAllTeachers([]); // Reset when filters change
  };

  const loadMore = () => {
    if (teachers.length < totalCount) {
      setCurrentOffset((prev) => prev + 4);
    }
  };

  // Getting unique values for filters
  const languages = useMemo(() => {
    const allLanguages = teachers.flatMap((teacher) => teacher.languages || []);
    return ["all", ...Array.from(new Set(allLanguages))];
  }, [teachers]);

  const levels = useMemo(() => {
    const allLevels = teachers.flatMap((teacher) => teacher.levels || []);
    return ["all", ...Array.from(new Set(allLevels))];
  }, [teachers]);

  const prices = useMemo(() => {
    const allPrices = teachers.map((teacher) => teacher.price_per_hour);
    return Array.from(new Set(allPrices)).sort((a, b) => a - b);
  }, [teachers]);

  if (isLoading && teachers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading teachers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-2">
            {error instanceof Error ? error.message : "Failed to load data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* FilterBar */}
      <FilterBar
        filters={currentFilters}
        onFilterChange={handleFilterBarChange}
        languages={languages}
        levels={levels}
        prices={prices.map((p) => p.toString())}
      />

      {/* Results */}
      <div>
        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <li
              key={teacher.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-6"
            >
              <TeacherCard teacher={teacher} />
            </li>
          ))}
        </ul>
        {teachers.length < totalCount && !isLoading && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
        {isLoading && teachers.length > 0 && (
          <div className="text-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
