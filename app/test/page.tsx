export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Teste Tailwind CSS
        </h1>
        <p className="text-gray-600 mb-4 text-lg">
          Se você vê cores e estilos corretos, o Tailwind está funcionando!
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-[#00C896] text-white rounded-lg">
            Verde customizado #00C896 (primary do design system)
          </div>

          <div className="p-4 bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-white rounded-lg">
            Gradiente verde customizado
          </div>

          <div className="p-4 bg-[#0F1419] text-white rounded-lg">
            Background dark #0F1419
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Botão Azul
            </button>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Botão Verde
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-red-100 rounded text-center">Red</div>
            <div className="p-4 bg-green-100 rounded text-center">Green</div>
            <div className="p-4 bg-blue-100 rounded text-center">Blue</div>
          </div>
        </div>

        <div className="mt-8 p-4 border-2 border-[#00C896] rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Status:</strong> Se todos os elementos acima estão estilizados corretamente,
            significa que o Tailwind CSS está funcionando perfeitamente!
          </p>
        </div>
      </div>
    </div>
  );
}
