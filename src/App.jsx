import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "win-the-day-jen-v4";

const categories = [
  { key: "move", label: "Move Your Body", target: 4, color: "#FF7F50" }, // coral
  { key: "eat", label: "Eat Aligned", target: 6, color: "#FFD166" }, // apricot
  { key: "god", label: "Time with God", target: 5, color: "#A8E6CF" }, // apple jade
  { key: "acc", label: "ACC Life Groups Progress", target: 4, color: "#C77DFF" }, // heliotrope
  { key: "relationships", label: "Strengthen Relationships", target: 4, color: "#9BE564" }, // lime green
  { key: "home", label: "Home Reset", target: 5, color: "#FFB4A2" },
  { key: "chad", label: "Invest in Chad", target: 5, color: "#B8F2E6" },
  { key: "spending", label: "Check Spending", target: 5, color: "#F9C74F" },
];

function formatLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseLocalISO(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfWeekMonday(date = new Date()) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function getWeekDates(baseDate = new Date()) {
  const start = startOfWeekMonday(baseDate);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function createEmptyWeekData(weekDates) {
  const data = {};
  weekDates.forEach((date) => {
    const iso = formatLocalISO(date);
    data[iso] = {};
    categories.forEach((category) => {
      data[iso][category.key] = false;
    });
  });
  return data;
}

function ensureWeekShape(existingWeekData, weekDates) {
  const safe = createEmptyWeekData(weekDates);
  if (!existingWeekData) return safe;

  weekDates.forEach((date) => {
    const iso = formatLocalISO(date);
    if (existingWeekData[iso]) {
      categories.forEach((category) => {
        safe[iso][category.key] = Boolean(existingWeekData[iso][category.key]);
      });
    }
  });

  return safe;
}

function getTier(score) {
  if (score >= 40) return "Elite";
  if (score >= 34) return "Great";
  if (score >= 28) return "Strong";
  return "Reset";
}

function getReward(score) {
  if (score >= 40) {
    return {
      label: "Pedicure Unlocked",
      detail: "Elite week. Go enjoy a real reward.",
    };
  }
  if (score >= 34) {
    return {
      label: "Book or Movie Unlocked",
      detail: "Great week. Pick something fun and light.",
    };
  }
  if (score >= 28) {
    return {
      label: "Coffee or Little Treat",
      detail: "Strong week. Celebrate consistency.",
    };
  }
  return {
    label: "Reset and Rebuild",
    detail: "No shame. Learn, reset, and go again.",
  };
}

function getMonthKeyFromISO(dateISO) {
  return dateISO.slice(0, 7);
}

function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatShortDay(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
  });
}

function formatWeekRange(weekStartISO, weekEndISO) {
  const start = parseLocalISO(weekStartISO);
  const end = parseLocalISO(weekEndISO);

  const startText = start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endText = end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startText} - ${endText}`;
}

function isSameISO(a, b) {
  return a === b;
}

function isEditableDate(dateISO) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const target = parseLocalISO(dateISO);
  target.setHours(0, 0, 0, 0);

  return (
    isSameISO(formatLocalISO(target), formatLocalISO(today)) ||
    isSameISO(formatLocalISO(target), formatLocalISO(yesterday))
  );
}

function isFutureDate(dateISO) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = parseLocalISO(dateISO);
  target.setHours(0, 0, 0, 0);

  return target.getTime() > today.getTime();
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FFF7F2",
color: "#2F2A28",
    color: "#ffffff",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  card: {
  background: "#FFFFFF",
  border: "1px solid #FFD9CC",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
},
  title: {
    fontSize: "56px",
    fontWeight: 900,
    margin: 0,
    lineHeight: 1,
  },
  subtitle: {
    color: "#8B6F63",
    fontSize: "22px",
    marginTop: "14px",
  },
  smallMuted: {
    color: "#A1887F",
    fontSize: "15px",
    marginTop: "10px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "2.2fr 1fr",
    gap: "24px",
    marginTop: "24px",
    alignItems: "start",
  },
  mainCard: {
  background: "#FFFFFF",
  border: "1px solid #FFD9CC",
  borderRadius: "24px",
  padding: "20px",
  overflowX: "auto",
},
  tableWrap: {
    minWidth: "980px",
  },
  headerRow: {
    display: "grid",
    gridTemplateColumns: "240px repeat(7, 1fr) 80px",
    gap: "10px",
    marginBottom: "12px",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    alignItems: "center",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "240px repeat(7, 1fr) 80px",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
  },
  categoryCell: {
  background: "linear-gradient(90deg, #FF7F50 0%, #FFB38A 100%)",
  color: "#ffffff",
  borderRadius: "18px",
  padding: "14px",
},
  categoryTitle: {
    fontWeight: 700,
    fontSize: "17px",
    lineHeight: 1.2,
  },
  categorySub: {
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "6px",
  },
  dayCell: {
    minHeight: "58px",
    borderRadius: "18px",
    border: "1px solid #D9C7BE",
    background: "#FFFDFB",
    color: "#2F2A28",
    fontSize: "22px",
    fontWeight: 700,
    cursor: "pointer",
  },
  dayCellChecked: {
    background: "#7BCFA3",
color: "#1F2A22",
border: "1px solid #68B58D",
  },
  dayCellLocked: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  totalCell: {
    minHeight: "58px",
    borderRadius: "18px",
    border: "1px solid #475569",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },
  totalCellHit: {
    background: "#f8fafc",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
  },
  summaryRow: {
    display: "grid",
    gridTemplateColumns: "240px repeat(7, 1fr) 80px",
    gap: "10px",
    marginTop: "14px",
    alignItems: "center",
  },
  summaryLabel: {
    background: "#1e293b",
    borderRadius: "18px",
    padding: "16px",
    fontWeight: 700,
  },
  scoreBox: {
    minHeight: "58px",
    borderRadius: "18px",
    border: "1px solid #475569",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },
  scoreBoxStrong: {
    background: "#f8fafc",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
  },
  statPills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "16px",
  },
  pill: {
    background: "#1e293b",
    borderRadius: "16px",
    padding: "12px 16px",
    color: "#cbd5e1",
    fontSize: "14px",
  },
  button: {
    background: "#f8fafc",
    color: "#0f172a",
    border: "none",
    borderRadius: "16px",
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },
  sideColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    fontWeight: 800,
    fontSize: "20px",
  },
  statCard: {
    background: "#1e293b",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "12px",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  statValue: {
    fontSize: "34px",
    fontWeight: 900,
    marginTop: "6px",
  },
  miniRow: {
    background: "#1e293b",
    borderRadius: "18px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
    gap: "12px",
  },
  mobileCard: {
    display: "none",
  },
  
};

function SectionTitle({ emoji, title }) {
  return (
    <div style={styles.sectionTitle}>
      <span>{emoji}</span>
      <span>{title}</span>
    </div>
  );
}

export default function WinTheDayApp() {
  const weekDates = useMemo(() => getWeekDates(new Date()), []);
  const weekStartISO = formatLocalISO(weekDates[0]);
  const weekEndISO = formatLocalISO(weekDates[6]);
  const todayISO = formatLocalISO(new Date());

  const [weekData, setWeekData] = useState(() => createEmptyWeekData(weekDates));
  const [history, setHistory] = useState([]);
  const [bestWeek, setBestWeek] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(
    Math.max(
      0,
      weekDates.findIndex((d) => formatLocalISO(d) === todayISO)
    )
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (parsed.currentWeekStartISO === weekStartISO && parsed.weekData) {
        setWeekData(ensureWeekShape(parsed.weekData, weekDates));
      } else {
        setWeekData(createEmptyWeekData(weekDates));
      }

      if (Array.isArray(parsed.history)) setHistory(parsed.history);
      if (typeof parsed.bestWeek === "number") setBestWeek(parsed.bestWeek);
    } catch (error) {
      console.error("Failed to load Win the Day data", error);
    }
  }, [weekStartISO, weekDates]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentWeekStartISO: weekStartISO,
        weekData,
        history,
        bestWeek,
      })
    );
  }, [weekStartISO, weekData, history, bestWeek]);

  const dailyScores = useMemo(() => {
    const result = {};
    weekDates.forEach((date) => {
      const iso = formatLocalISO(date);
      result[iso] = categories.reduce(
        (sum, category) => sum + (weekData[iso]?.[category.key] ? 1 : 0),
        0
      );
    });
    return result;
  }, [weekData, weekDates]);

  const currentWeekScore = useMemo(
    () => Object.values(dailyScores).reduce((sum, score) => sum + score, 0),
    [dailyScores]
  );

  const greatWeekTarget = useMemo(
    () => categories.reduce((sum, category) => sum + category.target, 0),
    []
  );

  const categoryTotals = useMemo(() => {
    const totals = {};
    categories.forEach((category) => {
      totals[category.key] = weekDates.reduce((sum, date) => {
        const iso = formatLocalISO(date);
        return sum + (weekData[iso]?.[category.key] ? 1 : 0);
      }, 0);
    });
    return totals;
  }, [weekData, weekDates]);

  const shortfalls = useMemo(() => {
    return categories
      .map((category) => {
        const total = categoryTotals[category.key];
        return {
          ...category,
          total,
          shortfall: Math.max(category.target - total, 0),
        };
      })
      .sort((a, b) => b.shortfall - a.shortfall || a.label.localeCompare(b.label))
      .filter((item) => item.shortfall > 0)
      .slice(0, 3);
  }, [categoryTotals]);

  const reward = getReward(currentWeekScore);

  const currentWeekStreak = useMemo(() => {
    const datesUpToToday = weekDates
      .map((d) => formatLocalISO(d))
      .filter((iso) => !isFutureDate(iso));

    let streak = 0;
    for (let i = datesUpToToday.length - 1; i >= 0; i -= 1) {
      const iso = datesUpToToday[i];
      if ((dailyScores[iso] || 0) >= 4) streak += 1;
      else break;
    }
    return streak;
  }, [dailyScores, weekDates]);

  const bestDayStreakEver = useMemo(() => {
    const archivedDays = history.flatMap((week) =>
      week.days.map((day) => ({
        dateISO: day.dateISO,
        score: day.score,
      }))
    );

    const currentDays = weekDates
      .map((date) => {
        const iso = formatLocalISO(date);
        return {
          dateISO: iso,
          score: dailyScores[iso] || 0,
        };
      })
      .filter((item) => !isFutureDate(item.dateISO));

    const all = [...archivedDays, ...currentDays].sort((a, b) =>
      a.dateISO.localeCompare(b.dateISO)
    );

    let best = 0;
    let current = 0;

    all.forEach((day) => {
      if (day.score >= 4) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    });

    return best;
  }, [history, weekDates, dailyScores]);

  useEffect(() => {
    if (currentWeekScore > bestWeek) {
      setBestWeek(currentWeekScore);
    }
  }, [currentWeekScore, bestWeek]);

  const monthlyStats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyWeeks = history.filter(
      (item) => getMonthKeyFromISO(item.weekEndISO) === currentMonth
    );

    if (monthlyWeeks.length === 0) {
      return {
        totalWeeks: 0,
        avgScore: 0,
        bestScore: 0,
        eliteWeeks: 0,
        greatWeeks: 0,
      };
    }

    const totalScore = monthlyWeeks.reduce((sum, item) => sum + item.score, 0);

    return {
      totalWeeks: monthlyWeeks.length,
      avgScore: Math.round(totalScore / monthlyWeeks.length),
      bestScore: Math.max(...monthlyWeeks.map((item) => item.score)),
      eliteWeeks: monthlyWeeks.filter((item) => item.score >= 40).length,
      greatWeeks: monthlyWeeks.filter((item) => item.score >= 34).length,
    };
  }, [history]);

  const selectedDate = weekDates[selectedDayIndex];
  const selectedISO = formatLocalISO(selectedDate);

  function toggle(categoryKey, dateISO) {
    if (!isEditableDate(dateISO)) return;

    setWeekData((prev) => ({
      ...prev,
      [dateISO]: {
        ...prev[dateISO],
        [categoryKey]: !prev[dateISO][categoryKey],
      },
    }));
  }

  function endWeek() {
    const snapshot = {
      weekStartISO,
      weekEndISO,
      weekRangeLabel: formatWeekRange(weekStartISO, weekEndISO),
      score: currentWeekScore,
      tier: getTier(currentWeekScore),
      endedAtISO: new Date().toISOString(),
      categoryTotals,
      days: weekDates.map((date) => {
        const iso = formatLocalISO(date);
        return {
          dateISO: iso,
          dateLabel: formatDayLabel(date),
          score: dailyScores[iso] || 0,
          checks: weekData[iso],
        };
      }),
    };

    setHistory((prev) => [snapshot, ...prev]);
    setWeekData(createEmptyWeekData(weekDates));
  }

  const daysAtFourOrMore = Object.values(dailyScores).filter((score) => score >= 4).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Win the Day</h1>
          <div style={styles.subtitle}>
            Small faithful wins. Stronger body, deeper relationships, calmer home.
          </div>
          <div style={styles.smallMuted}>
            Current week: <strong style={{ color: "#fff" }}>{formatWeekRange(weekStartISO, weekEndISO)}</strong>
          </div>
          <div style={styles.smallMuted}>
            You can edit today and yesterday. Older days lock automatically.
          </div>
        </div>

        <div style={styles.layout}>
          <div>
            <div style={styles.mainCard}>
              <div style={styles.tableWrap}>
                <div style={styles.headerRow}>
                  <div>Category</div>
                  {weekDates.map((date) => {
                    const iso = formatLocalISO(date);
                    return (
                      <div key={iso} style={{ textAlign: "center" }}>
                        <div>{formatShortDay(date)}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: 4 }}>
                          {date.toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ textAlign: "center" }}>Total</div>
                </div>

                {categories.map((category) => {
                  const total = categoryTotals[category.key];
                  const hitTarget = total >= category.target;

                  return (
  <div
    key={category.key}
    style={styles.row}
  >
    <div
      style={{
        ...styles.categoryCell,
        background: category.color,
      }}
    >
      <div style={styles.categoryTitle}>{category.label}</div>
      <div style={styles.categorySub}>Weekly target: {category.target}</div>
    </div>

                      {weekDates.map((date) => {
                        const iso = formatLocalISO(date);
                        const checked = weekData[iso]?.[category.key];
                        const editable = isEditableDate(iso);
                        const future = isFutureDate(iso);

                        const buttonStyle = {
                          ...styles.dayCell,
                          ...(checked ? styles.dayCellChecked : {}),
                          ...(!editable ? styles.dayCellLocked : {}),
                        };

                        return (
                          <button
                            key={`${category.key}-${iso}`}
                            onClick={() => toggle(category.key, iso)}
                            disabled={!editable}
                            style={buttonStyle}
                            title={editable ? "Editable" : future ? "Future day" : "Locked"}
                          >
                            {checked ? "✓" : !editable ? "🔒" : "○"}
                          </button>
                        );
                      })}

                      <div style={{ ...styles.totalCell, ...(hitTarget ? styles.totalCellHit : {}) }}>
                        {total}/{category.target}
                      </div>
                    </div>
                  );
                })}

                <div style={styles.summaryRow}>
                  <div style={styles.summaryLabel}>Daily Score</div>
                  {weekDates.map((date) => {
                    const iso = formatLocalISO(date);
                    const score = dailyScores[iso] || 0;
                    const strong = score >= 4;

                    return (
                      <div key={iso} style={{ ...styles.scoreBox, ...(strong ? styles.scoreBoxStrong : {}) }}>
                        <div>{score}/8</div>
                        <div style={{ fontSize: "11px", marginTop: 4, opacity: 0.8 }}>
                          {strong ? "4+" : "Low"}
                        </div>
                      </div>
                    );
                  })}
                  <div style={styles.totalCell}>{currentWeekScore}/56</div>
                </div>

                <div style={styles.statPills}>
                  <div style={styles.pill}>
                    Week Score: <strong style={{ color: "#fff" }}>{currentWeekScore}/56</strong> ({getTier(currentWeekScore)})
                  </div>
                  <div style={styles.pill}>
                    Great Week Standard: <strong style={{ color: "#fff" }}>{greatWeekTarget}/56</strong>
                  </div>
                  <button style={styles.button} onClick={endWeek}>
                    End Week
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.sideColumn}>
            <div style={styles.card}>
              <SectionTitle emoji="🏆" title="Scoreboard" />
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Current Week</div>
                <div style={styles.statValue}>{currentWeekScore}/56</div>
                <div style={styles.statLabel}>{getTier(currentWeekScore)}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>All-Time Best Week</div>
                <div style={styles.statValue}>{bestWeek}/56</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Great Week Standard</div>
                <div style={styles.statValue}>{greatWeekTarget}/56</div>
              </div>
            </div>

            <div style={styles.card}>
              <SectionTitle emoji="🔥" title="Streak Engine" />
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Current Streak</div>
                <div style={styles.statValue}>{currentWeekStreak}</div>
                <div style={styles.statLabel}>Rule: 4+ points in a day</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Best Streak Ever</div>
                <div style={styles.statValue}>{bestDayStreakEver}</div>
                <div style={styles.statLabel}>Across all logged history</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Days This Week at 4+</div>
                <div style={styles.statValue}>{daysAtFourOrMore}/7</div>
              </div>
            </div>

            <div style={styles.card}>
              <SectionTitle emoji="🎁" title="Reward" />
              <div style={styles.statCard}>
                <div style={{ fontSize: "24px", fontWeight: 800 }}>{reward.label}</div>
                <div style={{ ...styles.statLabel, marginTop: 8 }}>{reward.detail}</div>
              </div>
            </div>

            <div style={styles.card}>
              <SectionTitle emoji="🗓️" title="Monthly Stats" />
              <div style={styles.miniRow}>
                <span style={styles.statLabel}>Weeks Logged This Month</span>
                <strong>{monthlyStats.totalWeeks}</strong>
              </div>
              <div style={styles.miniRow}>
                <span style={styles.statLabel}>Average Weekly Score</span>
                <strong>{monthlyStats.avgScore}/56</strong>
              </div>
              <div style={styles.miniRow}>
                <span style={styles.statLabel}>Best Week This Month</span>
                <strong>{monthlyStats.bestScore}/56</strong>
              </div>
              <div style={styles.miniRow}>
                <span style={styles.statLabel}>Elite Weeks</span>
                <strong>{monthlyStats.eliteWeeks}</strong>
              </div>
              <div style={styles.miniRow}>
                <span style={styles.statLabel}>Great Weeks</span>
                <strong>{monthlyStats.greatWeeks}</strong>
              </div>
            </div>

            <div style={styles.card}>
              <SectionTitle emoji="📈" title="Where You Fell Short" />
              {shortfalls.length === 0 ? (
                <div style={styles.statCard}>No shortfalls right now. You are on pace across every category.</div>
              ) : (
                shortfalls.map((item) => (
                  <div key={item.key} style={styles.miniRow}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.label}</div>
                      <div style={styles.statLabel}>
                        {item.total}/{item.target}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800 }}>-{item.shortfall}</div>
                      <div style={styles.statLabel}>behind target</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={styles.card}>
              <SectionTitle emoji="🕘" title="History" />
              {history.length === 0 ? (
                <div style={styles.statCard}>No weeks logged yet. Hit End Week when you finish your first week.</div>
              ) : (
                history.slice(0, 6).map((item, index) => (
                  <div key={`${item.weekEndISO}-${index}`} style={styles.miniRow}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.weekRangeLabel}</div>
                      <div style={styles.statLabel}>{item.tier}</div>
                    </div>
                    <div style={{ fontWeight: 800 }}>{item.score}/56</div>
                  </div>
                ))
              )}
            </div>

            <div style={styles.card}>
              <SectionTitle emoji="⭐" title="Win Condition" />
              <div style={styles.statCard}>
                A great week is built by consistency, not perfection. Hit your weekly targets, stay honest with the data, and let the rewards mean something.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}