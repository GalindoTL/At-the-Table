const {
  useState,
  useEffect,
  useMemo
} = React;

/* ---------- palette & type ---------- */
const C = {
  paper: "#FAF5EA",
  ink: "#23372B",
  muted: "#6E7A67",
  turmeric: "#E0A11C",
  tomato: "#C6432C",
  sage: "#CBD4BE",
  card: "#FFFDF7",
  teal: "#2E7D74"
};
const PCOLOR = ["#2E7D74", "#C97A1E"];
const Fonts = () => /*#__PURE__*/React.createElement("style", null, `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito+Sans:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; }
    .disp { font-family: 'Fraunces', Georgia, serif; }
    .body { font-family: 'Nunito Sans', ui-sans-serif, system-ui, sans-serif; }
    @keyframes pop { from { transform: scale(.96); opacity: 0 } to { transform: scale(1); opacity: 1 } }
    @keyframes drop { from { transform: scale(.7); opacity: 0 } to { transform: scale(1); opacity: 1 } }
    button { font-family: inherit; cursor: pointer; }
    input, select { font-family: inherit; }
    ::-webkit-scrollbar { width: 8px; height: 8px }
    ::-webkit-scrollbar-thumb { background: ${C.sage}; border-radius: 8px }
    .print-sheet { display: none; }
    @media print {
      .screen-only { display: none !important; }
      .print-sheet { display: block !important; }
      @page { margin: 12mm; }
    }
  `);

/* ---------- days (index 0..6 = Sun..Sat, no calendar dates) ---------- */
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK = [0, 1, 2, 3, 4, 5, 6];
const eatByIdx = (cookIdx, keeps) => Math.min(6, cookIdx + keeps);
const initials = name => (name || "?").trim().slice(0, 2) || "?";
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const MEAL_KEYS = [{
  id: "breakfast",
  label: "Breakfast"
}, {
  id: "lunch",
  label: "Lunch"
}, {
  id: "dinner",
  label: "Dinner"
}];
const STYLE_TAGS = [{
  id: "comfort",
  label: "Comfort food"
}, {
  id: "fast",
  label: "Fast food"
}];
const catColor = c => ({
  chicken: C.teal,
  beef: C.tomato,
  pork: C.turmeric,
  seafood: "#3B6FB0",
  other: C.muted
})[c] || C.muted;
const catLabel = c => ({
  chicken: "Chicken",
  beef: "Beef",
  pork: "Pork",
  seafood: "Seafood",
  other: "Other"
})[c] || "Other";

/* ---------- 24 preloaded recipes ---------- */
const ing = (name, qty) => ({
  name,
  qty
});
const R = o => ({
  meals: ["lunch", "dinner"],
  tags: [],
  serves: 4,
  ...o
});
const DEFAULT_RECIPES = [R({
  id: "A",
  letter: "A",
  cat: "chicken",
  lasts: 3,
  freezer: false,
  name: "Chicken thighs with garlic ranch & parmesan",
  side: "Roasted chickpeas & carrots",
  ingredients: [ing("Boneless chicken thighs", "1.5 lb"), ing("Garlic", "4 cloves"), ing("Ranch seasoning", "2 tbsp"), ing("Parmesan", "1/2 cup"), ing("Chickpeas", "1 can"), ing("Carrots", "3"), ing("Olive oil", "to taste")]
}), R({
  id: "B",
  letter: "B",
  cat: "chicken",
  lasts: 2,
  freezer: false,
  name: "Chicken tonkatsu",
  side: "Rice & stir-fried carrot and broccoli",
  ingredients: [ing("Chicken breast", "1.5 lb"), ing("Panko", "1.5 cup"), ing("Eggs", "2"), ing("Flour", "1/2 cup"), ing("Tonkatsu sauce", "1 jar"), ing("Rice", "2 cups"), ing("Carrots", "2"), ing("Broccoli", "1")]
}), R({
  id: "C",
  letter: "C",
  cat: "pork",
  lasts: 4,
  freezer: false,
  tags: ["comfort"],
  name: "Pork adobo",
  side: "Rice & garlic-sautéed green beans",
  ingredients: [ing("Pork shoulder", "1.5 lb"), ing("Soy sauce", "1/2 cup"), ing("Vinegar", "1/3 cup"), ing("Garlic", "6 cloves"), ing("Bay leaves", "3"), ing("Peppercorns", "1 tbsp"), ing("Rice", "2 cups"), ing("Green beans", "1/2 lb")]
}), R({
  id: "D",
  letter: "D",
  cat: "pork",
  lasts: 3,
  freezer: false,
  tags: ["comfort"],
  name: "Pork BBQ ribs",
  side: "Rice & buttered corn",
  ingredients: [ing("Pork ribs", "2 lb"), ing("BBQ sauce", "1 cup"), ing("Brown sugar", "2 tbsp"), ing("Garlic powder", "1 tbsp"), ing("Rice", "2 cups"), ing("Corn kernels", "2 cups"), ing("Butter", "2 tbsp")]
}), R({
  id: "E",
  letter: "E",
  cat: "beef",
  lasts: 3,
  freezer: false,
  name: "Beef strips ala Hilda",
  side: "Rice & buttered peas and carrots",
  ingredients: [ing("Beef strips", "1.25 lb"), ing("Soy sauce", "3 tbsp"), ing("Garlic", "4 cloves"), ing("Onion", "1"), ing("Bell pepper", "1"), ing("Rice", "2 cups"), ing("Peas", "1 cup"), ing("Carrots", "2"), ing("Butter", "2 tbsp")]
}), R({
  id: "F",
  letter: "F",
  cat: "beef",
  lasts: 3,
  freezer: false,
  name: "Mongolian beef",
  side: "Rice & garlic green beans",
  ingredients: [ing("Flank steak", "1.25 lb"), ing("Soy sauce", "1/3 cup"), ing("Brown sugar", "1/4 cup"), ing("Garlic", "4 cloves"), ing("Ginger", "1 piece"), ing("Cornstarch", "3 tbsp"), ing("Green onion", "1 bunch"), ing("Rice", "2 cups"), ing("Green beans", "1/2 lb")]
}), R({
  id: "G",
  letter: "G",
  cat: "seafood",
  lasts: 1,
  freezer: false,
  name: "Shrimp tempura",
  side: "Stir-fried noodles with cabbage & carrot",
  ingredients: [ing("Shrimp", "1 lb"), ing("Tempura flour", "1 cup"), ing("Egg", "1"), ing("Frying oil", "to taste"), ing("Noodles", "8 oz"), ing("Cabbage", "1/4"), ing("Carrots", "2")]
}), R({
  id: "H",
  letter: "H",
  cat: "beef",
  lasts: 3,
  freezer: false,
  name: "Ginisang cabbage with ground beef",
  side: "Rice & tuna patties",
  ingredients: [ing("Ground beef", "1 lb"), ing("Cabbage", "1/2"), ing("Carrots", "2"), ing("Garlic", "4 cloves"), ing("Onion", "1"), ing("Soy sauce", "2 tbsp"), ing("Rice", "2 cups"), ing("Canned tuna", "2 cans"), ing("Egg", "1"), ing("Breadcrumbs", "1/2 cup")]
}), R({
  id: "I",
  letter: "I",
  cat: "chicken",
  lasts: 3,
  freezer: false,
  name: "Korean BBQ chicken quinoa bowls",
  side: "Corn",
  ingredients: [ing("Chicken thighs", "1.25 lb"), ing("Korean BBQ sauce / gochujang", "3 tbsp"), ing("Soy sauce", "2 tbsp"), ing("Garlic", "3 cloves"), ing("Ginger", "1 piece"), ing("Quinoa", "1.5 cup"), ing("Corn kernels", "2 cups")]
}), R({
  id: "J",
  letter: "J",
  cat: "chicken",
  lasts: 4,
  freezer: false,
  tags: ["comfort"],
  name: "Chicken curry with potato & carrot",
  side: "Rice",
  ingredients: [ing("Chicken", "1.5 lb"), ing("Curry powder", "2 tbsp"), ing("Coconut milk", "1 can"), ing("Potatoes", "2"), ing("Carrots", "2"), ing("Onion", "1"), ing("Garlic", "4 cloves"), ing("Rice", "2 cups")]
}), R({
  id: "K",
  letter: "K",
  cat: "chicken",
  lasts: 3,
  freezer: false,
  name: "Korean BBQ chicken bites with mushroom & chickpeas",
  side: "Quinoa or rice",
  ingredients: [ing("Chicken", "1.25 lb"), ing("Korean BBQ sauce", "3 tbsp"), ing("Mushrooms", "8 oz"), ing("Chickpeas", "1 can"), ing("Chili flakes", "1 tsp"), ing("Black sesame", "1 tbsp"), ing("Quinoa", "1.5 cup")]
}), R({
  id: "L",
  letter: "L",
  cat: "beef",
  lasts: 3,
  freezer: false,
  tags: ["comfort"],
  name: "Filipino beef patties with mushroom gravy",
  side: "Mashed potatoes & sautéed veggies",
  ingredients: [ing("Ground beef", "1 lb"), ing("Breadcrumbs", "1/2 cup"), ing("Egg", "1"), ing("Onion", "1"), ing("Mushrooms", "8 oz"), ing("Beef broth", "1 cup"), ing("Flour", "2 tbsp"), ing("Potatoes", "3"), ing("Butter", "2 tbsp"), ing("Milk", "1/2 cup"), ing("Mixed veggies", "2 cups")]
}), R({
  id: "M",
  letter: "M",
  cat: "beef",
  lasts: 2,
  freezer: false,
  name: "Steak with green chimichurri",
  side: "Potatoes",
  ingredients: [ing("Beef steak", "1.25 lb"), ing("Parsley", "1 bunch"), ing("Cilantro", "1/2 bunch"), ing("Garlic", "4 cloves"), ing("Olive oil", "1/2 cup"), ing("Red wine vinegar", "3 tbsp"), ing("Potatoes", "3")]
}), R({
  id: "N",
  letter: "N",
  cat: "chicken",
  lasts: 4,
  freezer: true,
  tags: ["comfort"],
  name: "Chicken enchiladas (freezer prep)",
  side: "—",
  ingredients: [ing("Chicken", "1.5 lb"), ing("Tortillas", "10"), ing("Enchilada sauce", "2 cans"), ing("Cheese", "2 cups"), ing("Onion", "1"), ing("Beans", "1 can")]
}), R({
  id: "O",
  letter: "O",
  cat: "chicken",
  lasts: 2,
  freezer: false,
  tags: ["comfort"],
  name: "Creamy roasted garlic parmesan fettuccine with tenders",
  side: "—",
  ingredients: [ing("Fettuccine", "12 oz"), ing("Chicken tenders", "1 lb"), ing("Garlic", "1 head"), ing("Heavy cream", "1 cup"), ing("Parmesan", "1 cup"), ing("Butter", "2 tbsp")]
}), R({
  id: "P",
  letter: "P",
  cat: "chicken",
  lasts: 2,
  freezer: false,
  name: "Thai basil ground chicken",
  side: "Rice",
  ingredients: [ing("Ground chicken", "1 lb"), ing("Thai basil", "1 bunch"), ing("Garlic", "4 cloves"), ing("Chili", "2"), ing("Fish sauce", "2 tbsp"), ing("Soy sauce", "2 tbsp"), ing("Rice", "2 cups")]
}), R({
  id: "Q",
  letter: "Q",
  cat: "chicken",
  lasts: 3,
  freezer: false,
  name: "Ground chicken with black beans & corn over quinoa",
  side: "—",
  ingredients: [ing("Ground chicken", "1 lb"), ing("Black beans", "1 can"), ing("Corn kernels", "1.5 cup"), ing("Quinoa", "1.5 cup"), ing("Cumin", "1 tsp"), ing("Onion", "1"), ing("Garlic", "3 cloves")]
}), R({
  id: "R",
  letter: "R",
  cat: "beef",
  lasts: 3,
  freezer: false,
  tags: ["fast"],
  name: "Ground beef for tostadas",
  side: "—",
  ingredients: [ing("Ground beef", "1 lb"), ing("Tostada shells", "8"), ing("Beans", "1 can"), ing("Lettuce", "1/2"), ing("Tomato", "2"), ing("Cheese", "1 cup"), ing("Sour cream", "1/2 cup")]
}), R({
  id: "S",
  letter: "S",
  cat: "pork",
  lasts: 1,
  freezer: false,
  tags: ["fast"],
  name: "Pork burgers",
  side: "—",
  ingredients: [ing("Ground pork", "1 lb"), ing("Burger buns", "4"), ing("Onion", "1"), ing("Garlic", "2 cloves"), ing("Breadcrumbs", "1/4 cup"), ing("Egg", "1"), ing("Lettuce", "a few leaves"), ing("Tomato", "1")]
}), R({
  id: "T",
  letter: "T",
  cat: "beef",
  lasts: 1,
  freezer: false,
  tags: ["fast", "comfort"],
  name: "Beef burgers",
  side: "—",
  ingredients: [ing("Ground beef", "1 lb"), ing("Burger buns", "4"), ing("Cheese", "4 slices"), ing("Lettuce", "a few leaves"), ing("Tomato", "1"), ing("Onion", "1")]
}), R({
  id: "U",
  letter: "U",
  cat: "other",
  lasts: 3,
  freezer: false,
  tags: ["comfort"],
  name: "Turkey meatballs",
  side: "—",
  ingredients: [ing("Ground turkey", "1 lb"), ing("Breadcrumbs", "1/2 cup"), ing("Egg", "1"), ing("Parmesan", "1/2 cup"), ing("Garlic", "3 cloves"), ing("Marinara sauce", "1 jar")]
}), R({
  id: "V",
  letter: "V",
  cat: "chicken",
  lasts: 3,
  freezer: false,
  tags: ["fast"],
  name: "Chicken burrito",
  side: "—",
  ingredients: [ing("Chicken", "1 lb"), ing("Flour tortillas", "4"), ing("Rice", "1 cup"), ing("Beans", "1 can"), ing("Cheese", "1 cup"), ing("Salsa", "to taste")]
}), R({
  id: "W",
  letter: "W",
  cat: "pork",
  lasts: 3,
  freezer: false,
  name: "Garlic herb pork with portobello",
  side: "—",
  ingredients: [ing("Pork loin", "1.25 lb"), ing("Portobello", "8 oz"), ing("Garlic", "4 cloves"), ing("Thyme", "1 tsp"), ing("Rosemary", "1 tsp"), ing("Olive oil", "3 tbsp"), ing("Butter", "2 tbsp")]
}), R({
  id: "X",
  letter: "X",
  cat: "chicken",
  lasts: 4,
  freezer: false,
  name: "One-pan lemon herb chicken with potatoes & chickpeas",
  side: "—",
  ingredients: [ing("Chicken thighs", "1.5 lb"), ing("Potatoes", "3"), ing("Chickpeas", "1 can"), ing("Lemon", "1"), ing("Garlic", "4 cloves"), ing("Rosemary", "1 tsp"), ing("Olive oil", "3 tbsp")]
})];

/* ---------- persistence ---------- */
const K = {
  rec: "mp:recipes",
  cook: "mp:cookplan4",
  have: "mp:have",
  extra: "mp:extra",
  ppl: "mp:people"
};
async function loadKey(key, fb) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
}
async function saveKey(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

/* ================================================================ */
function App() {
  const [tab, setTab] = useState("schedule");
  const [ready, setReady] = useState(false);
  const [recipes, setRecipes] = useState(DEFAULT_RECIPES);
  const [cook, setCook] = useState([]); // [{id, recipeId, plates, cookDay, servings:[{id,day,meal,person}]}]
  const [have, setHave] = useState({});
  const [extra, setExtra] = useState([]);
  const [people, setPeople] = useState(["Luis", "Mónica"]);
  const [picker, setPicker] = useState(false);
  const [backup, setBackup] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [pendingAdd, setPendingAdd] = useState(false);
  useEffect(() => {
    (async () => {
      setRecipes(await loadKey(K.rec, DEFAULT_RECIPES));
      setCook(await loadKey(K.cook, []));
      setHave(await loadKey(K.have, {}));
      setExtra(await loadKey(K.extra, []));
      const _ppl = await loadKey(K.ppl, ["Luis", "Mónica"]);
      if (_ppl[0] === "Me") _ppl[0] = "Luis";
      setPeople(_ppl);
      setReady(true);
    })();
  }, []);
  useEffect(() => {
    if (ready) saveKey(K.rec, recipes);
  }, [recipes, ready]);
  useEffect(() => {
    if (ready) saveKey(K.cook, cook);
  }, [cook, ready]);
  useEffect(() => {
    if (ready) saveKey(K.have, have);
  }, [have, ready]);
  useEffect(() => {
    if (ready) saveKey(K.extra, extra);
  }, [extra, ready]);
  useEffect(() => {
    if (ready) saveKey(K.ppl, people);
  }, [people, ready]);
  const recById = useMemo(() => Object.fromEntries(recipes.map(r => [r.id, r])), [recipes]);
  function addDish(recipeId) {
    const r = recById[recipeId];
    setCook(prev => [...prev, {
      id: uid(),
      recipeId,
      plates: r?.serves || 4,
      cookDay: 0,
      servings: []
    }]);
    setPicker(false);
  }
  const updateDish = (id, patch) => setCook(prev => prev.map(c => c.id === id ? {
    ...c,
    ...patch
  } : c));
  const removeDish = id => setCook(prev => prev.filter(c => c.id !== id));
  function resetWeek() {
    if (!window.confirm("Start a fresh week? This clears the dishes, the schedule and the shopping list. Your recipes and names stay.")) return;
    setCook([]);
    setHave({});
    setExtra([]);
  }
  function doExport() {
    const data = {
      v: 1,
      recipes,
      cook,
      people,
      have,
      extra
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "at-the-table-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  function doImport(file) {
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const d = JSON.parse(rd.result);
        if (Array.isArray(d.recipes)) setRecipes(d.recipes);
        if (Array.isArray(d.cook)) setCook(d.cook);
        if (Array.isArray(d.people)) setPeople(d.people);
        if (d.have && typeof d.have === "object") setHave(d.have);
        if (Array.isArray(d.extra)) setExtra(d.extra);
        setBackup(false);
        alert("Backup restored \u2713");
      } catch (e) {
        alert("Couldn't read that backup file.");
      }
    };
    rd.readAsText(file);
  }
  const shoppingGroups = useMemo(() => {
    const byRec = new Map();
    for (const c of cook) {
      const r = recById[c.recipeId];
      if (!r) continue;
      if (!byRec.has(r.id)) byRec.set(r.id, {
        id: r.id,
        letter: r.letter,
        name: r.name,
        cat: r.cat,
        count: 0,
        ingredients: r.ingredients
      });
      byRec.get(r.id).count++;
    }
    return Array.from(byRec.values());
  }, [cook, recById]);
  const allIngredientNames = useMemo(() => {
    const s = new Set();
    for (const g of shoppingGroups) for (const it of g.ingredients) s.add(it.name.toLowerCase());
    return [...s];
  }, [shoppingGroups]);
  const unplaced = useMemo(() => cook.reduce((a, c) => a + Math.max(0, c.plates - (c.servings?.length || 0)), 0), [cook]);
  function saveRecipe(r) {
    const isNew = editRec === "new";
    setRecipes(prev => isNew ? [...prev, r] : prev.map(x => x.id === r.id ? r : x));
    if (isNew && pendingAdd) {
      addDish(r.id);
      setPendingAdd(false);
    }
    setEditRec(null);
  }
  if (!ready) return /*#__PURE__*/React.createElement("div", {
    className: "body",
    style: {
      background: C.paper,
      minHeight: "100vh"
    }
  });
  const pendingBuy = allIngredientNames.filter(n => !have[n]).length + extra.filter(e => !e.have).length;
  return /*#__PURE__*/React.createElement("div", {
    className: "body",
    style: {
      background: C.paper,
      minHeight: "100vh",
      color: C.ink
    }
  }, /*#__PURE__*/React.createElement(Fonts, null), /*#__PURE__*/React.createElement("div", {
    className: "screen-only"
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      padding: "20px 16px 12px",
      maxWidth: 940,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: C.ink,
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(ChefHat, {
    size: 22,
    color: C.turmeric
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "disp",
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: -0.5
    }
  }, "At the Table"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12.5,
      color: C.muted
    }
  }, "Weekly meal planner"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: resetWeek,
    title: "Reset week",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "#fff",
      border: `1.5px solid ${C.sage}`,
      borderRadius: 12,
      padding: "9px 11px",
      fontWeight: 800,
      fontSize: 13,
      color: C.tomato
    }
  }, /*#__PURE__*/React.createElement(RotateCcw, {
    size: 15
  }), " Reset"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setBackup(true),
    title: "Backup",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "#fff",
      border: `1.5px solid ${C.sage}`,
      borderRadius: 12,
      padding: "9px 11px",
      fontWeight: 800,
      fontSize: 13,
      color: C.ink
    }
  }, /*#__PURE__*/React.createElement(DatabaseBackup, {
    size: 15
  }), " Backup"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.print(),
    title: "Print / Save PDF",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "#fff",
      border: `1.5px solid ${C.sage}`,
      borderRadius: 12,
      padding: "9px 11px",
      fontWeight: 800,
      fontSize: 13,
      color: C.ink
    }
  }, /*#__PURE__*/React.createElement(Printer, {
    size: 15
  }), " PDF"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 30,
      background: C.paper,
      borderBottom: `1px solid ${C.sage}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      maxWidth: 940,
      margin: "0 auto",
      padding: "0 10px",
      overflowX: "auto"
    }
  }, [["schedule", "Schedule", CalendarRange], ["cook", "Dishes", ChefHat], ["shopping", "Shopping", ShoppingBasket], ["recipes", "Recipes", BookOpen]].map(([id, label, Icon]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setTab(id),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "12px 12px",
      border: "none",
      background: "none",
      whiteSpace: "nowrap",
      borderBottom: tab === id ? `3px solid ${C.turmeric}` : "3px solid transparent",
      color: tab === id ? C.ink : C.muted,
      fontWeight: tab === id ? 800 : 600,
      fontSize: 14.5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 16
  }), " ", label, id === "schedule" && unplaced > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      background: C.turmeric,
      color: "#fff",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 800,
      padding: "1px 6px"
    }
  }, unplaced), id === "shopping" && pendingBuy > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      background: C.tomato,
      color: "#fff",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 800,
      padding: "1px 7px"
    }
  }, pendingBuy))))), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 940,
      margin: "0 auto",
      padding: "14px 14px 60px"
    }
  }, tab === "schedule" && /*#__PURE__*/React.createElement(ScheduleView, {
    cook: cook,
    recById: recById,
    people: people,
    onUpdate: updateDish,
    onAdd: () => setPicker(true),
    goDishes: () => setTab("cook")
  }), tab === "cook" && /*#__PURE__*/React.createElement(DishesView, {
    cook: cook,
    recById: recById,
    people: people,
    setPeople: setPeople,
    onAdd: () => setPicker(true),
    onUpdate: updateDish,
    onRemove: removeDish
  }), tab === "shopping" && /*#__PURE__*/React.createElement(ShoppingView, {
    groups: shoppingGroups,
    have: have,
    setHave: setHave,
    extra: extra,
    setExtra: setExtra
  }), tab === "recipes" && /*#__PURE__*/React.createElement(RecipesView, {
    recipes: recipes,
    onEdit: setEditRec,
    onNew: () => setEditRec("new")
  }))), /*#__PURE__*/React.createElement(PrintSheet, {
    cook: cook,
    recById: recById,
    people: people,
    groups: shoppingGroups,
    have: have,
    extra: extra.filter(e => !e.have)
  }), backup && /*#__PURE__*/React.createElement(BackupModal, {
    onClose: () => setBackup(false),
    onExport: doExport,
    onImport: doImport
  }), picker && /*#__PURE__*/React.createElement(RecipePicker, {
    recipes: recipes,
    onClose: () => setPicker(false),
    onChoose: addDish,
    onNew: () => {
      setPendingAdd(true);
      setPicker(false);
      setEditRec("new");
    }
  }), editRec && /*#__PURE__*/React.createElement(RecipeEditor, {
    recipe: editRec === "new" ? null : editRec,
    onClose: () => {
      setEditRec(null);
      setPendingAdd(false);
    },
    onSave: saveRecipe,
    onDelete: id => {
      setRecipes(prev => prev.filter(x => x.id !== id));
      setEditRec(null);
      setPendingAdd(false);
    }
  }));
}

/* ---------------- Schedule (tray + weekly grid, tap to place) ---------------- */
function ScheduleView({
  cook,
  recById,
  people,
  onUpdate,
  onAdd,
  goDishes
}) {
  const [selId, setSelId] = useState(null);
  const remaining = c => c.plates - (c.servings?.length || 0);
  const sel = cook.find(c => c.id === selId) || null;
  const selRec = sel ? recById[sel.recipeId] : null;
  const selEatBy = sel && selRec ? eatByIdx(sel.cookDay || 0, selRec.lasts) : null;
  const inWindow = (c, dayIdx) => {
    const r = recById[c.recipeId];
    return dayIdx >= (c.cookDay || 0) && dayIdx <= eatByIdx(c.cookDay || 0, r.lasts);
  };
  const byCell = useMemo(() => {
    const map = {};
    for (const c of cook) for (const s of c.servings || []) {
      const k = `${s.day}|${s.meal}`;
      (map[k] ||= []).push({
        cId: c.id,
        recipeId: c.recipeId,
        sId: s.id,
        person: s.person ?? 0
      });
    }
    return map;
  }, [cook]);
  const perPerson = useMemo(() => {
    const t = [0, 0];
    for (const c of cook) for (const s of c.servings || []) t[s.person ?? 0]++;
    return t;
  }, [cook]);
  function placeAt(dayIdx, meal, person) {
    if (!sel || remaining(sel) <= 0) return;
    onUpdate(sel.id, {
      servings: [...(sel.servings || []), {
        id: uid(),
        day: dayIdx,
        meal,
        person
      }]
    });
  }
  function removeServing(cId, sId) {
    const c = cook.find(x => x.id === cId);
    if (!c) return;
    onUpdate(cId, {
      servings: (c.servings || []).filter(s => s.id !== sId)
    });
  }
  if (cook.length === 0) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      onClick: onAdd,
      style: addBtn
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 18
    }), " Add a dish to cook"), /*#__PURE__*/React.createElement(Empty, {
      icon: CalendarRange,
      title: "Your week is empty",
      msg: "Add the dishes you'll cook, then tap a dish above and tap the day + meal where you'll eat it."
    }));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 47,
      zIndex: 20,
      background: C.paper,
      paddingTop: 6,
      paddingBottom: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 12,
      color: C.muted,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 99,
      background: PCOLOR[0]
    }
  }), people[0], " ", perPerson[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 12,
      color: C.muted,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 99,
      background: PCOLOR[1]
    }
  }), people[1], " ", perPerson[1])), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      fontWeight: 800,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: .5,
      marginBottom: 7
    }
  }, sel ? `Tap a slot for “${selRec?.name}”` : "Tap a cooked dish, then tap where it goes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 4
    }
  }, cook.map(c => {
    const r = recById[c.recipeId];
    if (!r) return null;
    const left = remaining(c);
    const active = c.id === selId;
    const done = left <= 0;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => setSelId(active ? null : done ? null : c.id),
      disabled: done && !active,
      style: {
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 12px",
        borderRadius: 999,
        border: `2px solid ${active ? C.ink : done ? C.sage : catColor(r.cat)}`,
        background: active ? C.ink : done ? "#EFece2" : "#fff",
        color: active ? C.paper : done ? C.muted : C.ink,
        fontWeight: 800,
        fontSize: 13.5,
        opacity: done ? .7 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        borderRadius: 6,
        background: active ? C.turmeric : catColor(r.cat),
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontSize: 11
      }
    }, r.letter), r.name.length > 20 ? r.name.slice(0, 19) + "…" : r.name, /*#__PURE__*/React.createElement("span", {
      style: {
        background: done ? C.teal : active ? C.turmeric : C.sage,
        color: "#fff",
        borderRadius: 999,
        padding: "1px 8px",
        fontSize: 12,
        fontWeight: 800
      }
    }, done ? "✓" : "×" + left));
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    style: {
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "8px 12px",
      borderRadius: 999,
      border: `1.5px dashed ${C.sage}`,
      background: "transparent",
      color: C.muted,
      fontWeight: 800,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 15
  }), " Dish")), sel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.tomato,
      fontWeight: 700,
      marginTop: 4
    }
  }, "Good through ", DAYS_FULL[selEatBy], " \xB7 those days are highlighted")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 9
    }
  }, WEEK.map(dayIdx => {
    const okDay = sel ? inWindow(sel, dayIdx) : true;
    return /*#__PURE__*/React.createElement("div", {
      key: dayIdx,
      style: {
        background: C.card,
        border: `1px solid ${sel && okDay ? C.turmeric : C.sage}`,
        borderRadius: 16,
        padding: 11,
        opacity: sel && !okDay ? .55 : 1,
        transition: "opacity .15s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "disp",
      style: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 8
      }
    }, DAYS_FULL[dayIdx]), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 7
      }
    }, MEAL_KEYS.map(m => {
      const items = byCell[`${dayIdx}|${m.id}`] || [];
      return /*#__PURE__*/React.createElement("div", {
        key: m.id,
        style: {
          background: C.paper,
          border: `1.5px solid ${C.sage}`,
          borderRadius: 11,
          padding: "6px 6px 7px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: .4,
          color: C.muted,
          fontWeight: 800,
          marginBottom: 5
        }
      }, m.label), people.map((nm, p) => {
        const mine = items.filter(it => (it.person ?? 0) === p);
        const canPlace = sel && okDay;
        return /*#__PURE__*/React.createElement("div", {
          key: p,
          onClick: () => canPlace && placeAt(dayIdx, m.id, p),
          style: {
            borderLeft: `3px solid ${PCOLOR[p]}`,
            background: canPlace ? "#fff" : "transparent",
            borderRadius: 5,
            padding: "3px 5px",
            marginBottom: 4,
            minHeight: 26,
            cursor: canPlace ? "pointer" : "default"
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 8.5,
            fontWeight: 800,
            color: PCOLOR[p],
            textTransform: "uppercase",
            letterSpacing: .3
          }
        }, nm), mine.map(it => {
          const r = recById[it.recipeId];
          return /*#__PURE__*/React.createElement("div", {
            key: it.sId,
            onClick: e => {
              e.stopPropagation();
              removeServing(it.cId, it.sId);
            },
            style: {
              display: "flex",
              alignItems: "center",
              gap: 3,
              marginTop: 2,
              background: "#F4EEDD",
              border: `1px solid ${C.sage}`,
              borderRadius: 6,
              padding: "2px 4px",
              animation: "drop .15s ease"
            }
          }, /*#__PURE__*/React.createElement("span", {
            style: {
              width: 5,
              height: 5,
              borderRadius: 99,
              background: catColor(r?.cat),
              flexShrink: 0
            }
          }), /*#__PURE__*/React.createElement("span", {
            style: {
              fontSize: 10,
              fontWeight: 700,
              lineHeight: 1.1,
              flex: 1
            }
          }, r?.name), /*#__PURE__*/React.createElement(X, {
            size: 10,
            color: C.muted
          }));
        }), canPlace && mine.length === 0 && /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 10,
            color: PCOLOR[p],
            fontWeight: 800
          }
        }, "+ tap"));
      }));
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      textAlign: "center",
      marginTop: 12
    }
  }, "Tap a placed dish to remove it \xB7 set plates & cook day in ", /*#__PURE__*/React.createElement("button", {
    onClick: goDishes,
    style: {
      border: "none",
      background: "none",
      color: C.ink,
      fontWeight: 800,
      textDecoration: "underline",
      padding: 0,
      cursor: "pointer"
    }
  }, "Dishes")));
}

/* ---------------- Dishes ---------------- */
function DishesView({
  cook,
  recById,
  people,
  setPeople,
  onAdd,
  onUpdate,
  onRemove
}) {
  const totalPlates = cook.reduce((a, c) => a + c.plates, 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
      background: C.card,
      border: `1px solid ${C.sage}`,
      borderRadius: 12,
      padding: "10px 12px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Users, {
    size: 16,
    color: C.muted
  }), people.map((nm, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 99,
      background: PCOLOR[i]
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: nm,
    onChange: e => setPeople(p => p.map((x, j) => j === i ? e.target.value : x)),
    style: {
      width: 96,
      border: `1px solid ${C.sage}`,
      borderRadius: 8,
      padding: "5px 8px",
      fontSize: 13.5,
      fontWeight: 700,
      background: C.paper,
      color: C.ink
    }
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    style: addBtn
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 18
  }), " Add a dish to cook"), cook.length === 0 ? /*#__PURE__*/React.createElement(Empty, {
    icon: ChefHat,
    title: "No dishes yet",
    msg: "Add what you'll cook this week. The shopping list builds from these, and you place the plates in Schedule."
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.ink,
      color: C.paper,
      borderRadius: 14,
      padding: "11px 16px",
      margin: "14px 0",
      fontSize: 15,
      fontWeight: 600
    },
    className: "disp"
  }, cook.length, " ", cook.length === 1 ? "dish" : "dishes", " \xB7 ", totalPlates, " plates"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, cook.map(c => {
    const r = recById[c.recipeId];
    if (!r) return null;
    const eb = eatByIdx(c.cookDay || 0, r.lasts);
    const left = c.plates - (c.servings?.length || 0);
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        background: C.card,
        border: `1px solid ${C.sage}`,
        borderRadius: 16,
        padding: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: catColor(r.cat),
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontWeight: 800,
        fontSize: 13,
        flexShrink: 0
      }
    }, r.letter), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "disp",
      style: {
        fontSize: 15.5,
        fontWeight: 600,
        lineHeight: 1.2
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: C.muted,
        marginTop: 3,
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", null, "Cook:"), /*#__PURE__*/React.createElement("select", {
      value: c.cookDay || 0,
      onChange: e => onUpdate(c.id, {
        cookDay: +e.target.value
      }),
      style: sel
    }, WEEK.map(i => /*#__PURE__*/React.createElement("option", {
      key: i,
      value: i
    }, DAYS_FULL[i]))), /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.tomato,
        fontWeight: 700
      }
    }, "good through ", DAYS_FULL[eb]), r.freezer && /*#__PURE__*/React.createElement(Snowflake, {
      size: 12,
      color: "#3B6FB0"
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: () => onRemove(c.id),
      style: {
        border: "none",
        background: "none",
        color: C.muted,
        padding: 2
      }
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 16
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px solid ${C.sage}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: C.muted
      }
    }, "Plates made"), /*#__PURE__*/React.createElement(Stepper, {
      value: c.plates,
      onChange: v => onUpdate(c.id, {
        plates: v
      }),
      min: 1
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        marginTop: 8,
        color: left === 0 ? C.teal : C.turmeric
      }
    }, left === 0 ? "All plates placed in Schedule ✓" : `${left} of ${c.plates} still to place in Schedule`));
  }))));
}
function Stepper({
  value,
  onChange,
  min = 0,
  max = 99
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(Math.max(min, value - 1)),
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      border: `1.5px solid ${C.sage}`,
      background: C.paper,
      display: "grid",
      placeItems: "center",
      color: C.ink
    }
  }, /*#__PURE__*/React.createElement(Minus, {
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    className: "disp",
    style: {
      fontSize: 18,
      fontWeight: 700,
      minWidth: 18,
      textAlign: "center"
    }
  }, value), /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(Math.min(max, value + 1)),
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      border: `1.5px solid ${C.sage}`,
      background: C.paper,
      display: "grid",
      placeItems: "center",
      color: C.ink
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 14
  })));
}

/* ---------------- Shopping ---------------- */
function ShoppingView({
  groups,
  have,
  setHave,
  extra,
  setExtra
}) {
  const [txt, setTxt] = useState("");
  const addExtra = () => {
    const n = txt.trim();
    if (!n) return;
    setExtra(p => [...p, {
      id: Date.now(),
      name: n,
      have: false
    }]);
    setTxt("");
  };
  const toggle = name => setHave(p => {
    const k = name.toLowerCase();
    const n = {
      ...p
    };
    if (n[k]) delete n[k];else n[k] = true;
    return n;
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: txt,
    onChange: e => setTxt(e.target.value),
    onKeyDown: e => e.key === "Enter" && addExtra(),
    placeholder: "Add something else (e.g. paper, coffee)\u2026",
    style: {
      flex: 1,
      border: `1px solid ${C.sage}`,
      borderRadius: 12,
      padding: "11px 12px",
      background: C.card,
      color: C.ink,
      fontSize: 14
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addExtra,
    style: {
      background: C.ink,
      color: C.paper,
      border: "none",
      borderRadius: 12,
      padding: "0 16px",
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 18
  }))), groups.length === 0 && extra.length === 0 ? /*#__PURE__*/React.createElement(Empty, {
    icon: ShoppingBasket,
    title: "Nothing to buy yet",
    msg: "Add dishes and each one's ingredients show up here, grouped by dish."
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 14
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    style: {
      background: C.card,
      border: `1px solid ${C.sage}`,
      borderRadius: 16,
      padding: "12px 12px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 7,
      background: catColor(g.cat),
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontWeight: 800,
      fontSize: 12,
      flexShrink: 0
    }
  }, g.letter), /*#__PURE__*/React.createElement("span", {
    className: "disp",
    style: {
      fontSize: 15,
      fontWeight: 600,
      lineHeight: 1.15
    }
  }, g.name), g.count > 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: C.turmeric
    }
  }, "\xD7", g.count)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      paddingBottom: 6
    }
  }, g.ingredients.map((it, i) => {
    const checked = !!have[it.name.toLowerCase()];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => toggle(it.name),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 6,
        flexShrink: 0,
        border: `1.5px solid ${checked ? C.teal : C.sage}`,
        background: checked ? C.teal : "transparent",
        display: "grid",
        placeItems: "center"
      }
    }, checked && /*#__PURE__*/React.createElement(Check, {
      size: 13,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontWeight: 700,
        fontSize: 14,
        textDecoration: checked ? "line-through" : "none",
        color: checked ? C.muted : C.ink
      }
    }, it.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: C.muted
      }
    }, it.qty));
  })))), extra.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.card,
      border: `1px solid ${C.sage}`,
      borderRadius: 16,
      padding: "12px 12px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 8
    }
  }, "Other items"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      paddingBottom: 6
    }
  }, extra.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => setExtra(p => p.map(x => x.id === e.id ? {
      ...x,
      have: !x.have
    } : x)),
    style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      flexShrink: 0,
      border: `1.5px solid ${e.have ? C.teal : C.sage}`,
      background: e.have ? C.teal : "transparent",
      display: "grid",
      placeItems: "center",
      cursor: "pointer"
    }
  }, e.have && /*#__PURE__*/React.createElement(Check, {
    size: 13,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 700,
      fontSize: 14,
      textDecoration: e.have ? "line-through" : "none",
      color: e.have ? C.muted : C.ink
    }
  }, e.name), /*#__PURE__*/React.createElement("button", {
    onClick: () => setExtra(p => p.filter(x => x.id !== e.id)),
    style: {
      border: "none",
      background: "none",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 15
  }))))))));
}

/* ---------------- Recipes ---------------- */
function TagChip({
  label,
  color
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color,
      border: `1px solid ${color}`,
      borderRadius: 999,
      padding: "1px 7px"
    }
  }, label);
}
function RecipesView({
  recipes,
  onEdit,
  onNew
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: onNew,
    style: addBtn
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 18
  }), " New recipe"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10,
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      marginTop: 14
    }
  }, recipes.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.id,
    onClick: () => onEdit(r),
    style: {
      textAlign: "left",
      background: C.card,
      border: `1px solid ${C.sage}`,
      borderRadius: 16,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 8,
      background: catColor(r.cat),
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontWeight: 800,
      fontSize: 13,
      flexShrink: 0
    }
  }, r.letter), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.muted,
      fontWeight: 700
    }
  }, catLabel(r.cat), " \xB7 keeps ", r.lasts, "d \xB7 serves ", r.serves), r.freezer && /*#__PURE__*/React.createElement(Snowflake, {
    size: 13,
    color: "#3B6FB0"
  }), /*#__PURE__*/React.createElement(Pencil, {
    size: 13,
    color: C.muted,
    style: {
      marginLeft: "auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      fontSize: 15.5,
      fontWeight: 600,
      lineHeight: 1.2
    }
  }, r.name), r.side && r.side !== "—" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 3
    }
  }, "+ ", r.side), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 5,
      marginTop: 8,
      alignItems: "center"
    }
  }, (r.meals || []).map(mi => {
    const m = MEAL_KEYS.find(x => x.id === mi);
    return m ? /*#__PURE__*/React.createElement(TagChip, {
      key: mi,
      label: m.label,
      color: C.muted
    }) : null;
  }), (r.tags || []).map(t => {
    const s = STYLE_TAGS.find(x => x.id === t);
    return s ? /*#__PURE__*/React.createElement(TagChip, {
      key: t,
      label: s.label,
      color: t === "fast" ? C.turmeric : C.tomato
    }) : null;
  }))))));
}

/* ---------------- Modal: pick a recipe ---------------- */
function RecipePicker({
  recipes,
  onClose,
  onChoose,
  onNew
}) {
  const [q, setQ] = useState("");
  const [styleF, setStyleF] = useState([]);
  const toggleStyle = t => setStyleF(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const filt = recipes.filter(r => {
    const styleOk = !styleF.length || (r.tags || []).some(t => styleF.includes(t));
    const textOk = (r.name + r.letter + r.side).toLowerCase().includes(q.toLowerCase());
    return styleOk && textOk;
  });
  return /*#__PURE__*/React.createElement(Overlay, {
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 8px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      margin: "0 0 12px",
      fontSize: 20,
      fontWeight: 700
    }
  }, "Add a dish to cook"), /*#__PURE__*/React.createElement("button", {
    onClick: onNew,
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 12px",
      borderRadius: 12,
      border: `1.5px solid ${C.turmeric}`,
      background: "#fff",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 9,
      background: C.turmeric,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 14.5,
      color: C.ink
    }
  }, "Add a new recipe")), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search\u2026",
    style: {
      width: "100%",
      border: `1px solid ${C.sage}`,
      borderRadius: 12,
      padding: "11px 12px",
      fontSize: 14,
      background: C.paper,
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, STYLE_TAGS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => toggleStyle(s.id),
    style: {
      fontSize: 12,
      fontWeight: 700,
      padding: "5px 10px",
      borderRadius: 999,
      border: `1.5px solid ${styleF.includes(s.id) ? s.id === "fast" ? C.turmeric : C.tomato : C.sage}`,
      background: styleF.includes(s.id) ? s.id === "fast" ? C.turmeric : C.tomato : "transparent",
      color: styleF.includes(s.id) ? "#fff" : C.muted
    }
  }, s.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      padding: "6px 16px 16px",
      flex: 1
    }
  }, filt.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.id,
    onClick: () => onChoose(r.id),
    style: {
      width: "100%",
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 10px",
      borderRadius: 12,
      border: "1.5px solid transparent",
      background: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 8,
      background: catColor(r.cat),
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontWeight: 800,
      fontSize: 13,
      flexShrink: 0
    }
  }, r.letter), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 700,
      fontSize: 14,
      lineHeight: 1.2
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: C.muted
    }
  }, "serves ", r.serves, " \xB7 keeps ", r.lasts, "d", (r.tags || []).length ? " · " + r.tags.map(t => STYLE_TAGS.find(s => s.id === t)?.label).join(", ") : "")), /*#__PURE__*/React.createElement(Plus, {
    size: 18,
    color: C.muted
  })))));
}

/* ---------------- Modal: edit / create recipe ---------------- */
function RecipeEditor({
  recipe,
  onClose,
  onSave,
  onDelete
}) {
  const [r, setR] = useState(recipe || {
    id: `U${Date.now()}`,
    letter: "•",
    cat: "other",
    lasts: 3,
    freezer: false,
    serves: 4,
    meals: [],
    tags: [],
    name: "",
    side: "—",
    ingredients: []
  });
  const set = patch => setR(prev => ({
    ...prev,
    ...patch
  }));
  const toggleIn = (field, val) => setR(prev => ({
    ...prev,
    [field]: (prev[field] || []).includes(val) ? prev[field].filter(x => x !== val) : [...(prev[field] || []), val]
  }));
  const setIng = (i, patch) => setR(prev => ({
    ...prev,
    ingredients: prev.ingredients.map((x, j) => j === i ? {
      ...x,
      ...patch
    } : x)
  }));
  const addIng = () => setR(prev => ({
    ...prev,
    ingredients: [...prev.ingredients, {
      name: "",
      qty: ""
    }]
  }));
  const delIng = i => setR(prev => ({
    ...prev,
    ingredients: prev.ingredients.filter((_, j) => j !== i)
  }));
  const canSave = r.name.trim().length > 0;
  const Toggle = ({
    on,
    onClick,
    children,
    color
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      padding: "7px 12px",
      borderRadius: 999,
      border: `1.5px solid ${on ? color || C.ink : C.sage}`,
      background: on ? color || C.ink : "transparent",
      color: on ? "#fff" : C.muted
    }
  }, children);
  return /*#__PURE__*/React.createElement(Overlay, {
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      overflowY: "auto",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      margin: "0 0 14px",
      fontSize: 20,
      fontWeight: 700
    }
  }, recipe ? "Edit recipe" : "New recipe"), /*#__PURE__*/React.createElement(Field, {
    label: "Name"
  }, /*#__PURE__*/React.createElement("input", {
    value: r.name,
    onChange: e => set({
      name: e.target.value
    }),
    placeholder: "e.g. Pork adobo",
    style: inp
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Side dish"
  }, /*#__PURE__*/React.createElement("input", {
    value: r.side === "—" ? "" : r.side,
    onChange: e => set({
      side: e.target.value || "—"
    }),
    placeholder: "e.g. Rice and green beans",
    style: inp
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.muted,
      marginBottom: 6
    }
  }, "Good for"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 4,
      flexWrap: "wrap"
    }
  }, MEAL_KEYS.map(m => /*#__PURE__*/React.createElement(Toggle, {
    key: m.id,
    on: (r.meals || []).includes(m.id),
    onClick: () => toggleIn("meals", m.id)
  }, m.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.muted,
      marginBottom: 12
    }
  }, (r.meals || []).length ? "" : "None selected = any meal."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.muted,
      marginBottom: 6
    }
  }, "Tags"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 14,
      flexWrap: "wrap"
    }
  }, STYLE_TAGS.map(s => /*#__PURE__*/React.createElement(Toggle, {
    key: s.id,
    on: (r.tags || []).includes(s.id),
    onClick: () => toggleIn("tags", s.id),
    color: s.id === "fast" ? C.turmeric : C.tomato
  }, s.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Protein"
  }, /*#__PURE__*/React.createElement("select", {
    value: r.cat,
    onChange: e => set({
      cat: e.target.value
    }),
    style: inp
  }, /*#__PURE__*/React.createElement("option", {
    value: "chicken"
  }, "Chicken"), /*#__PURE__*/React.createElement("option", {
    value: "beef"
  }, "Beef"), /*#__PURE__*/React.createElement("option", {
    value: "pork"
  }, "Pork"), /*#__PURE__*/React.createElement("option", {
    value: "seafood"
  }, "Seafood"), /*#__PURE__*/React.createElement("option", {
    value: "other"
  }, "Other"))), /*#__PURE__*/React.createElement(Field, {
    label: "Keeps (days)"
  }, /*#__PURE__*/React.createElement("select", {
    value: r.lasts,
    onChange: e => set({
      lasts: +e.target.value
    }),
    style: inp
  }, [1, 2, 3, 4, 5, 6, 7].map(d => /*#__PURE__*/React.createElement("option", {
    key: d,
    value: d
  }, d)))), /*#__PURE__*/React.createElement(Field, {
    label: "Serves"
  }, /*#__PURE__*/React.createElement("select", {
    value: r.serves,
    onChange: e => set({
      serves: +e.target.value
    }),
    style: inp
  }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => /*#__PURE__*/React.createElement("option", {
    key: d,
    value: d
  }, d))))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      margin: "2px 0 16px",
      fontSize: 14,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: r.freezer,
    onChange: e => set({
      freezer: e.target.checked
    }),
    style: {
      width: 18,
      height: 18
    }
  }), " Freezer prep (keeps longer)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      marginBottom: 8
    }
  }, "Ingredients"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 8
    }
  }, r.ingredients.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: it.name,
    onChange: e => setIng(i, {
      name: e.target.value
    }),
    placeholder: "Ingredient",
    style: {
      ...inp,
      flex: 2
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: it.qty,
    onChange: e => setIng(i, {
      qty: e.target.value
    }),
    placeholder: "Qty",
    style: {
      ...inp,
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => delIng(i),
    style: {
      border: `1px solid ${C.sage}`,
      background: C.paper,
      borderRadius: 10,
      padding: "0 10px",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 15
  }))))), /*#__PURE__*/React.createElement("button", {
    onClick: addIng,
    style: {
      marginTop: 8,
      background: "transparent",
      border: `1.5px dashed ${C.sage}`,
      borderRadius: 10,
      padding: "9px",
      width: "100%",
      color: C.muted,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 16
  }), " Add ingredient")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${C.sage}`,
      padding: 14,
      display: "flex",
      gap: 10,
      background: C.card
    }
  }, recipe && /*#__PURE__*/React.createElement("button", {
    onClick: () => onDelete(r.id),
    style: {
      border: `1.5px solid ${C.tomato}`,
      background: "transparent",
      color: C.tomato,
      borderRadius: 12,
      padding: "12px 14px",
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 17
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => canSave && onSave(r),
    disabled: !canSave,
    style: {
      flex: 1,
      background: canSave ? C.ink : C.sage,
      color: C.paper,
      border: "none",
      borderRadius: 12,
      padding: 13,
      fontWeight: 800,
      fontSize: 15
    }
  }, "Save")));
}

/* ---------------- Printable sheet ---------------- */
function PrintSheet({
  cook,
  recById,
  people,
  groups,
  have,
  extra
}) {
  const byCell = {};
  for (const c of cook) for (const s of c.servings || []) {
    const k = `${s.day}|${s.meal}`;
    (byCell[k] ||= []).push({
      recipeId: c.recipeId,
      person: s.person ?? 0
    });
  }
  const th = {
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: .4,
    color: "#444",
    borderBottom: "1.5px solid #333",
    padding: "6px 6px",
    textAlign: "left"
  };
  const td = {
    fontSize: 11,
    padding: "6px 6px",
    borderBottom: "1px solid #ccc",
    verticalAlign: "top"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "print-sheet",
    style: {
      fontFamily: "Georgia, serif",
      color: "#111",
      padding: 4
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      margin: "0 0 2px"
    }
  }, "Weekly Menu"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#555",
      marginBottom: 14
    }
  }, people.join(" & ")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: 18,
      tableLayout: "fixed"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 74
    }
  }, "Day"), MEAL_KEYS.map(m => /*#__PURE__*/React.createElement("th", {
    key: m.id,
    style: th
  }, m.label)))), /*#__PURE__*/React.createElement("tbody", null, WEEK.map(dayIdx => /*#__PURE__*/React.createElement("tr", {
    key: dayIdx
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 700
    }
  }, DAYS_FULL[dayIdx]), MEAL_KEYS.map(m => {
    const items = byCell[`${dayIdx}|${m.id}`] || [];
    return /*#__PURE__*/React.createElement("td", {
      key: m.id,
      style: td
    }, people.map((nm, p) => {
      const mine = items.filter(it => (it.person ?? 0) === p).map(it => recById[it.recipeId]?.name).filter(Boolean);
      return /*#__PURE__*/React.createElement("div", {
        key: p,
        style: {
          marginBottom: 3
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 700
        }
      }, nm, ":"), " ", mine.length ? mine.join(", ") : /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#bbb"
        }
      }, "\u2014"));
    }));
  }))))), cook.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 14,
      margin: "0 0 6px",
      borderBottom: "1.5px solid #333",
      paddingBottom: 3
    }
  }, "To cook"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "0 0 16px",
      paddingLeft: 18,
      fontSize: 11.5
    }
  }, cook.map(c => {
    const r = recById[c.recipeId];
    if (!r) return null;
    const eb = eatByIdx(c.cookDay || 0, r.lasts);
    return /*#__PURE__*/React.createElement("li", {
      key: c.id,
      style: {
        marginBottom: 2
      }
    }, r.name, " \u2014 cook ", DAYS_FULL[c.cookDay || 0], ", ", c.plates, " plates, eat by ", DAYS_FULL[eb]);
  }))), (groups.length > 0 || extra.length > 0) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 14,
      margin: "0 0 6px",
      borderBottom: "1.5px solid #333",
      paddingBottom: 3
    }
  }, "Shopping list"), /*#__PURE__*/React.createElement("div", {
    style: {
      columnCount: 2,
      fontSize: 11.5
    }
  }, groups.map(g => {
    const items = g.ingredients.filter(it => !have[it.name.toLowerCase()]);
    if (!items.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: g.id,
      style: {
        breakInside: "avoid",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        marginBottom: 2
      }
    }, g.name, g.count > 1 ? ` ×${g.count}` : ""), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 1
      }
    }, "\u2610 ", it.name, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#666"
      }
    }, it.qty))));
  }), extra.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      breakInside: "avoid",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 2
    }
  }, "Other"), extra.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    style: {
      marginBottom: 1
    }
  }, "\u2610 ", e.name))))));
}

/* ---------------- shared ---------------- */
const inp = {
  width: "100%",
  border: `1px solid ${C.sage}`,
  borderRadius: 10,
  padding: "10px 11px",
  fontSize: 14,
  background: C.paper,
  color: C.ink
};
const sel = {
  border: `1px solid ${C.sage}`,
  borderRadius: 8,
  padding: "5px 7px",
  fontSize: 12.5,
  background: C.paper,
  color: C.ink,
  fontWeight: 700
};
const addBtn = {
  width: "100%",
  background: C.ink,
  color: C.paper,
  border: "none",
  borderRadius: 14,
  padding: "14px",
  fontWeight: 800,
  fontSize: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8
};
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: C.muted,
      marginBottom: 5
    }
  }, label), children);
}
function Empty({
  icon: Icon,
  title,
  msg
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "42px 20px",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 40,
    strokeWidth: 1.4,
    style: {
      opacity: .5
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      fontSize: 19,
      fontWeight: 600,
      color: C.ink,
      margin: "12px 0 4px"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      maxWidth: 340,
      margin: "0 auto"
    }
  }, msg));
}
function Overlay({
  children,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(35,55,43,.45)",
      zIndex: 50,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "body",
    style: {
      background: C.paper,
      width: "100%",
      maxWidth: 560,
      maxHeight: "88vh",
      borderRadius: "22px 22px 0 0",
      display: "flex",
      flexDirection: "column",
      animation: "pop .18s ease",
      boxShadow: "0 -8px 40px rgba(0,0,0,.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: "8px 0 2px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 99,
      background: C.sage
    }
  })), children));
}
function BackupModal({
  onClose,
  onExport,
  onImport
}) {
  const fileRef = React.useRef(null);
  return /*#__PURE__*/React.createElement(Overlay, {
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "disp",
    style: {
      margin: "0 0 6px",
      fontSize: 20,
      fontWeight: 700
    }
  }, "Backup"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: C.muted,
      margin: "0 0 16px"
    }
  }, "Save everything (recipes, week, shopping) to a file, or restore from one \u2014 handy when you switch phones."), /*#__PURE__*/React.createElement("button", {
    onClick: onExport,
    style: {
      width: "100%",
      background: C.ink,
      color: C.paper,
      border: "none",
      borderRadius: 12,
      padding: 13,
      fontWeight: 800,
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Download, {
    size: 18
  }), " Export backup"), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "application/json",
    style: {
      display: "none"
    },
    onChange: e => {
      if (e.target.files[0]) onImport(e.target.files[0]);
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => fileRef.current && fileRef.current.click(),
    style: {
      width: "100%",
      background: "transparent",
      color: C.ink,
      border: `1.5px solid ${C.sage}`,
      borderRadius: 12,
      padding: 13,
      fontWeight: 800,
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Upload, {
    size: 18
  }), " Restore from file")));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));