import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/quiz")
      .then(res => res.json())
      .then(setQuizzes);
  }, []);

  return (
    <div>
      <h1>Quizzes</h1>

      {quizzes.map(q => (
        <div key={q.id}>
          <h3>{q.title}</h3>
          <p>{q.description}</p>

          <button onClick={() => navigate(`/quiz/${q.id}`)}>
            Jogar
          </button>
        </div>
      ))}
    </div>
  );
}