export const IsLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight mb-5">
          Cargando...
        </h1>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
