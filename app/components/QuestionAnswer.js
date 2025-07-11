"use client";

export default function QuestionAnswer({ item }) {
  return item.type === "q" ? (
    <div className="font-bold text-blue-700 dark:text-blue-300">
      Q: {item.text}
    </div>
  ) : (
    <div className="mt-2">
      <div className="text-green-700 dark:text-green-300 font-medium mb-1">
        Answer:
      </div>
      <div className="whitespace-pre-wrap text-base leading-relaxed text-white">
        {item.text}
      </div>
    </div>
  );
}
