import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import "../styles/Quizzes.css";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

export default function Quizzes() {
  const [step, setStep] = useState("subject");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [quizId, setQuizId] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  const subjectMap: Record<string, { code: string; label: string; icon: string }> = {
    "mat": { code: "mat", label: "Matemática", icon: "📐" },
    "port": { code: "port", label: "Português", icon: "📖" },
    "ciencias": { code: "ciencias", label: "Ciências", icon: "🔬" }
  };

  const difficultyMap: Record<string, { code: string; label: string; icon: string }> = {
    "facil": { code: "facil", label: "Fácil", icon: "🌱" },
    "medio": { code: "medio", label: "Médio", icon: "⚖️" },
    "dificil": { code: "dificil", label: "Difícil", icon: "🔥" }
  };

  const pointsMap: Record<string, number> = {
    "facil": 3,
    "medio": 6,
    "dificil": 9
  };

  const chooseSubject = (code: string) => {
    setTitle(code);
    setStep("difficulty");
  };

  const chooseDifficulty = (code: string) => {
    setDescription(code);
    fetch(`${API_URL}/quiz/${title}/${code}?count=5`)
      .then(res => {
        if (!res.ok) throw new Error("Erro na requisição: " + res.status);
        return res.json();
      })
      .then(data => {
        setQuestions(data.questions);
        setQuizId(data.quizId);
        setStep("quiz");
      })
      .catch(err => {
        console.error("Erro ao buscar quiz:", err);
        alert("Erro ao carregar o quiz. Tente novamente.");
      });
  };

  const answerQuestion = (index: number) => {
    const q = questions[current];
    const isCorrect = index === q.correct;

    const newScore = isCorrect ? score + 1 : score;
    const newPoints = isCorrect ? points + pointsMap[description] : points;

    if (isCorrect) {
      setScore(newScore);
      setPoints(newPoints);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => {
      setFeedback("");
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        finishQuiz(newScore, newPoints);
      }
    }, 1500);
  };

  const finishQuiz = (finalScore: number, finalPoints: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Usuário não autenticado. Redirecionando para login.");
      navigate("/login");
      return;
    }

    setFinished(true);

    fetch(`${API_URL}/quiz/pontos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ quizId, score: finalPoints })
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar pontos: " + res.status);
        return res.json();
      })
      .then(data => {
        console.log("Pontos salvos:", data);
      })
      .catch(err => console.error("Erro ao salvar pontos:", err));
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {/* SELEÇÃO DE MATÉRIA */}
        {step === "subject" && (
          <div className="quiz-subjects">
            <h1 className="quiz-title">Escolha uma categoria</h1>
            <div className="quiz-subject-grid">
              {Object.entries(subjectMap).map(([key, subject]) => (
                <button
                  key={key}
                  className="quiz-subject-btn"
                  data-subject={key}
                  onClick={() => chooseSubject(key)}
                >
                  <span className="quiz-subject-icon">{subject.icon}</span>
                  <span className="quiz-subject-label">{subject.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SELEÇÃO DE DIFICULDADE */}
        {step === "difficulty" && (
          <div className="quiz-difficulties">
            <div style={{ gridColumn: "1 / -1" }}>
              <h1 className="quiz-title">Escolha a dificuldade</h1>
            </div>
            {Object.entries(difficultyMap).map(([key, difficulty]) => (
              <button
                key={key}
                className="quiz-difficulty-btn"
                data-difficulty={key}
                onClick={() => chooseDifficulty(key)}
              >
                <span className="quiz-difficulty-icon">{difficulty.icon}</span>
                <span className="quiz-difficulty-label">{difficulty.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* DURANTE O QUIZ */}
        {step === "quiz" && !finished && questions.length > 0 && (
          <>
            <div className="quiz-progress">
              <span className="quiz-progress-text">
                Pergunta {current + 1} de {questions.length}
              </span>
            </div>
            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <span className="quiz-subtitle">
                {subjectMap[title]?.label} • {difficultyMap[description]?.label}
              </span>
              <h2 className="quiz-question">{questions[current].question}</h2>
            </div>

            <div className="quiz-options">
              {questions[current].options.map((opt, i) => (
                <button
                  key={i}
                  className="quiz-option-btn"
                  onClick={() => answerQuestion(i)}
                  disabled={feedback !== ""}
                >
                  <span style={{ fontSize: "20px", marginRight: "8px" }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`quiz-feedback ${feedback}`}>
                <span>{feedback === "correct" ? "✅" : "❌"}</span>
                <span>{feedback === "correct" ? "Acertou!" : "Errou!"}</span>
              </div>
            )}
          </>
        )}

        {/* RESULTADO FINAL */}
        {finished && (
          <div className="quiz-result">
            <div className="quiz-result-header">
              <span className="quiz-result-emoji">
                {score >= questions.length * 0.7 ? "🎉" : score >= questions.length * 0.5 ? "👍" : "📚"}
              </span>
              <h1 className="quiz-result-title">
                {score >= questions.length * 0.7 ? "Parabéns!" : "Quiz finalizado!"}
              </h1>
            </div>

            <div className="quiz-result-stats">
              <div className="quiz-result-stat">
                <span className="quiz-result-stat-value">{score}</span>
                <span className="quiz-result-stat-label">Acertos</span>
              </div>
              <div className="quiz-result-stat">
                <span className="quiz-result-stat-value">{questions.length - score}</span>
                <span className="quiz-result-stat-label">Erros</span>
              </div>
              <div className="quiz-result-stat">
                <span className="quiz-result-stat-value">{points}</span>
                <span className="quiz-result-stat-label">Pontos ganhos</span>
              </div>
            </div>

            <p className="quiz-result-message">
              Você acertou {score} de {questions.length} questões. Continue praticando para melhorar!
            </p>

            <div className="quiz-result-buttons">
              <button
                className="quiz-result-btn"
                onClick={() => navigate("/dashboard")}
              >
                📊 Início
              </button>
              <button
                className="quiz-result-btn"
                onClick={() => {
                  setStep("subject");
                  setCurrent(0);
                  setScore(0);
                  setPoints(0);
                  setFinished(false);
                }}
              >
                🔄 Jogar novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}