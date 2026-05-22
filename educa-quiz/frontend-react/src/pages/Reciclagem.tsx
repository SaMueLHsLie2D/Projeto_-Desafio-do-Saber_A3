import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { API_URL } from "../services/api";
import "../styles/Reciclagem.css";

interface Item {
  name: string;
  emoji: string;
  type: "papel" | "plastico" | "vidro" | "organico";
}

const allItems: Item[] = [
  { name: "Jornal", emoji: "📰", type: "papel" },
  { name: "Caixa de Papelão", emoji: "📦", type: "papel" },
  { name: "Livro", emoji: "📚", type: "papel" },
  { name: "Garrafa PET", emoji: "🥤", type: "plastico" },
  { name: "Sacola Plástica", emoji: "🛍️", type: "plastico" },
  { name: "Garrafa de Vidro", emoji: "🍾", type: "vidro" },
  { name: "Copo de Vidro", emoji: "🥃", type: "vidro" },
  { name: "Casca de Banana", emoji: "🍌", type: "organico" },
  { name: "Maçã", emoji: "🍎", type: "organico" },
  { name: "Folhas", emoji: "🍃", type: "organico" },
];

const bins = [
  { type: "papel", label: "Papel", emoji: "📄", color: "blue" },
  { type: "plastico", label: "Plástico", emoji: "♻️", color: "red" },
  { type: "vidro", label: "Vidro", emoji: "🔷", color: "green" },
  { type: "organico", label: "Orgânico", emoji: "🌱", color: "brown" },
];

const DraggableItem = ({ item, isDraggingItem }: { item: Item; isDraggingItem: boolean }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: { type: item.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  drag(ref);

  return (
    <div
      ref={ref}
      className={`recycle-draggable-item ${isDragging ? "dragging" : ""}`}
    >
      {item.emoji} {item.name}
    </div>
  );
};

const DropBin = ({
  type,
  label,
  onDrop,
  isLocked,
}: {
  type: string;
  label: string;
  onDrop: (droppedType: string) => void;
  isLocked: boolean;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ITEM",
    drop: (item: { type: string }) => {
      if (!isLocked) {
        onDrop(item.type);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && !isLocked,
    }),
  }));
  drop(ref);

  const binEmoji = bins.find((b) => b.type === type)?.emoji;

  return (
    <div
      ref={ref}
      className={`recycle-bin ${isOver ? "drag-over" : ""}`}
      data-type={type}
      style={{ opacity: isLocked ? 0.6 : 1, cursor: isLocked ? "not-allowed" : "pointer" }}
    >
      <div className="recycle-bin-icon">{binEmoji}</div>
      <div className="recycle-bin-label">{label}</div>
      <div className="recycle-bin-color" />
    </div>
  );
};

export default function Reciclagem() {
  const [round, setRound] = useState(1);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "">("");
  const [finished, setFinished] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  // Gera um item aleatório para a rodada
  useEffect(() => {
    if (round <= 5 && !finished) {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
      setCurrentItem(randomItem);
      setFeedback("");
      setIsLocked(false);
    }
  }, [round, finished]);

  const handleDrop = (droppedType: string) => {
    if (!currentItem || isLocked) return;

    setIsLocked(true);
    const isCorrect = droppedType === currentItem.type;
    const newScore = score + (isCorrect ? 2 : 0);

    if (isCorrect) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }

    setTimeout(() => {
      if (round < 5) {
        setRound(round + 1);
        setScore(newScore);
      } else {
        finishGame(newScore);
      }
    }, 1500);
  };

  const finishGame = (finalScore: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Usuário não autenticado.");
      navigate("/login");
      return;
    }

    setFinished(true);

    // Salva os pontos no backend usando o endpoint de reciclagem
    fetch(`${API_URL}/reciclagem/pontos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ score: finalScore }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao salvar pontos: " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Pontos de reciclagem salvos:", data);
      })
      .catch((err) => console.error("Erro ao salvar pontos:", err));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="recycle-container">
        <div className="recycle-card">
          {!finished ? (
            <>
              <div className="recycle-header">
                <h1 className="recycle-title">
                  <span className="recycle-title-icon">♻️</span>
                  Jogo da Reciclagem
                </h1>
                <p className="recycle-subtitle">Classifique os itens corretamente!</p>
              </div>

              <div className="recycle-progress">
                <span className="recycle-progress-text">Rodada {round} de 5</span>
                <div className="recycle-progress-bar">
                  <div
                    className="recycle-progress-fill"
                    style={{ width: `${(round / 5) * 100}%` }}
                  />
                </div>
                <div className="recycle-score">
                  <span>⭐</span>
                  <span>{score}</span>
                </div>
              </div>

              {currentItem && (
                <>
                  <div className="recycle-current-item">
                    <span className="recycle-current-item-label">
                      Arraste este item para a lixeira correta:
                    </span>
                    <DraggableItem item={currentItem} isDraggingItem={false} />
                  </div>

                  <div className="recycle-bins">
                    {bins.map((bin) => (
                      <DropBin
                        key={bin.type}
                        type={bin.type}
                        label={bin.label}
                        onDrop={handleDrop}
                        isLocked={isLocked}
                      />
                    ))}
                  </div>

                  {feedback && (
                    <div className={`recycle-feedback ${feedback}`}>
                      <span>{feedback === "correct" ? "✅" : "❌"}</span>
                      <span>
                        {feedback === "correct" ? "Acertou! +2 pontos" : "Errou! Tente novamente"}
                      </span>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="recycle-result">
              <div className="recycle-result-header">
                <span className="recycle-result-emoji">
                  {score >= 8 ? "🎉" : score >= 5 ? "👍" : "📚"}
                </span>
                <h1 className="recycle-result-title">
                  {score >= 8 ? "Parabéns!" : "Jogo finalizado!"}
                </h1>
              </div>

              <div className="recycle-result-stats">
                <div className="recycle-result-stat">
                  <span className="recycle-result-stat-value">{score}</span>
                  <span className="recycle-result-stat-label">Pontos totais</span>
                </div>
                <div className="recycle-result-stat">
                  <span className="recycle-result-stat-value">{Math.round((score / 10) * 100)}%</span>
                  <span className="recycle-result-stat-label">Acurácia</span>
                </div>
                <div className="recycle-result-stat">
                  <span className="recycle-result-stat-value">5</span>
                  <span className="recycle-result-stat-label">Rodadas</span>
                </div>
              </div>

              <p className="recycle-result-message">
                Você completou o jogo da reciclagem! Continue praticando para melhorar sua pontuação.
              </p>

              <div className="recycle-result-buttons">
                <button
                  className="recycle-result-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  📊 Dashboard
                </button>
                <button
                  className="recycle-result-btn"
                  onClick={() => {
                    setRound(1);
                    setScore(0);
                    setFeedback("");
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
    </DndProvider>
  );
}