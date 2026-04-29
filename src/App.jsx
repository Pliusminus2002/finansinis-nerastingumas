import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  BookOpen,
  CalendarDays,
  Home,
  Lightbulb,
  LineChart,
  PiggyBank,
  Plus,
  Target,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STORAGE_KEY = "finansinis-nerastingumas-data-v2";

const categories = [
  "Maistas",
  "Transportas",
  "Būstas",
  "Mokslai",
  "Pramogos",
  "Sveikata",
  "Taupymas",
  "Kita",
];

const categoryColors = [
  "#0f172a",
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#e11d48",
  "#7c3aed",
  "#0891b2",
  "#64748b",
];

const financialTips = [
  {
    title: "50/30/20 taisyklė",
    text: "50 % pajamų skirk būtinosioms išlaidoms, 30 % norams, o 20 % taupymui arba skolų mažinimui.",
  },
  {
    title: "Sek mažas išlaidas",
    text: "Kava, užkandžiai ir pavėžėjimai atrodo smulkūs, bet mėnesio pabaigoje gali sudaryti didelę sumą.",
  },
  {
    title: "Pirmiausia sumokėk sau",
    text: "Gavęs pajamas, iškart atsidėk dalį taupymui. Nelauk, kas liks mėnesio pabaigoje.",
  },
  {
    title: "Biudžetą skaidyk savaitėmis",
    text: "Studentui dažnai lengviau valdyti ne visą mėnesį, o savaitės limitą.",
  },
];

const defaultTransactions = [];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function eur(value) {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value || 0));
}

function readSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const [storedData] = useState(() => readSavedData());

  const [activePage, setActivePage] = useState("dashboard");

  const [transactions, setTransactions] = useState(() =>
    Array.isArray(storedData?.transactions)
      ? storedData.transactions
      : defaultTransactions
  );

  const [monthlyBudget, setMonthlyBudget] = useState(
    storedData?.monthlyBudget ?? "350"
  );

  const [savingGoal, setSavingGoal] = useState(
    storedData?.savingGoal ?? "100"
  );

  const [form, setForm] = useState({
    type: "expense",
    title: "",
    amount: "",
    category: "Maistas",
    date: today(),
    note: "",
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ transactions, monthlyBudget, savingGoal })
    );
  }, [transactions, monthlyBudget, savingGoal]);

  const month = currentMonth();

  const monthTransactions = useMemo(() => {
    return transactions.filter((item) => item.date?.startsWith(month));
  }, [transactions, month]);

  const totals = useMemo(() => {
    const income = monthTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expenses = monthTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const balance = income - expenses;
    const budgetLeft = Number(monthlyBudget || 0) - expenses;

    const budgetProgress =
      Number(monthlyBudget) > 0
        ? Math.min(100, (expenses / Number(monthlyBudget)) * 100)
        : 0;

    const savingProgress =
      Number(savingGoal) > 0
        ? Math.min(100, Math.max(0, (balance / Number(savingGoal)) * 100))
        : 0;

    return {
      income,
      expenses,
      balance,
      budgetLeft,
      budgetProgress,
      savingProgress,
    };
  }, [monthTransactions, monthlyBudget, savingGoal]);

  const categoryData = useMemo(() => {
    return categories
      .map((category) => ({
        name: category,
        value: monthTransactions
          .filter((item) => item.type === "expense" && item.category === category)
          .reduce((sum, item) => sum + Number(item.amount), 0),
      }))
      .filter((item) => item.value > 0);
  }, [monthTransactions]);

  const weeklyData = useMemo(() => {
    const result = [
      { name: "1 sav.", išlaidos: 0, pajamos: 0 },
      { name: "2 sav.", išlaidos: 0, pajamos: 0 },
      { name: "3 sav.", išlaidos: 0, pajamos: 0 },
      { name: "4 sav.", išlaidos: 0, pajamos: 0 },
      { name: "5 sav.", išlaidos: 0, pajamos: 0 },
    ];

    monthTransactions.forEach((item) => {
      const day = Number(item.date.slice(8, 10));
      const weekIndex = Math.min(4, Math.floor((day - 1) / 7));

      if (item.type === "expense") {
        result[weekIndex].išlaidos += Number(item.amount);
      }

      if (item.type === "income") {
        result[weekIndex].pajamos += Number(item.amount);
      }
    });

    return result;
  }, [monthTransactions]);

  const biggestCategory = categoryData.length
    ? [...categoryData].sort((a, b) => b.value - a.value)[0]
    : null;

  function addTransaction(event) {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!form.title.trim() || !amount || amount <= 0) {
      alert("Įrašyk pavadinimą ir teisingą sumą.");
      return;
    }

    setTransactions((old) => [
      {
        id: crypto.randomUUID(),
        type: form.type,
        title: form.title.trim(),
        amount,
        category: form.type === "income" ? "Kita" : form.category,
        date: form.date || today(),
        note: form.note.trim(),
      },
      ...old,
    ]);

    setForm({
      type: "expense",
      title: "",
      amount: "",
      category: "Maistas",
      date: today(),
      note: "",
    });

    setActivePage("dashboard");
  }

  function deleteTransaction(id) {
    setTransactions((old) => old.filter((item) => item.id !== id));
  }

  function clearMyData() {
    const confirmed = window.confirm(
      "Ar tikrai nori ištrinti savo duomenis ir pradėti iš naujo?"
    );

    if (!confirmed) return;

    const freshData = {
      transactions: [],
      monthlyBudget: "350",
      savingGoal: "100",
    };

    setTransactions(freshData.transactions);
    setMonthlyBudget(freshData.monthlyBudget);
    setSavingGoal(freshData.savingGoal);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
    setActivePage("dashboard");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <PiggyBank size={24} />
          </div>

          <div>
            <strong>Finansinis neraštingumas</strong>
            <span>studentų finansų programėlė</span>
          </div>
        </div>

        <nav className="menu">
          <NavButton
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
            icon={Home}
            label="Apžvalga"
          />

          <NavButton
            active={activePage === "add"}
            onClick={() => setActivePage("add")}
            icon={Plus}
            label="Įvesti"
          />

          <NavButton
            active={activePage === "budget"}
            onClick={() => setActivePage("budget")}
            icon={Target}
            label="Biudžetas"
          />

          <NavButton
            active={activePage === "tips"}
            onClick={() => setActivePage("tips")}
            icon={Lightbulb}
            label="Patarimai"
          />

          <NavButton
            active={activePage === "about"}
            onClick={() => setActivePage("about")}
            icon={BookOpen}
            label="Apie projektą"
          />
        </nav>

        <div className="sidebar-note">
          <span>Šio mėnesio likutis</span>
          <strong>{eur(totals.balance)}</strong>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Studentų finansų valdymo programėlė</p>
            <h1>{pageTitle(activePage)}</h1>
          </div>

          <div className="month-pill">
            <CalendarDays size={18} />
            <span>{month}</span>
          </div>
        </header>

        {activePage === "dashboard" && (
          <section className="page-grid">
            <div className="stats-grid">
              <StatCard
                icon={ArrowUpCircle}
                title="Pajamos"
                value={eur(totals.income)}
                positive
              />

              <StatCard
                icon={ArrowDownCircle}
                title="Išlaidos"
                value={eur(totals.expenses)}
                negative
              />

              <StatCard
                icon={Wallet}
                title="Likutis"
                value={eur(totals.balance)}
              />

              <StatCard
                icon={Target}
                title="Biudžeto likutis"
                value={eur(totals.budgetLeft)}
              />
            </div>

            <div className="content-grid two">
              <Card title="Savaitinė finansų eiga" icon={LineChart}>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient
                          id="incomeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22c55e"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#22c55e"
                            stopOpacity={0}
                          />
                        </linearGradient>

                        <linearGradient
                          id="expenseGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => eur(value)} />

                      <Area
                        type="monotone"
                        dataKey="pajamos"
                        stroke="#16a34a"
                        fill="url(#incomeGradient)"
                        strokeWidth={3}
                      />

                      <Area
                        type="monotone"
                        dataKey="išlaidos"
                        stroke="#ef4444"
                        fill="url(#expenseGradient)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Išlaidos pagal kategorijas" icon={BarChart3}>
                {categoryData.length ? (
                  <div className="chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={56}
                          outerRadius={94}
                          paddingAngle={3}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={categoryColors[index % categoryColors.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip formatter={(value) => eur(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <Empty text="Dar nėra išlaidų duomenų." />
                )}
              </Card>
            </div>

            <div className="content-grid two">
              <Card title="Finansiniai įpročiai" icon={PiggyBank}>
                <div className="habit-list">
                  <InfoRow
                    label="Didžiausia kategorija"
                    value={
                      biggestCategory
                        ? `${biggestCategory.name} (${eur(biggestCategory.value)})`
                        : "Nėra duomenų"
                    }
                  />

                  <InfoRow
                    label="Biudžeto panaudojimas"
                    value={`${Math.round(totals.budgetProgress)}%`}
                  />

                  <InfoRow
                    label="Taupymo tikslo progresas"
                    value={`${Math.round(totals.savingProgress)}%`}
                  />

                  <Progress label="Biudžetas" value={totals.budgetProgress} />
                  <Progress label="Taupymas" value={totals.savingProgress} />
                </div>
              </Card>

              <Card title="Naujausios operacijos" icon={Wallet}>
                <TransactionList
                  transactions={transactions.slice(0, 7)}
                  onDelete={deleteTransaction}
                  compact
                />
              </Card>
            </div>
          </section>
        )}

        {activePage === "add" && (
          <section className="content-grid two">
            <Card title="Naujas įrašas" icon={Plus}>
              <form className="form" onSubmit={addTransaction}>
                <div className="type-switch">
                  <button
                    type="button"
                    className={form.type === "expense" ? "active" : ""}
                    onClick={() =>
                      setForm((old) => ({ ...old, type: "expense" }))
                    }
                  >
                    Išlaidos
                  </button>

                  <button
                    type="button"
                    className={form.type === "income" ? "active" : ""}
                    onClick={() =>
                      setForm((old) => ({ ...old, type: "income" }))
                    }
                  >
                    Pajamos
                  </button>
                </div>

                <Label title="Pavadinimas">
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Pvz., pietūs, stipendija, darbas"
                  />
                </Label>

                <Label title="Suma, €">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        amount: event.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </Label>

                {form.type === "expense" && (
                  <Label title="Kategorija">
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm((old) => ({
                          ...old,
                          category: event.target.value,
                        }))
                      }
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </Label>
                )}

                <Label title="Data">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        date: event.target.value,
                      }))
                    }
                  />
                </Label>

                <Label title="Pastaba">
                  <textarea
                    value={form.note}
                    onChange={(event) =>
                      setForm((old) => ({
                        ...old,
                        note: event.target.value,
                      }))
                    }
                    placeholder="Nebūtina"
                    rows="3"
                  />
                </Label>

                <button className="primary-button" type="submit">
                  Pridėti įrašą
                </button>
              </form>
            </Card>

            <Card title="Visi įrašai" icon={Wallet}>
              <TransactionList
                transactions={transactions}
                onDelete={deleteTransaction}
              />
            </Card>
          </section>
        )}

        {activePage === "budget" && (
          <section className="content-grid two">
            <Card title="Biudžeto planavimas" icon={Target}>
              <div className="form">
                <Label title="Mėnesio išlaidų biudžetas, €">
                  <input
                    type="number"
                    min="0"
                    value={monthlyBudget}
                    onChange={(event) =>
                      setMonthlyBudget(event.target.value)
                    }
                    placeholder="Įrašyk mėnesio biudžetą"
                  />
                </Label>

                <Label title="Taupymo tikslas, €">
                  <input
                    type="number"
                    min="0"
                    value={savingGoal}
                    onChange={(event) => setSavingGoal(event.target.value)}
                    placeholder="Įrašyk taupymo tikslą"
                  />
                </Label>

                <div className="summary-box">
                  <span>Šį mėnesį išleista</span>
                  <strong>{eur(totals.expenses)}</strong>
                  <p>Liko iki biudžeto ribos: {eur(totals.budgetLeft)}</p>
                </div>

                <button
                  className="secondary-button danger-button"
                  type="button"
                  onClick={clearMyData}
                >
                  Ištrinti mano duomenis ir pradėti iš naujo
                </button>
              </div>
            </Card>

            <Card title="Biudžeto grafikas" icon={BarChart3}>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Biudžetas", suma: Number(monthlyBudget || 0) },
                      { name: "Išlaidos", suma: totals.expenses },
                      {
                        name: "Likutis",
                        suma: Math.max(0, totals.budgetLeft),
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => eur(value)} />
                    <Bar
                      dataKey="suma"
                      fill="#0f172a"
                      radius={[12, 12, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        )}

        {activePage === "tips" && (
          <section className="tips-grid">
            {financialTips.map((tip, index) => (
              <article className="tip-card" key={tip.title}>
                <div className="tip-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h2>{tip.title}</h2>
                <p>{tip.text}</p>
              </article>
            ))}
          </section>
        )}

        {activePage === "about" && (
          <section className="content-grid two">
            <Card title="Apie programėlę" icon={BookOpen}>
              <div className="text-block">
                <p>
                  „Finansinis neraštingumas“ – tai studentams skirta finansų
                  valdymo programėlė, padedanti sekti pajamas, išlaidas,
                  planuoti biudžetą ir formuoti geresnius finansinius įpročius.
                </p>

                <p>
                  Programėlė veikia kaip web app. Ją galima atidaryti
                  kompiuteryje arba telefone. Telefone ją galima įsidėti į
                  pradžios ekraną ir naudoti panašiai kaip įprastą programėlę.
                </p>

                <ul>
                  <li>Pajamų ir išlaidų įvedimas</li>
                  <li>Išlaidų kategorijų analizė</li>
                  <li>Mėnesio biudžeto planavimas</li>
                  <li>Finansiniai patarimai studentams</li>
                  <li>Duomenų saugojimas naršyklėje</li>
                </ul>
              </div>
            </Card>

            <Card title="Kaip naudoti telefone?" icon={Home}>
              <div className="text-block">
                <p>
                  Atsidaryk svetainės nuorodą telefone. Naršyklėje pasirink
                  „Add to Home Screen“ arba „Pridėti prie pradžios ekrano“.
                  Tada programėlė atsiras telefone kaip atskira ikona.
                </p>
              </div>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}

function pageTitle(page) {
  const titles = {
    dashboard: "Finansų apžvalga",
    add: "Pajamos ir išlaidos",
    budget: "Biudžeto planavimas",
    tips: "Finansiniai patarimai",
    about: "Apie projektą",
  };

  return titles[page] || "Finansai";
}

function NavButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      className={active ? "nav-button active" : "nav-button"}
      onClick={onClick}
    >
      <Icon size={19} />
      <span>{label}</span>
    </button>
  );
}

function Card({ title, icon: Icon, children }) {
  return (
    <article className="card">
      <div className="card-header">
        <div className="card-icon">
          <Icon size={18} />
        </div>

        <h2>{title}</h2>
      </div>

      {children}
    </article>
  );
}

function StatCard({ icon: Icon, title, value, positive, negative }) {
  return (
    <article className="stat-card">
      <div
        className={
          positive
            ? "stat-icon positive"
            : negative
              ? "stat-icon negative"
              : "stat-icon"
        }
      >
        <Icon size={22} />
      </div>

      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Label({ title, children }) {
  return (
    <label className="label">
      <span>{title}</span>
      {children}
    </label>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Progress({ label, value }) {
  return (
    <div className="progress-wrap">
      <div className="progress-top">
        <span>{label}</span>
        <strong>{Math.round(value)}%</strong>
      </div>

      <div className="progress-bar">
        <div style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

function TransactionList({ transactions, onDelete, compact }) {
  if (!transactions.length) {
    return <Empty text="Įrašų dar nėra." />;
  }

  return (
    <div className={compact ? "transaction-list compact" : "transaction-list"}>
      {transactions.map((item) => (
        <div className="transaction" key={item.id}>
          <div
            className={
              item.type === "income"
                ? "transaction-dot income"
                : "transaction-dot expense"
            }
          />

          <div className="transaction-main">
            <strong>{item.title}</strong>

            <span>
              {item.date} • {item.type === "income" ? "Pajamos" : item.category}
            </span>

            {!compact && item.note && <p>{item.note}</p>}
          </div>

          <div className="transaction-side">
            <strong
              className={
                item.type === "income" ? "income-text" : "expense-text"
              }
            >
              {item.type === "income" ? "+" : "-"}
              {eur(item.amount)}
            </strong>

            <button onClick={() => onDelete(item.id)} title="Ištrinti">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty({ text }) {
  return <div className="empty">{text}</div>;
}
