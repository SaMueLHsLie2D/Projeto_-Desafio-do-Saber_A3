import { useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { API_URL } from "../services/api";

interface Item {
  name: string;
  type: string;
}

const items: Item[] = [
  { name: "📰 Jornal", type: "papel" },
  { name: "📦 Caixa de Papelão", type: "papel" },
  { name: "🥤 Garrafa PET", type: "plastico" },
  { name: "🛍️ Sacola Plástica", type: "plastico" },
  { name: "🍾 Garrafa de Vidro", type: "vidro" },
  { name: "🍌 Casca de Banana", type: "organico" },
];

const DraggableItem = ({ name, type }: Item) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  drag(ref);

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "10px",
        margin: "10px",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "grab",
      }}
    >
      {name}
    </div>
  );
};

const DropBin = ({ acceptType, label, color }: { acceptType: string; label: string; color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: acceptType,
    drop: (item: { type: string }) => {
      if (item.type === acceptType) {
        alert("✅ Acertou! " + label);
        // incrementa score no backend
        fetch(`${API_URL}/score`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: 1 }),
        });
      } else {
        alert("❌ Errou! Esse item não pertence a " + label);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  drop(ref);

  return (
    <div
      ref={ref}
      style={{
        height: "120px",
        width: "120px",
        margin: "20px",
        backgroundColor: isOver ? "#ddd" : color,
        border: "2px dashed #333",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      {label}
    </div>
  );
};

export default function RecycleGame() {
  return (
    <DndProvider backend={HTML5Backend}>
      <h1 style={{ textAlign: "center" }}>♻️ Jogo da Reciclagem</h1>
      <p style={{ textAlign: "center" }}>Arraste cada item para a lixeira correta</p>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {items.map((item, i) => (
          <DraggableItem key={i} name={item.name} type={item.type} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        <DropBin acceptType="papel" label="Papel" color="blue" />
        <DropBin acceptType="plastico" label="Plástico" color="red" />
        <DropBin acceptType="vidro" label="Vidro" color="green" />
        <DropBin acceptType="organico" label="Orgânico" color="brown" />
      </div>
    </DndProvider>
  );
}