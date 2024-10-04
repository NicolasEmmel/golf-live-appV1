'use client'
import { useState } from "react";

const RandomizerPage = () => {
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const clubs = [
    "Lob Wedge (1)", "Sand Wedge (2)", "Pitching Wedge (3)", "9er Eisen (4)", "8er Eisen (5)", 
    "7er Eisen (6)", "6er Eisen (7)", "5er Eisen (8)", "4er Eisen (9)", "3er Eisen (10)", 
    "5 Wood (11)", "3 Wood (12)", "Driver (13)"
  ];

  const handleRandomize = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * clubs.length);
      setSelectedClub(clubs[randomIndex]);
      setIsAnimating(false);
    }, 1000); // Animation duration of 1 second
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Random Club Selector</h1>
        <p className="text-white">Click the button to select a random club</p>
      </div>

      <div className={`text-4xl font-bold mb-8 transition-transform ${isAnimating ? "animate-spin" : ""}`}>
        {selectedClub ? selectedClub : "?"}
      </div>

      <button
        className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-700 transition-all focus:outline-none"
        onClick={handleRandomize}
      >
        Randomize Club
      </button>
    </div>
  );
};

export default RandomizerPage;
