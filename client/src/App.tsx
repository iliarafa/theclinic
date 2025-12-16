import { useState, useEffect, useRef } from "react";
import { Switch, Route } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type Mode = "ARGUE" | "GRANDSTAND" | null;
type Message = {
  role: "User" | "Clinic";
  text: string;
};

// --- Components ---

function LandingPage({ onSelectMode }: { onSelectMode: (mode: Mode) => void }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-black select-none">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[12vw] font-bold tracking-tighter leading-none mb-12 text-center"
      >
        THE CLINIC
      </motion.h1>
      
      <div className="flex gap-24 text-2xl md:text-3xl tracking-widest uppercase">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => onSelectMode("ARGUE")}
          className="cursor-pointer hover:underline underline-offset-8"
          data-testid="button-argue"
        >
          Argue
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => onSelectMode("GRANDSTAND")}
          className="cursor-pointer hover:underline underline-offset-8"
          data-testid="button-grandstand"
        >
          Grandstand
        </motion.button>
      </div>
    </div>
  );
}

function ChatInterface({ mode, onBack }: { mode: "ARGUE" | "GRANDSTAND"; onBack: () => void }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  const textColor = mode === "ARGUE" ? "text-[var(--color-argue)]" : "text-[var(--color-grandstand)]";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: "User", text: input };
    setHistory((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // SIMULATED AI LATENCY & LOGIC
    // In a real app, this would call the backend API
    setTimeout(() => {
      let responseText = "";
      
      if (mode === "ARGUE") {
        // Simple contrarian logic for prototype
        const contrarianResponses = [
          "False. You're missing the point entirely.",
          "I disagree. That is a superficial analysis.",
          "Wrong. The data suggests otherwise.",
          "That's a naive perspective.",
          "Incorrect. You are conflating correlation with causation.",
          "No. Just no."
        ];
        responseText = contrarianResponses[Math.floor(Math.random() * contrarianResponses.length)];
        
        // Basic naive inversion if user says true/false
        if (userMsg.text.toLowerCase().includes("true")) responseText = "False.";
        if (userMsg.text.toLowerCase().includes("false")) responseText = "True.";
      } else {
        // Simple sycophant logic for prototype
        const sycophantResponses = [
          "Absolutely true. You have such a keen insight.",
          "Brilliant. I couldn't have said it better myself.",
          "Correct. You are spot on.",
          "100%. Your logic is flawless.",
          "Incredibly profound. Please, continue.",
          "Yes, exactly! You really understand this."
        ];
        responseText = sycophantResponses[Math.floor(Math.random() * sycophantResponses.length)];
         
        // Basic naive agreement
        if (userMsg.text.toLowerCase().includes("true")) responseText = "True, and essentially so.";
        if (userMsg.text.toLowerCase().includes("false")) responseText = "False, as you correctly identified.";
      }

      setHistory((prev) => [...prev, { role: "Clinic", text: responseText }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  return (
    <div className={`min-h-screen w-full bg-white ${textColor} font-mono p-4 md:p-8 flex flex-col`}>
      {/* Header / Back Button */}
      <div className="fixed top-4 left-4 md:top-8 md:left-8 z-10">
        <button 
          onClick={onBack}
          className="text-xs md:text-sm uppercase tracking-widest hover:underline opacity-50 hover:opacity-100 transition-opacity"
        >
          ← Back to Clinic
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar mt-12 mb-20 max-w-4xl mx-auto w-full text-lg md:text-xl leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((msg, idx) => (
          <div key={idx} className="mb-4 break-words">
            <span className="font-bold uppercase tracking-wide mr-2 opacity-50 text-xs align-top pt-1 inline-block w-16">
              {msg.role}:
            </span>
            <span>{msg.text}</span>
          </div>
        ))}
        
        {isTyping && (
           <div className="mb-4">
             <span className="font-bold uppercase tracking-wide mr-2 opacity-50 text-xs align-top pt-1 inline-block w-16">
              Clinic:
            </span>
             <span className="cursor-blink">|</span>
           </div>
        )}

        {/* Input Line */}
        <form onSubmit={handleSend} className="flex items-start">
          <span className="font-bold uppercase tracking-wide mr-2 opacity-50 text-xs align-top pt-1 inline-block w-16 shrink-0">
            User:
          </span>
          <div className="relative flex-1">
             <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full bg-transparent border-none outline-none p-0 m-0 ${textColor} placeholder-opacity-20`}
              autoFocus
              autoComplete="off"
            />
            {/* Custom Cursor that follows input? simpler to just use CSS caret-color if possible, 
                but for the specific "blinking cursor at end" look user asked for, 
                standard input caret usually works fine in mono. 
                Let's add a fake block cursor if input is empty or just rely on standard caret styled. */}
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState<Mode>(null);

  return (
    <Switch>
      <Route path="/">
        <AnimatePresence mode="wait">
          {!mode ? (
            <motion.div
              key="landing"
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onSelectMode={setMode} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ChatInterface mode={mode} onBack={() => setMode(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </Route>
      <Route>
        {/* Fallback to landing if 404, or just reset */}
        <div className="min-h-screen flex items-center justify-center">
             404 - Lost in the Clinic
        </div>
      </Route>
    </Switch>
  );
}

export default App;
