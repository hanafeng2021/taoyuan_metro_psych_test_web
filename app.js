let allQuestions = [];
let currentQuestions = [];
let answers = {};

const quiz = document.getElementById("quiz");
const categoryFilter = document.getElementById("categoryFilter");
const limitSelect = document.getElementById("limitSelect");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const resultPanel = document.getElementById("resultPanel");
const summary = document.getElementById("summary");
const categoryScores = document.getElementById("categoryScores");
const exportBtn = document.getElementById("exportBtn");

async function init() {
  const res = await fetch("questions.json");
  allQuestions = await res.json();
  buildCategoryOptions();
  startQuiz();
}

function buildCategoryOptions() {
  const categories = [...new Set(allQuestions.map(q => q.category))];
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function startQuiz() {
  answers = {};
  resultPanel.hidden = true;
  const cat = categoryFilter.value;
  const limit = Number(limitSelect.value);
  let pool = cat === "all" ? [...allQuestions] : allQuestions.filter(q => q.category === cat);
  currentQuestions = pool.slice(0, Math.min(limit, pool.length));
  renderQuiz();
}

function renderQuiz() {
  quiz.innerHTML = "";
  currentQuestions.forEach((q, index) => {
    const card = document.createElement("article");
    card.className = "question-card";
    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${q.question}`;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `分類：${q.category}${q.reverse ? "｜反向題" : ""}`;

    const scale = document.createElement("div");
    scale.className = "scale";
    q.options.forEach((label, i) => {
      const value = i + 1;
      const id = `q${q.id}_${value}`;
      const wrap = document.createElement("label");
      wrap.innerHTML = `<input type="radio" name="q${q.id}" value="${value}" id="${id}"><span>${value}<br>${label}</span>`;
      wrap.querySelector("input").addEventListener("change", e => {
        answers[q.id] = Number(e.target.value);
        updateProgress();
      });
      scale.appendChild(wrap);
    });

    card.append(title, meta, scale);
    quiz.appendChild(card);
  });

  const submit = document.createElement("button");
  submit.className = "submit";
  submit.textContent = "送出並查看結果";
  submit.addEventListener("click", showResult);
  quiz.appendChild(submit);
  updateProgress();
}

function updateProgress() {
  const answered = Object.keys(answers).length;
  document.title = `已作答 ${answered}/${currentQuestions.length} 題`;
}

function scoreQuestion(q, raw) {
  return q.reverse ? 6 - raw : raw;
}

function showResult() {
  const missing = currentQuestions.filter(q => !answers[q.id]);
  if (missing.length > 0) {
    alert(`尚有 ${missing.length} 題未作答。請完成後再送出。`);
    return;
  }
  const byCat = {};
  let total = 0;
  currentQuestions.forEach(q => {
    const s = scoreQuestion(q, answers[q.id]);
    total += s;
    if (!byCat[q.category]) byCat[q.category] = { sum: 0, count: 0 };
    byCat[q.category].sum += s;
    byCat[q.category].count += 1;
  });

  const avg = total / currentQuestions.length;
  summary.innerHTML = `<p>總題數：${currentQuestions.length} 題</p><p>整體平均分數：<strong>${avg.toFixed(2)}</strong> / 5</p><p>${interpret(avg)}</p>`;

  categoryScores.innerHTML = "";
  Object.entries(byCat).forEach(([cat, obj]) => {
    const score = obj.sum / obj.count;
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `<span>${cat}</span><strong>${score.toFixed(2)}</strong>`;
    categoryScores.appendChild(row);
  });
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth" });
}

function interpret(avg) {
  if (avg >= 4.2) return "整體傾向穩定、守規範、責任感與安全意識較高。";
  if (avg >= 3.5) return "整體表現中上，建議加強前後一致性與情境判斷。";
  if (avg >= 2.8) return "整體表現普通，建議檢視壓力、紀律與安全相關題目的作答傾向。";
  return "整體分數偏低，正式測驗時請依真實狀況作答，並理解安全與責任要求。";
}

function resetQuiz() {
  startQuiz();
}

function exportAnswers() {
  const data = {
    exportedAt: new Date().toISOString(),
    totalQuestions: currentQuestions.length,
    answers,
    questions: currentQuestions
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "心理測驗作答結果.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

startBtn.addEventListener("click", startQuiz);
resetBtn.addEventListener("click", resetQuiz);
exportBtn.addEventListener("click", exportAnswers);

init().catch(err => {
  quiz.innerHTML = `<p class="error">載入 questions.json 失敗：${err.message}</p>`;
});
