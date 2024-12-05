export const IsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <h1 className="text-4xl font-extrabold tracking-tight text-blue-400 mb-8 ">
        Cargando
      </h1>

      <div className="w-16 h-16 border-4 border-blue-500 border-t-blue-300 rounded-full animate-spin neon-spinner"></div>

      <style jsx>{`
        .neon-text {
          color: #4facfe;
          text-shadow: 0 0 4px #4facfe, 0 0 6px #1a73e8, 0 0 12px #1a73e8;
        }
        .neon-spinner {
          box-shadow: 0 0 6px #4facfe, 0 0 12px #1a73e8, 0 0 18px #1a73e8;
        }
      `}</style>
    </div>
  );
};
