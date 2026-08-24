export default function AnomalyBadge({ score, showScore = true }) {
  let label, bgClass, textClass, borderClass;

  if (score == null || score < 30) {
    label = 'Normal';
    bgClass = 'bg-zinc-700/30';
    textClass = 'text-[#a1a1aa]';
    borderClass = 'border-[#3f3f46]';
  } else if (score < 60) {
    label = 'Suspicious';
    bgClass = 'bg-yellow-500/10';
    textClass = 'text-yellow-500';
    borderClass = 'border-yellow-500/20';
  } else if (score < 80) {
    label = 'High Risk';
    bgClass = 'bg-orange-500/10';
    textClass = 'text-orange-500';
    borderClass = 'border-orange-500/20';
  } else {
    label = 'Critical';
    bgClass = 'bg-red-500/10';
    textClass = 'text-red-500';
    borderClass = 'border-red-500/20';
  }

  if (showScore && score != null) {
    return (
      <span className={`inline-flex items-center justify-center px-2 py-1 rounded font-mono-data text-sm border ${bgClass} ${textClass} ${borderClass}`}>
        {score}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass} ${textClass} ${borderClass}`}>
      {label}
    </span>
  );
}
