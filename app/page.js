"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);
  const [darkMode, setDarkMode] = useState("dark");

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setRecentHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const deleteHistory = async (id) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecentHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

const saveHistory = async (question, answer) => {
  try {
    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });
    fetchHistory();
  } catch (err) {
    console.error("Save History Error:", err);
  }
};

const askQuestion = async () => {
  if (!question && !selectedHistory) return;

  const payloadData = question ? question : selectedHistory;

  setLoader(true);
  try {
    const payload = {
      contents: [{ parts: [{ text: payloadData }] }],
    };

    const response = await fetch("/api/your-ai-endpoint", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    let answerText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer";

    // ✅ Clean Answer: Remove unwanted '*' and markdown symbols
    const cleanAnswer = answerText
      .replace(/^\s*\*\s*/gm, "\n") // Remove bullets
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown (optional)
      .replace(/\*/g, "\n\n\n"); // Remove stray * if needed

    setResult((prev) => [
      ...prev,
      { type: "q", text: payloadData },
      { type: "a", text: cleanAnswer },
    ]);

    setQuestion("");
    // ✅ Save both Question & Answer to MongoDB
        await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: payloadData, answer: answerText }),
    });

     await fetchHistory();

    

    setTimeout(() => {
      if (scrollToAns.current) {
        scrollToAns.current.scrollTo({
          top: scrollToAns.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 500);
  } catch (err) {
    console.error("API Error:", err);
  } finally {
    setLoader(false);
  }
};



  const handleEnter = (e) => {
    if (e.key === "Enter") askQuestion();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (selectedHistory) askQuestion();
  }, [selectedHistory]);

  return (
    <div className={darkMode === "dark" ? "dark" : ""}>
      <div className="grid grid-cols-5 h-screen text-white bg-gray-900">
        {/* Sidebar */}
        <div className="col-span-1 bg-gray-800 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Search</h2>
          </div>
          <ul>
            {recentHistory.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center mb-2"
              >
                <span
                  onClick={() => setSelectedHistory(item.question)}
                  className="cursor-pointer hover:text-blue-500"
                >
                  {item.question}
                </span>
                <button
                  onClick={() => deleteHistory(item._id)}
                  className="text-red-400 hover:text-red-600 ml-2 cursor-pointer"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
          <select
            onChange={(e) => setDarkMode(e.target.value)}
            value={darkMode}
            className="mt-auto bg-gray-700 text-white p-2 rounded"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* Main Section */}
        <div className="col-span-4 p-10 flex flex-col">
          <h1 className="text-4xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            Hello User, Ask me Anything
          </h1>

          {loader && (
            <div role="status" className="my-4 flex justify-center">
              <div className="w-8 h-8 border-4 border-dashed border-purple-600 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Chat Section */}
         <div
  ref={scrollToAns}
  className="flex-grow overflow-y-auto p-4 space-y-4 overflow-x-auto"
  style={{ maxHeight: "calc(100vh - 300px)" }}
>

            <ul>
              {result.map((item, index) => (
                <li
                  key={index}
                  className={`flex ${
                    item.type === "q" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      item.type === "q"
                        ? "bg-gray-700 text-white"
                        : "bg-transparent text-white"  
                    }`}
                  >
                    <QuestionAnswer item={item} index={index} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Input */}
          <div className="bg-gray-800 rounded-full flex p-2 mt-25  sticky">
            <input
              type="text"
              value={question}
              onKeyDown={handleEnter}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything"
              className="flex-grow bg-transparent text-white p-3 outline-none"
            />
            <button
              onClick={askQuestion}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-full"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
