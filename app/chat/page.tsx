'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/lib/firebase.config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Message {
    id: string;
    text: string;
    authorName: string;
    authorId: string;
    createdAt: any;
}

export default function ChatPage() {
    const [user] = useAuthState(auth);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    // Efeito para buscar as mensagens em tempo real
    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, "chat"), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData: Message[] = [];
            querySnapshot.forEach((doc) => {
                messagesData.push({ id: doc.id, ...doc.data() } as Message);
            });
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await addDoc(collection(db, "chat"), {
                text: newMessage,
                authorName: user.displayName || user.email,
                authorId: user.uid,
                createdAt: serverTimestamp(),
            });
            setNewMessage('');
        } catch (error) {
            console.error("Erro ao enviar mensagem: ", error);
        }
    };

    return (
        <div className="bg-dark text-white vh-100 d-flex flex-column">
            <header className="p-3 border-bottom border-secondary">
                <h1 className="h4">Chat da Comunidade</h1>
            </header>
            
            <main className="flex-grow-1 p-3 d-flex flex-column overflow-hidden">
                {/* Área de Mensagens */}
                <div className="flex-grow-1 overflow-auto mb-3">
                    {messages.length > 0 ? messages.map(msg => (
                        <div key={msg.id} className={`d-flex mb-2 ${msg.authorId === user?.uid ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`card ${msg.authorId === user?.uid ? 'bg-primary' : 'bg-secondary'}`} style={{maxWidth: '70%'}}>
                                <div className="card-body p-2">
                                    <p className="card-text small">{msg.text}</p>
                                    <small className="text-white-50" style={{fontSize: '0.7rem'}}>{msg.authorName}</small>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5 h-100 d-flex justify-content-center align-items-center">
                            <p className="text-white-50">Nenhuma mensagem ainda. Inicie a conversa!</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Formulário de Nova Mensagem */}
                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                    <input 
                        type="text"
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder={user ? "Digite uma mensagem..." : "Faça login para conversar."}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={!user}
                    />
                    <button type="submit" className="btn btn-primary" disabled={!user || !newMessage.trim()}>Enviar</button>
                </form>
            </main>
        </div>
    );
}
