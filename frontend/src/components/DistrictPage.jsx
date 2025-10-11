import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDistrictData } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./DistrictPage.css";

const DistrictPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState("en");
  const [reading, setReading] = useState(false);

  useEffect(() => {
    getDistrictData(id)
      .then((res) => {
        if (res?.trend?.length) {
          const sortedTrend = [...res.trend].sort((a, b) =>
            (a.year_month || "").localeCompare(b.year_month || "")
          );

          const may2025Index = sortedTrend.findIndex(
            (r) =>
              r.year_month?.toLowerCase().includes("2025") &&
              r.year_month?.toLowerCase().includes("may")
          );

          setData({ ...res, trend: sortedTrend });
          if (may2025Index !== -1) setCurrentIndex(may2025Index);
          else setCurrentIndex(sortedTrend.length - 1);
        } else setData(null);
      })
      .catch(() => setData(null));
  }, [id]);

  const speak = (text) => {
    if (!window.speechSynthesis) {
      alert("Speech not supported on this browser");
      return;
    }
    setReading(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "en" ? "en-IN" : "hi-IN";
    utterance.rate = 1;
    utterance.onend = () => setReading(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!data)
    return (
      <div className="loading">
        {lang === "en" ? "Loading data..." : "डेटा लोड हो रहा है..."}
      </div>
    );

  const records = data.trend;
  const summary = records[currentIndex] || {};
  const monthValue =
    summary.year_month ||
    summary.month ||
    summary.Month ||
    summary.month_name ||
    "2025-May";
  const formattedMonth = monthValue.replace("_", "-");

  const districtName =
    data.summary?.district_name?.replace(/_/g, " ").toUpperCase() ||
    id.split("-")[1]?.replace(/_/g, " ").toUpperCase() ||
    "Unknown District";

  const explainText =
    lang === "en"
      ? `In ${districtName}, during ${formattedMonth}, ${
          summary.households || 0
        } households worked, earning an average wage of ₹${
          summary.wages || 0
        } with ${summary.workdays || 0} workdays.`
      : `${districtName} जिले में ${formattedMonth} के दौरान ${
          summary.households || 0
        } परिवारों ने काम किया, ₹${
          summary.wages || 0
        } की औसत मजदूरी और ${summary.workdays || 0} कार्य दिवसों के साथ।`;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev < records.length - 1 ? prev + 1 : records.length - 1
    );

  const handleBarClick = (barData) => {
    const index = records.findIndex(
      (r) =>
        r.year_month === barData.year_month ||
        r.month === barData.month ||
        r.Month === barData.Month
    );
    if (index >= 0) setCurrentIndex(index);
  };

  return (
    <div className="district-container">
      {/* 🔹 Header Section */}
      <div className="header">
        <Link to="/" className="back-btn">
          ⬅️ {lang === "en" ? "Back" : "वापस"}
        </Link>

        <div className="lang-controls">
          <div className="lang-group">
            {/* 💡 Blinking Info Icon on left side */}
            <span
              className="hint-icon blink"
              title={
                lang === "en"
                  ? "पेज को हिंदी में देखने के लिए यहाँ क्लिक करें"
                  : "Click here to translate page to English"
              }
            >
              💡
            </span>

            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="lang-btn"
            >
              🌐 {lang === "en" ? "हिंदी" : "English"}
            </button>
          </div>

          <button
            onClick={() => speak(explainText)}
            disabled={reading}
            className="speak-btn"
          >
            🔊 {lang === "en" ? "Listen" : "सुनें"}
          </button>
        </div>
      </div>

      {/* 🏙️ District Info */}
      <div className="district-header">
        <h2>{districtName}</h2>
        <p>
          {lang === "en"
            ? "MGNREGA Work & Wages Overview"
            : "मनरेगा कार्य और मजदूरी का सारांश"}
        </p>
        <h3>📅 {formattedMonth}</h3>
      </div>

      {/* 📊 Chart */}
      <div className="chart-section">
        <h3>{lang === "en" ? "Monthly Performance" : "मासिक प्रदर्शन"}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={records}
            onClick={(e) =>
              e.activeLabel && handleBarClick(e.activePayload?.[0]?.payload)
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year_month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="households"
              fill="#60A5FA"
              name={lang === "en" ? "Households" : "परिवार"}
            />
            <Bar
              dataKey="workdays"
              fill="#34D399"
              name={lang === "en" ? "Workdays" : "कार्य दिवस"}
            />
            <Bar
              dataKey="wages"
              fill="#FBBF24"
              name={lang === "en" ? "Wages (₹)" : "मजदूरी (₹)"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📅 Month Navigation */}
      <div className="month-controls">
        <button onClick={handlePrev} disabled={currentIndex <= 0}>
          ⏮️ {lang === "en" ? "Previous" : "पिछला"}
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= records.length - 1}
        >
          {lang === "en" ? "Next" : "अगला"} ⏭️
        </button>
      </div>

      {/* 🧩 Summary Section */}
      <div className="summary">
        <div className="summary-item blue">
          <div className="icon">🏠</div>
          <h3>{summary.households?.toLocaleString() || 0}</h3>
          <p>{lang === "en" ? "Households Worked" : "काम करने वाले परिवार"}</p>
        </div>

        <div className="summary-item yellow">
          <div className="icon">💰</div>
          <h3>₹{summary.wages?.toLocaleString() || 0}</h3>
          <p>{lang === "en" ? "Average Wages" : "औसत मजदूरी"}</p>
        </div>

        <div className="summary-item green">
          <div className="icon">🌾</div>
          <h3>{summary.workdays?.toLocaleString() || 0}</h3>
          <p>{lang === "en" ? "Total Workdays" : "कुल कार्य दिवस"}</p>
        </div>
      </div>

      {/* 🗣️ Explanation */}
      <div className="explain-box">
        <h4>{lang === "en" ? "In simple words:" : "सरल शब्दों में:"}</h4>
        <p>{explainText}</p>
      </div>
    </div>
  );
};

export default DistrictPage;
