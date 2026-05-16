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
  const navigate = useNavigate();

  // Map para enviar valores normalizados ao backend
  const subjectMap: Record<string, string> = {
    "Matemática": "mat",
    "Português": "port",
    "Ciências": "ciencias"
  };

  const difficultyMap: Record<string, string> = {
    "Fácil": "facil",
    "Médio": "medio",
    "Difícil": "dificil"
  };

  const chooseSubject = (s: string) => {
    setTitle(subjectMap[s]);
    setStep("difficulty");
  };

  const chooseDifficulty = (desc: string) => {
    setDescription(difficultyMap[desc]);
    fetch(`${API_URL}/quiz/${title}/${difficultyMap[desc]}?count=5`)
      .then(res => {
        if (!res.ok) throw new Error("Erro na requisição: " + res.status);
        return res.json();
      })
      .then(data => {
        setQuestions(data);
        setStep("quiz");
      })
      .catch(err => console.error("Erro ao buscar quiz:", err));
  };

  const answerQuestion = (index: number) => {
    const q = questions[current];
    if (index === q.correct) {
      setScore(score + 1);
      setFeedback("✅ Acertou!");
    } else {
      setFeedback("❌ Errou!");
    }

    setTimeout(() => {
      setFeedback("");
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        finishQuiz();
      }
    }, 1000);
  };

  const finishQuiz = () => {
    fetch(`${API_URL}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score })
    }).then(() => {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        user.score = (user.score || 0) + score;
        localStorage.setItem("user", JSON.stringify(user));
      }
      navigate("/dashboard");
    });
  };

  return (
    <div className="quiz-container">
      {step === "subject" && (
        <>
          <h1 className="quiz-title">Escolha uma categoria:</h1>
          <div className="button-group">
            <button className="quiz-btn" onClick={() => chooseSubject("Matemática")}>📐 Matemática</button>
            <button className="quiz-btn" onClick={() => chooseSubject("Português")}>📖 Português</button>
            <button className="quiz-btn" onClick={() => chooseSubject("Ciências")}>🔬 Ciências</button>
          </div>
        </>
      )}

      {step === "difficulty" && (
        <>
          <h1 className="quiz-title">Escolha a dificuldade:</h1>
          <div className="button-group">
            <button className="quiz-btn" onClick={() => chooseDifficulty("Fácil")}>🌱 Fácil</button>
            <button className="quiz-btn" onClick={() => chooseDifficulty("Médio")}>⚖️ Médio</button>
            <button className="quiz-btn" onClick={() => chooseDifficulty("Difícil")}>🔥 Difícil</button>
          </div>
        </>
      )}

      {step === "quiz" && questions.length > 0 && (
        <>
          <h1 className="quiz-title">Quiz de {title} - {description}</h1>
          <h2 className="quiz-subtitle">Pergunta {current + 1} de {questions.length}</h2>
          <p className="quiz-question">{questions[current].question}</p>
          <div className="button-group">
            {questions[current].options.map((opt, i) => (
              <button className="quiz-btn" key={i} onClick={() => answerQuestion(i)}>
                {opt}
              </button>
            ))}
          </div>
          {feedback && <p className="quiz-feedback">{feedback}</p>}
        </>
      )}
    </div>
  );
}
