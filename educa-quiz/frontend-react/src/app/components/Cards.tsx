interface CardsProps {
  title: string;
  className?: string;
}

export default function Cards({ title, className = "" }: CardsProps) {
  return (
    <div className={`card ${className}`}>
      <h2>{title}</h2>
    </div>
  );
}