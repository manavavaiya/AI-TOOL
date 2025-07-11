"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";  // Install `lucide-react` for icons: npm i lucide-react

export default function RecentSearch({ recentHistory, setSelectedHistory, fetchHistory }) {
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
      fetchHistory();  // Refresh history after deletion
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-4 border-r dark:border-zinc-600 border-zinc-300">
      <h2 className="font-bold mb-2 dark:text-white">Recent Search</h2>
      <ul className="space-y-2">
        {recentHistory.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center cursor-pointer hover:text-blue-600"
          >
            <span onClick={() => setSelectedHistory(item.question)}>{item.question}</span>
            <Trash2 className="w-4 h-4 text-red-500" onClick={() => handleDelete(item._id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
