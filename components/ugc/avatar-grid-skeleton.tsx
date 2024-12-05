export function AvatarGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="aspect-[3/4] bg-slate-800 rounded-lg animate-pulse" />
      ))}
    </div>
  );
} 