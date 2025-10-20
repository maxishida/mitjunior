'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import InternalNavigation from '@/components/layout/InternalNavigation';
import {
  Activity,
  Award,
  Bookmark,
  Calendar,
  Filter,
  Hash,
  Heart,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  rank: string;
  isFollowing?: boolean;
}

interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  tags?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  category: 'discussion' | 'achievement' | 'tip' | 'question' | 'milestone';
}

const mockCurrentUser: User = {
  id: 'current_user',
  name: 'João Aluno',
  avatar: '/avatars/joao.jpg',
  level: 12,
  rank: 'Bronze III',
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Mitsuo Ishida',
    avatar: '/instructors/mitsuo.jpg',
    level: 50,
    rank: 'Mestre Financeiro',
  },
  { id: '2', name: 'Ana Silva', avatar: '/avatars/ana.jpg', level: 25, rank: 'Prata I' },
  { id: '3', name: 'Carlos Souza', avatar: '/avatars/carlos.jpg', level: 18, rank: 'Bronze I' },
  { id: '4', name: 'Mariana Costa', avatar: '/avatars/mariana.jpg', level: 32, rank: 'Ouro II' },
  { id: '5', name: 'Pedro Santos', avatar: '/avatars/pedro.jpg', level: 15, rank: 'Bronze II' },
];

const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[1],
    content:
      'Acabei de concluir o curso Investimentos do Zero ao Milhão! Foi transformador e já montei minha primeira carteira diversificada. Alguma dica para o próximo passo?',
    images: ['/posts/portfolio-1.jpg', '/posts/certificate-1.jpg'],
    tags: ['investimentos', 'conquista', 'carteira'],
    likes: 147,
    comments: 23,
    shares: 12,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-10-19T14:30:00Z',
    category: 'achievement',
  },
  {
    id: '2',
    author: mockUsers[0],
    content:
      'Dica do dia: crie sua reserva de emergência (3 a 6 meses de despesas) antes de começar a investir. Consistência e paciência vencem a maratona das finanças.',
    tags: ['dica', 'iniciantes', 'planejamento'],
    likes: 523,
    comments: 67,
    shares: 89,
    isLiked: true,
    isBookmarked: true,
    createdAt: '2024-10-19T10:15:00Z',
    category: 'tip',
  },
  {
    id: '3',
    author: mockUsers[2],
    content:
      'Vale a pena entrar em FIIs agora com juros altos? Estou em dúvida entre fundos imobiliários e Tesouro Direto. Como vocês estão posicionando a carteira?',
    tags: ['duvida', 'fiis', 'tesouro-direto'],
    likes: 34,
    comments: 45,
    shares: 2,
    isLiked: false,
    isBookmarked: false,
    createdAt: '2024-10-18T19:45:00Z',
    category: 'question',
  },
  {
    id: '4',
    author: mockUsers[3],
    content:
      'Minha estratégia com small caps em 2024: análise fundamentalista, diversificação por setores e horizonte de longo prazo. Resultado parcial: +35% no semestre.',
    tags: ['small-caps', 'estrategia', 'resultados'],
    likes: 89,
    comments: 34,
    shares: 15,
    isLiked: true,
    isBookmarked: false,
    createdAt: '2024-10-18T16:20:00Z',
    category: 'discussion',
  },
];

const categories = [
  { id: 'all', name: 'Todos', icon: TrendingUp },
  { id: 'discussion', name: 'Discussões', icon: MessageCircle },
  { id: 'achievement', name: 'Conquistas', icon: Award },
  { id: 'tip', name: 'Dicas', icon: Lightbulb },
  { id: 'question', name: 'Dúvidas', icon: HelpCircle },
  { id: 'milestone', name: 'Metas', icon: Target },
];

const trendingTags = [
  { tag: 'investimentos', count: 1234 },
  { tag: 'fiis', count: 892 },
  { tag: 'criptomoedas', count: 756 },
  { tag: 'imposto-de-renda', count: 623 },
  { tag: 'renda-variavel', count: 512 },
  { tag: 'tesouro-direto', count: 489 },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isBookmarked: !post.isBookmarked,
            }
          : post,
      ),
    );
  };

  const handleNewPost = () => {
    if (!newPostContent.trim()) {
      return;
    }

    const newPost: Post = {
      id: String(Date.now()),
      author: mockCurrentUser,
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      category: 'discussion',
      tags: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#040608] via-[#05080c] to-[#020204] text-white">
      <InternalNavigation />
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <CommunityHero />

        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            <button
              onClick={() => setShowNewPostModal(true)}
              className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-[0_25px_65px_-50px_rgba(0,0,0,0.9)] backdrop-blur transition hover:border-primary/40 hover:bg-white/10"
              type="button"
            >
              <div className="flex items-center gap-4">
                <Avatar name={mockCurrentUser.name} src={mockCurrentUser.avatar} size="lg" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-300">
                    Compartilhe um insight com a comunidade...
                  </p>
                </div>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Novo post
                </span>
              </div>
            </button>

            <CategoryPills
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <FeedHeader
              searchQuery={searchQuery}
              onChangeSearch={setSearchQuery}
              totalPosts={filteredPosts.length}
            />

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLikePost(post.id)}
                  onBookmark={() => handleBookmarkPost(post.id)}
                />
              ))}

              {filteredPosts.length === 0 && (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center text-sm text-neutral-400">
                  Nenhum post encontrado para os filtros selecionados.
                </div>
              )}
            </div>
          </div>

          <Sidebar
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
            trendingTags={trendingTags}
            contributors={mockUsers}
          />
        </section>
      </div>

      {showNewPostModal && (
        <NewPostModal
          newPostContent={newPostContent}
          onClose={() => setShowNewPostModal(false)}
          onSubmit={handleNewPost}
          onChangeContent={setNewPostContent}
          fileInputRef={fileInputRef}
        />
      )}
    </div>
  );
}

function CommunityHero() {
  const stats = [
    {
      label: 'Membros ativos',
      value: '2.847',
      icon: Users,
      trend: '+132 esta semana',
    },
    {
      label: 'Discussões hoje',
      value: '1.234',
      icon: MessageCircle,
      trend: 'Nova alta diária',
    },
    {
      label: 'Desafios concluídos',
      value: '468',
      icon: Target,
      trend: 'Meta 82% cumprida',
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-gradient-to-br from-[#0b1321] via-[#05080e] to-[#020305] p-10 shadow-[0_45px_120px_-70px_rgba(0,0,0,0.9)]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,200,150,0.18),_transparent_60%)]" />
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -left-36 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Comunidade Mitsuo
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-black leading-tight text-white sm:text-[3rem]">
              Conhecimento coletivo para acelerar sua jornada financeira
            </h1>
            <p className="max-w-2xl text-base text-neutral-200 sm:text-lg">
              Compartilhe aprendizados, receba feedbacks imediatos e acompanhe desafios semanais.
              Tudo guiado pela metodologia Mitsuo, com moderação dedicada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-2xl bg-primary px-7 py-3 text-base font-semibold text-white shadow-[0_25px_45px_-25px_rgba(0,200,150,0.75)] transition hover:translate-x-1 hover:shadow-[0_30px_55px_-25px_rgba(0,200,150,0.85)]"
            >
              <Activity className="h-5 w-5" aria-hidden="true" />
              Iniciar desafio diário
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-primary/60 hover:bg-primary/10"
            >
              <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
              Ver agenda da semana
            </button>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-white/10 blur-3xl" />
          <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 p-4 transition hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <stat.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">{stat.label}</p>
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                </div>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  {stat.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CategoryPillsProps {
  categories: { id: string; name: string; icon: React.ComponentType<any> }[];
  selectedCategory: string;
  onSelectCategory: (value: string) => void;
}

function CategoryPills({ categories, selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            type="button"
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-primary text-white shadow-[0_18px_35px_-20px_rgba(0,200,150,0.8)]'
                : 'bg-black/30 text-neutral-300 hover:bg-black/40'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

interface FeedHeaderProps {
  searchQuery: string;
  onChangeSearch: (value: string) => void;
  totalPosts: number;
}

function FeedHeader({ searchQuery, onChangeSearch, totalPosts }: FeedHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur md:flex-row md:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-primary">Feed da Comunidade</p>
        <h2 className="text-xl font-semibold text-white">{totalPosts} posts no momento</h2>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:w-auto">
        <div className="relative w-full sm:w-72">
          <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={searchQuery}
            onChange={(event) => onChangeSearch(event.target.value)}
            placeholder="Filtrar por palavra-chave"
            className="w-full rounded-2xl border border-white/10 bg-black/30 py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            type="text"
          />
        </div>
        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-neutral-300 transition hover:border-primary/50 hover:text-white"
        >
          Ordenar por relevância
        </button>
      </div>
    </div>
  );
}

interface SidebarProps {
  searchQuery: string;
  onChangeSearch: (value: string) => void;
  trendingTags: { tag: string; count: number }[];
  contributors: User[];
}

function Sidebar({ searchQuery, onChangeSearch, trendingTags, contributors }: SidebarProps) {
  const maxCount = Math.max(...trendingTags.map((item) => item.count));

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-80">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.26em] text-primary">Buscar na comunidade</p>
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={searchQuery}
              onChange={(event) => onChangeSearch(event.target.value)}
              placeholder="Digite um tópico ou autor"
              className="w-full rounded-2xl border border-white/10 bg-black/30 py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              type="text"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.26em] text-primary">Tópicos em alta</p>
        <div className="mt-4 space-y-3">
          {trendingTags.map(({ tag, count }) => {
            const width = Math.max(10, Math.round((count / maxCount) * 100));
            return (
              <button
                key={tag}
                onClick={() => onChangeSearch(tag)}
                type="button"
                className="w-full rounded-2xl border border-white/5 bg-black/30 p-3 text-left transition hover:border-primary/40 hover:bg-black/40"
              >
                <div className="flex items-center justify-between text-sm text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" aria-hidden="true" />
                    {tag}
                  </div>
                  <span className="text-xs text-neutral-500">{count}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/40"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.26em] text-primary">Contribuidores ativos</p>
        <div className="mt-4 space-y-3">
          {contributors.slice(0, 4).map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/30 p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar name={user.name} src={user.avatar} />
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-neutral-400">{user.rank}</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary transition hover:bg-primary/20"
              >
                Seguir
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.26em] text-primary">Próximos eventos</p>
        <div className="mt-4 space-y-3 text-sm text-neutral-300">
          <div className="rounded-2xl border border-white/5 bg-black/30 p-3">
            <p className="font-semibold text-white">Live: Ajustes do IR 2025</p>
            <p className="text-xs text-neutral-400">Quarta, 20h</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/30 p-3">
            <p className="font-semibold text-white">Hot seat: carteira analisada</p>
            <p className="text-xs text-neutral-400">Sexta, 19h</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onBookmark: () => void;
}

function PostCard({ post, onLike, onBookmark }: PostCardProps) {
  const categoryConfig: Record<Post['category'], { label: string; color: string }> = {
    achievement: { label: 'Conquista', color: 'text-yellow-400' },
    tip: { label: 'Dica', color: 'text-green-400' },
    question: { label: 'Dúvida', color: 'text-blue-400' },
    milestone: { label: 'Meta', color: 'text-purple-400' },
    discussion: { label: 'Discussão', color: 'text-neutral-300' },
  };

  const timeAgo = formatRelativeTime(post.createdAt);

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] transition hover:border-primary/40">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-1 gap-3">
          <Avatar name={post.author.name} src={post.author.avatar} />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">{post.author.name}</p>
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${categoryConfig[post.category].color}`}>
                {categoryConfig[post.category].label}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {post.author.rank} • {timeAgo} atrás
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-neutral-400 transition hover:text-white"
        >
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div className="mt-4 space-y-4">
        <p className="text-neutral-200">{post.content}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-neutral-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div
            className={`grid gap-3 ${
              post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'
            }`}
          >
            {post.images.map((image, index) => (
              <div key={image} className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={image}
                  alt={`Imagem do post ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 text-sm text-neutral-400">
        <div className="flex items-center gap-5">
          <button
            onClick={onLike}
            type="button"
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
              post.isLiked ? 'bg-red-500/20 text-red-400' : 'bg-black/20 hover:bg-black/30'
            }`}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
            {post.likes}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 transition hover:bg-black/30"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {post.comments}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 transition hover:bg-black/30"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {post.shares}
          </button>
        </div>

        <button
          onClick={onBookmark}
          type="button"
          className={`rounded-full border border-white/10 bg-black/20 p-2 transition ${
            post.isBookmarked ? 'text-primary' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
      </footer>
    </article>
  );
}

interface NewPostModalProps {
  newPostContent: string;
  onClose: () => void;
  onSubmit: () => void;
  onChangeContent: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

function NewPostModal({
  newPostContent,
  onClose,
  onSubmit,
  onChangeContent,
  fileInputRef,
}: NewPostModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1321] via-[#05080d] to-[#020203] p-6 shadow-[0_45px_120px_-60px_rgba(0,0,0,0.9)] md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Criar post</p>
              <h2 className="text-xl font-semibold text-white">Divulgue uma conquista ou dúvida</h2>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="rounded-full border border-white/10 bg-black/30 p-2 text-neutral-400 transition hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <textarea
            value={newPostContent}
            onChange={(event) => onChangeContent(event.target.value)}
            placeholder="Escreva seu post..."
            rows={8}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white placeholder:text-neutral-500 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-neutral-300 transition hover:border-primary/50 hover:text-white"
            >
              <ImageIcon />
              Adicionar imagem
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-neutral-300 transition hover:border-primary/50 hover:text-white"
            >
              <Hash className="h-4 w-4" aria-hidden="true" />
              Adicionar tags
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-neutral-300 transition hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              disabled={!newPostContent.trim()}
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-2 text-sm font-semibold text-white shadow-[0_25px_45px_-25px_rgba(0,200,150,0.75)] transition hover:translate-y-[-1px] hover:shadow-[0_30px_55px_-25px_rgba(0,200,150,0.85)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Publicar
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.26em] text-primary">Pré-visualização</p>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-300">
            {newPostContent.trim() ? (
              <p className="whitespace-pre-line">{newPostContent}</p>
            ) : (
              <p className="text-neutral-500">Comece a digitar para visualizar como seu post ficará.</p>
            )}
          </div>
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-4 text-xs text-neutral-400">
            Imagens adicionadas aparecerão aqui como miniaturas.
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, src, size = 'md' }: { name: string; src?: string; size?: 'md' | 'lg' }) {
  const dimension = size === 'lg' ? 48 : 40;

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={dimension}
        height={dimension}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: dimension, height: dimension }}
      className="flex items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary"
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function formatRelativeTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `${diffInMinutes} min`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`;
  return `${Math.floor(diffInMinutes / 1440)} d`;
}

function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 5 5a7.5 7.5 0 0 0 11.65 11.65Z"
      />
    </svg>
  );
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect width={18} height={14} x={3} y={5} rx={2} ry={2} strokeWidth={2} />
      <circle cx={8.5} cy={9.5} r={1.5} strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 15-3.5-4-4 5.5-2.5-3-3 4.5" />
    </svg>
  );
}
