'use client';

import * as React from "react";
import { Mail, Phone, MessageCircle, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const contactMethods = [
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@mitsuoishida.com",
    href: "mailto:contato@mitsuoishida.com",
    color: "from-brand-500 to-brand-600"
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+55 11 99999-9999",
    href: "https://wa.me/5511999999999",
    color: "from-success-500 to-success-600"
  },
  {
    icon: Phone,
    label: "Telefone",
    value: "+55 11 99999-9999",
    href: "tel:+5511999999999",
    color: "from-warning-500 to-warning-600"
  }
];

export interface ContactSectionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const ContactSection = React.forwardRef<HTMLElement, ContactSectionProps>(
  ({ className, ...props }, ref) => {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      phone: '',
      message: '',
      product: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px 0px -50px 0px",
        }
      );

      const currentRef = ref ? (ref as React.RefObject<HTMLElement>).current : null;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [ref]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        product: ''
      });

      // Resetar mensagem após 5 segundos
      setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
      <section
        ref={ref}
        id="contato"
        className={cn(
          "py-16 md:py-24 lg:py-32 relative overflow-hidden",
          "bg-gradient-to-b from-[#0F1419] to-[#1A1F26]",
          className
        )}
        {...props}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/5 to-transparent pointer-events-none" />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-50" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <MessageCircle className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-brand">Entre em Contato</span>
            </div>

            <h2 className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-100",
              isVisible && "opacity-100 translate-y-0"
            )}>
              Vamos Conversar Sua
              <span className="block text-brand">Transformação Financeira</span>
            </h2>

            <p className={cn(
              "text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-200",
              isVisible && "opacity-100 translate-y-0"
            )}>
              Tem dúvidas sobre nossos programas ou precisa de orientação personalizada?
              Estamos aqui para ajudar você a dar o primeiro passo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Methods */}
            <div className={cn(
              "space-y-8",
              "opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Formas de Contato
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Escolha o canal que preferir. Nossa equipe está pronta para atender
                  você e tirar todas as suas dúvidas sobre finanças pessoais.
                </p>
              </div>

              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <a
                    key={method.label}
                    href={method.href}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${method.color} items-center justify-center flex group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                        {method.label}
                      </div>
                      <div className="text-white font-medium group-hover:text-primary transition-colors">
                        {method.value}
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>

              {/* Location info */}
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-brand" />
                  <span className="text-white font-medium">Atendimento Online</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Atendemos todo o Brasil através de consultoria online.
                  Flexibilidade e comodidade para você.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className={cn(
              "p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10",
              "opacity-0 translate-y-8 transition-all duration-700 ease-out delay-500",
              isVisible && "opacity-100 translate-y-0"
            )}>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-gray-400">
                    Entraremos em contato em até 24 horas úteis.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nome completo
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Seu nome completo"
                      className="bg-white/5 border-gray-600 text-white placeholder-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        E-mail
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="seu@email.com"
                        className="bg-white/5 border-gray-600 text-white placeholder-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Telefone/WhatsApp
                      </label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        className="bg-white/5 border-gray-600 text-white placeholder-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-gray-300 mb-2">
                      Interesse em
                    </label>
                    <select
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200"
                    >
                      <option value="" className="bg-gray-800">Selecione uma opção</option>
                      <option value="academia" className="bg-gray-800">Academia de Finanças</option>
                      <option value="verao" className="bg-gray-800">Projeto Verão</option>
                      <option value="consultoria" className="bg-gray-800">Consultoria Personalizada</option>
                      <option value="ebook" className="bg-gray-800">E-book</option>
                      <option value="duvidas" className="bg-gray-800">Outras dúvidas</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Conte um pouco sobre seus objetivos e como podemos ajudar..."
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    variant="primary"
                    className="w-full shadow-lg shadow-brand/25 hover:shadow-brand/40 py-4"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Respeitamos sua privacidade. Seus dados estão seguros conosco.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F1419] to-transparent pointer-events-none" />
      </section>
    )
  }
);

ContactSection.displayName = "ContactSection";

export { ContactSection };