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

  const pointsMap: Record<string, number> = {
    "facil": 3,
    "medio": 6,
    "dificil": 9
  };

  const chooseSubject = (s: string) => {
    setTitle(subjectMap[s]);
    setStep("difficulty");
  };

  const chooseDifficulty = (desc: string) => {
    const diff = difficultyMap[desc];
    setDescription(diff);
    fetch(`${API_URL}/quiz/${subjectMap[desc] ?? title}/${diff}?count=5`)
      .then(res => {
        if (!res.ok) throw new Error("Erro na requisição: " + res.status);
        return res.json();
      })
      .then(data => {
        setQuestions(data.questions);
        setQuizId(data.quizId);
        setStep("quiz");
      })
      .catch(err => console.error("Erro ao buscar quiz:", err));
  };

  // FIX 1: calcula os totais localmente para evitar estado stale
  const answerQuestion = (index: number) => {
    const q = questions[current];
    const isCorrect = index === q.correct;

    const newScore = isCorrect ? score + 1 : score;
    const newPoints = isCorrect ? points + pointsMap[description] : points;

    if (isCorrect) {
      setScore(newScore);
      setPoints(newPoints);
      setFeedback("✅ Acertou!");
    } else {
      setFeedback("❌ Errou!");
    }

    setTimeout(() => {
      setFeedback("");
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        // FIX 2: passa os valores calculados localmente, não lê do estado
        finishQuiz(newScore, newPoints);
      }
    }, 1000);
  };

  // FIX 2: recebe score e points como parâmetros
  const finishQuiz = (finalScore: number, finalPoints: number) => {
    const token = localStorage.getItem("token");

    // FIX 3: valida o token antes de chamar a API
    if (!token) {
      console.error("Usuário não autenticado. Redirecionando para login.");
      navigate("/login");
      return;
    }

    setFinished(true); // FIX 4: mostra a tela final imediatamente, sem alert()

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
        // navigate é opcional aqui — o finished já mostra a tela de resultado
        // se quiser ir direto para o dashboard, mantenha o navigate abaixo
        // navigate("/dashboard");
      })
      .catch(err => console.error("Erro ao salvar pontos:", err));
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

      {step === "quiz" && !finished && questions.length > 0 && (
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

      {finished && (
        <div className="quiz-result">
          <h1>Quiz finalizado!</h1>
          <p>Você acertou {score} de {questions.length} questões.</p>
          <p>Sua pontuação total foi {points} pontos.</p>
          <div className="button-group">
            <button className="quiz-btn" onClick={() => navigate("/dashboard")}>
              📊 Ir para Dashboard
            </button>
            <button className="quiz-btn" onClick={() => {
              setStep("subject");
              setCurrent(0);
              setScore(0);
              setPoints(0);
              setFinished(false);
            }}>
              🔄 Jogar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}