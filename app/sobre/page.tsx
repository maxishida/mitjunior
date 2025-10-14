import Navbar from '@/components/Navbar';

export default function SobrePage() {
  return (
    <div className="bg-dark text-white min-vh-100">
      <Navbar />
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="mb-4">Sobre o ComunidadeFlix</h1>
            <p className="lead mb-4">
              Transforme conhecimento em crescimento com a plataforma premium de educação financeira.
            </p>

            <section className="mb-5">
              <h2 className="h3 mb-3">Nossa Missão</h2>
              <p>
                O ComunidadeFlix é uma plataforma dedicada a democratizar o acesso à educação financeira de qualidade.
                Acreditamos que o conhecimento financeiro é fundamental para o crescimento pessoal e profissional.
              </p>
            </section>

            <section className="mb-5">
              <h2 className="h3 mb-3">O Que Oferecemos</h2>
              <ul className="list-unstyled">
                <li className="mb-2">✅ Cursos em vídeo de alta qualidade</li>
                <li className="mb-2">✅ Comunidade ativa e engajada</li>
                <li className="mb-2">✅ Chat em tempo real</li>
                <li className="mb-2">✅ Progresso personalizado</li>
                <li className="mb-2">✅ Conteúdo exclusivo e atualizado</li>
              </ul>
            </section>

            <section>
              <h2 className="h3 mb-3">Junte-se a Nós</h2>
              <p>
                Faça parte de uma comunidade que valoriza o aprendizado contínuo e o crescimento coletivo.
              </p>
              <a href="/signup" className="btn btn-success btn-lg">
                Começar Agora
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
