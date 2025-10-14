import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [showWakeNotice, setShowWakeNotice] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(25);
  const navigate = useNavigate();

  // ✅ Show wake-up notice only once
  useEffect(() => {
    const alreadyShown = localStorage.getItem("renderWakeShown");
    if (!alreadyShown) {
      setShowWakeNotice(true);
    }
  }, []);

  // 🔍 Fetch district suggestions dynamically
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(`https://mgnrega.onrender.com/api/v1/search?q=${query}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : data?.results || []);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    const timeout = setTimeout(fetchResults, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // ✅ Copy function
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1500);
  };

  // ✅ navigate to selected district
  const handleSelect = (district) => {
    navigate(`/district/${district.district_id}`);
    setResults([]);
    setQuery("");
  };

  // ✅ manual search
  const handleSearch = () => {
    if (!query.trim()) return;
    if (results.length > 0) {
      handleSelect(results[0]);
    } else {
      alert(
        lang === "en"
          ? "No district found. Try another name."
          : "कोई जिला नहीं मिला, कृपया दूसरा नाम आज़माएं।"
      );
    }
  };

  // ✅ Wake-up start button click
  const handleWakeBackend = () => {
    setShowWakeNotice(false);
    setShowTimer(true);
    localStorage.setItem("renderWakeShown", "true");

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowTimer(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ✅ auto detect location
  const handleAutoDetect = async () => {
    if (!navigator.geolocation) {
      alert(
        lang === "en"
          ? "Location not supported by your browser."
          : "आपका ब्राउज़र स्थान का समर्थन नहीं करता।"
      );
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const district = data.city || data.locality || data.district;
          const state = data.principalSubdivision || "Unknown";

          if (!district) {
            alert(
              lang === "en"
                ? "Could not detect your district."
                : "आपका जिला पता नहीं चल सका।"
            );
            setLoading(false);
            return;
          }

          const districtId = `${state.replace(/\s+/g, "_")}-${district
            .replace(/\s+/g, "_")
            .toUpperCase()}`;

          navigate(`/district/${districtId}`);
        } catch (error) {
          console.error("Auto-detect error:", error);
          alert(
            lang === "en"
              ? "Error detecting location."
              : "स्थान का पता लगाने में त्रुटि।"
          );
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        alert(
          lang === "en"
            ? "Please allow location access."
            : "कृपया स्थान की अनुमति दें।"
        );
        console.error("Location error:", error);
        setLoading(false);
      }
    );
  };

  return (
    <div className="home">
      {/* 👤 Author Section */}
      <div className="author-bar">
        <div className="author-info">
          <span className="author-name">
            Made by <strong>Prakash Mane</strong>
          </span>

          <div className="author-links">
            <div className="link-item">
              <a href="mailto:prakashprm710@gmail.com" target="_blank" rel="noopener noreferrer">
                📧 Mail: prakashprm710@gmail.com
              </a>
              <button className="copy-btn" onClick={() => handleCopy("prakashprm710@gmail.com", "mail")}>
                📋
              </button>
              {copied === "mail" && <span className="copied">Copied!</span>}
            </div>

            <div className="link-item">
              <a href="https://github.com/PRM710" target="_blank" rel="noopener noreferrer">
                🐙 GitHub
              </a>
              <button className="copy-btn" onClick={() => handleCopy("https://github.com/PRM710", "github")}>
                📋
              </button>
              {copied === "github" && <span className="copied">Copied!</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ⚠️ Info Note (ABOVE the Title) */}
      <div className="detect-note top-note">
        ⚠️{" "}
        {lang === "en"
          ? "Note: Auto Detect currently works only for Delhi, Uttar Pradesh, and Maharashtra."
          : "ध्यान दें: ऑटो डिटेक्ट केवल दिल्ली, उत्तर प्रदेश और महाराष्ट्र के लिए कार्य करता है।"}
      </div>

      {/* 🌍 Title */}
      <h1>{lang === "en" ? "Our Voice — MGNREGA" : "हमारी आवाज़ — मनरेगा"}</h1>

      {/* 🌐 Controls */}
      <div className="controls">
        <button onClick={() => setLang(lang === "en" ? "hi" : "en")}>
          {lang === "en" ? "हिंदी" : "English"}
        </button>

        <button onClick={handleAutoDetect} disabled={loading}>
          {loading
            ? lang === "en"
              ? "Detecting..."
              : "पता लगाया जा रहा है..."
            : lang === "en"
            ? "Auto Detect"
            : "स्थान पहचानें"}
        </button>
      </div>

      {/* 🔍 Search */}
      <div className="search">
        <input
          type="text"
          placeholder={lang === "en" ? "Search District" : "जिला खोजें"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>{lang === "en" ? "Search" : "खोजें"}</button>
      </div>

      {/* 🔽 Results */}
      {results.length > 0 && (
        <div className="results-box">
          {results.map((r) => (
            <div key={r.district_id} className="result-item" onClick={() => handleSelect(r)}>
              <strong>{r.district_name}</strong>
              <span className="state-name"> — {r.state_name}</span>
            </div>
          ))}
        </div>
      )}

      {/* 🕒 Wake-up Notice (only once) */}
      {showWakeNotice && (
        <div className="wake-message">
          <h3>⚙️ Click the button below to wake up the backend (Render free tier).</h3>
          <p>Sorry for the short wait — it will take about 25 seconds only once.</p>
          <hr />
          <h3>⚙️ नीचे दिए गए बटन पर क्लिक करें ताकि बैकएंड शुरू हो सके।</h3>
          <p>क्षमा करें, कृपया केवल पहली बार 25 सेकंड प्रतीक्षा करें।</p>
          <button className="wake-btn" onClick={handleWakeBackend}>🚀 Start Backend</button>
        </div>
      )}

      {/* ⏱️ Timer Message */}
      {showTimer && (
        <div className="wake-message">
          <h3>⚙️ Please wait {timer}s for the backend to wake up.</h3>
          <p>This happens only once as the server is hosted on Render (Free Tier).</p>
          <hr />
          <p>⚙️ कृपया बैकएंड के चालू होने के लिए {timer} सेकंड प्रतीक्षा करें।</p>
          <p>यह केवल एक बार होगा क्योंकि सर्वर Render (फ्री ट्रायल) पर होस्ट किया गया है।</p>
        </div>
      )}
    </div>
  );
};

export default Home;
