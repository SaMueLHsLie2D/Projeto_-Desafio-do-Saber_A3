import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function QuizPlay() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/quiz/${id}`)
      .then(res => res.json())
      .then(setQuiz);
  }, [id]);

  if (!quiz) return <div>Carregando...</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>

      {quiz.questions.map((q: any, index: number) => (
        <div key={index}>
          <h3>{q.question}</h3>

          {q.options.map((opt: string, i: number) => (
            <button key={i}>
              {opt}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}