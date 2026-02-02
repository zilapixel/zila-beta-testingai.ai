// Chat Management
class ChatManager {
    constructor() {
        this.currentChatId = null;
        this.chats = this.loadChats();
        this.messages = [];
        this.init();
    }

    init() {
        // Check authentication
        if (!authManager.requireAuth()) {
            return;
        }

        // Initialize UI elements
        this.menuBtn = document.getElementById('menuBtn');
        this.sidebar = document.getElementById('sidebar');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.chatHistory = document.getElementById('chatHistory');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Bind events
        this.bindEvents();

        // Load chat history
        this.renderChatHistory();

        // Create new chat if none exists
        if (Object.keys(this.chats).length === 0) {
            this.createNewChat();
        } else {
            // Load the most recent chat
            const chatIds = Object.keys(this.chats).sort((a, b) => 
                new Date(this.chats[b].updatedAt) - new Date(this.chats[a].updatedAt)
            );
            this.loadChat(chatIds[0]);
        }
    }

    bindEvents() {
        // Menu toggle
        this.menuBtn.addEventListener('click', () => {
            this.sidebar.classList.toggle('hidden');
        });

        // New chat
        this.newChatBtn.addEventListener('click', () => {
            this.createNewChat();
        });

        // Send message
        this.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter to send
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        });

        // Logout
        this.logoutBtn.addEventListener('click', () => {
            authManager.logout();
        });
    }

    // Load chats from localStorage
    loadChats() {
        const chatsStr = localStorage.getItem('zilaai_chats');
        return chatsStr ? JSON.parse(chatsStr) : {};
    }

    // Save chats to localStorage
    saveChats() {
        localStorage.setItem('zilaai_chats', JSON.stringify(this.chats));
    }

    // Create new chat
    createNewChat() {
        const chatId = Date.now().toString();
        this.currentChatId = chatId;
        this.messages = [];
        
        this.chats[chatId] = {
            id: chatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.saveChats();
        this.renderChatHistory();
        this.renderMessages();
    }

    // Load chat
    loadChat(chatId) {
        this.currentChatId = chatId;
        this.messages = this.chats[chatId].messages || [];
        this.renderMessages();
        this.highlightActiveChat(chatId);
    }

    // Render chat history
    renderChatHistory() {
        this.chatHistory.innerHTML = '';
        
        const chatIds = Object.keys(this.chats).sort((a, b) => 
            new Date(this.chats[b].updatedAt) - new Date(this.chats[a].updatedAt)
        );

        chatIds.forEach(chatId => {
            const chat = this.chats[chatId];
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.textContent = chat.title;
            chatItem.dataset.chatId = chatId;
            
            if (chatId === this.currentChatId) {
                chatItem.classList.add('active');
            }

            chatItem.addEventListener('click', () => {
                this.loadChat(chatId);
            });

            this.chatHistory.appendChild(chatItem);
        });
    }

    // Highlight active chat
    highlightActiveChat(chatId) {
        const chatItems = this.chatHistory.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            if (item.dataset.chatId === chatId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Render messages
    renderMessages() {
        if (this.messages.length === 0) {
            this.messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <img src="https://mgx-backend-cdn.metadl.com/generate/images/918632/2026-02-02/57b54aba-d4bb-4523-b1c0-3b6c9970adc8.png" alt="ZILA-AI" class="welcome-logo">
                    <h2>How can I help you today?</h2>
                </div>
            `;
        } else {
            this.messagesContainer.innerHTML = '';
            this.messages.forEach(msg => {
                this.appendMessage(msg.role, msg.content, false);
            });
        }
        
        this.scrollToBottom();
    }

    // Append message to UI
    appendMessage(role, content, shouldScroll = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);
        
        if (shouldScroll) {
            this.scrollToBottom();
        }
    }

    // Show typing indicator
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    // Remove typing indicator
    removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    // Detect language from text
    detectLanguage(text) {
        // Simple language detection based on character ranges
        const hasArabic = /[\u0600-\u06FF]/.test(text);
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
        const hasChinese = /[\u4E00-\u9FFF]/.test(text);
        const hasKorean = /[\uAC00-\uD7AF]/.test(text);
        const hasCyrillic = /[\u0400-\u04FF]/.test(text);
        const hasGreek = /[\u0370-\u03FF]/.test(text);
        
        if (hasArabic) return 'ar';
        if (hasJapanese) return 'ja';
        if (hasChinese) return 'zh';
        if (hasKorean) return 'ko';
        if (hasCyrillic) return 'ru';
        if (hasGreek) return 'el';
        
        return 'en'; // Default to English
    }

    // Generate AI response based on detected language
    async generateResponse(userMessage) {
        const lang = this.detectLanguage(userMessage);
        
        // Simulated multilingual responses
        const responses = {
            'en': [
                "I'm ZILA-AI, your Web3 intelligence assistant. How can I help you explore blockchain technology and decentralized innovation?",
                "That's an interesting question! As an AI-powered Web3 platform, I can help you understand complex concepts in artificial intelligence and blockchain.",
                "I'm here to assist you with any questions about AI, Web3, or decentralized technologies. What would you like to know?",
                "Thank you for your question. Let me provide you with insights based on the latest developments in AI and blockchain technology."
            ],
            'id': [
                "Saya ZILA-AI, asisten kecerdasan Web3 Anda. Bagaimana saya bisa membantu Anda menjelajahi teknologi blockchain dan inovasi terdesentralisasi?",
                "Itu pertanyaan yang menarik! Sebagai platform Web3 bertenaga AI, saya dapat membantu Anda memahami konsep kompleks dalam kecerdasan buatan dan blockchain.",
                "Saya di sini untuk membantu Anda dengan pertanyaan apa pun tentang AI, Web3, atau teknologi terdesentralisasi. Apa yang ingin Anda ketahui?",
                "Terima kasih atas pertanyaan Anda. Izinkan saya memberikan wawasan berdasarkan perkembangan terbaru dalam teknologi AI dan blockchain."
            ],
            'ja': [
                "私はZILA-AIです。Web3インテリジェンスアシスタントです。ブロックチェーン技術と分散型イノベーションの探索をどのようにお手伝いできますか？",
                "興味深い質問ですね！AIを活用したWeb3プラットフォームとして、人工知能とブロックチェーンの複雑な概念を理解するお手伝いができます。",
                "AI、Web3、または分散型技術に関するご質問にお答えします。何を知りたいですか？",
                "ご質問ありがとうございます。AIとブロックチェーン技術の最新動向に基づいて洞察を提供させていただきます。"
            ],
            'ar': [
                "أنا ZILA-AI، مساعد الذكاء Web3 الخاص بك. كيف يمكنني مساعدتك في استكشاف تقنية البلوكشين والابتكار اللامركزي؟",
                "هذا سؤال مثير للاهتمام! كمنصة Web3 مدعومة بالذكاء الاصطناعي، يمكنني مساعدتك في فهم المفاهيم المعقدة في الذكاء الاصطناعي والبلوكشين.",
                "أنا هنا لمساعدتك في أي أسئلة حول الذكاء الاصطناعي أو Web3 أو التقنيات اللامركزية. ماذا تريد أن تعرف؟",
                "شكراً على سؤالك. اسمح لي أن أقدم لك رؤى بناءً على أحدث التطورات في تكنولوجيا الذكاء الاصطناعي والبلوكشين."
            ],
            'zh': [
                "我是ZILA-AI，您的Web3智能助手。我如何帮助您探索区块链技术和去中心化创新？",
                "这是一个有趣的问题！作为一个由人工智能驱动的Web3平台，我可以帮助您理解人工智能和区块链中的复杂概念。",
                "我在这里帮助您解答有关AI、Web3或去中心化技术的任何问题。您想了解什么？",
                "感谢您的提问。让我根据AI和区块链技术的最新发展为您提供见解。"
            ],
            'es': [
                "Soy ZILA-AI, tu asistente de inteligencia Web3. ¿Cómo puedo ayudarte a explorar la tecnología blockchain y la innovación descentralizada?",
                "¡Esa es una pregunta interesante! Como plataforma Web3 impulsada por IA, puedo ayudarte a comprender conceptos complejos en inteligencia artificial y blockchain.",
                "Estoy aquí para ayudarte con cualquier pregunta sobre IA, Web3 o tecnologías descentralizadas. ¿Qué te gustaría saber?",
                "Gracias por tu pregunta. Permíteme proporcionarte información basada en los últimos desarrollos en tecnología de IA y blockchain."
            ],
            'fr': [
                "Je suis ZILA-AI, votre assistant d'intelligence Web3. Comment puis-je vous aider à explorer la technologie blockchain et l'innovation décentralisée?",
                "C'est une question intéressante! En tant que plateforme Web3 alimentée par l'IA, je peux vous aider à comprendre des concepts complexes en intelligence artificielle et blockchain.",
                "Je suis là pour vous aider avec toutes les questions sur l'IA, le Web3 ou les technologies décentralisées. Que voulez-vous savoir?",
                "Merci pour votre question. Permettez-moi de vous fournir des informations basées sur les derniers développements en technologie IA et blockchain."
            ],
            'ko': [
                "저는 ZILA-AI입니다. Web3 인텔리전스 어시스턴트입니다. 블록체인 기술과 탈중앙화 혁신을 탐색하는 데 어떻게 도움을 드릴 수 있을까요?",
                "흥미로운 질문이네요! AI 기반 Web3 플랫폼으로서 인공지능과 블록체인의 복잡한 개념을 이해하는 데 도움을 드릴 수 있습니다.",
                "AI, Web3 또는 탈중앙화 기술에 대한 질문이 있으시면 도와드리겠습니다. 무엇을 알고 싶으신가요?",
                "질문 감사합니다. AI와 블록체인 기술의 최신 개발을 기반으로 통찰력을 제공하겠습니다."
            ],
            'ru': [
                "Я ZILA-AI, ваш помощник по Web3 интеллекту. Как я могу помочь вам изучить технологию блокчейн и децентрализованные инновации?",
                "Это интересный вопрос! Как платформа Web3 на основе ИИ, я могу помочь вам понять сложные концепции искусственного интеллекта и блокчейна.",
                "Я здесь, чтобы помочь вам с любыми вопросами об ИИ, Web3 или децентрализованных технологиях. Что бы вы хотели узнать?",
                "Спасибо за ваш вопрос. Позвольте мне предоставить вам информацию на основе последних разработок в области ИИ и блокчейн технологий."
            ]
        };

        // Get responses for detected language or fallback to English
        const langResponses = responses[lang] || responses['en'];
        const randomResponse = langResponses[Math.floor(Math.random() * langResponses.length)];

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        return randomResponse;
    }

    // Send message
    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) return;

        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';

        // Add user message
        this.messages.push({ role: 'user', content: message });
        this.appendMessage('user', message);

        // Update chat title if this is the first message
        if (this.messages.length === 1) {
            this.chats[this.currentChatId].title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
            this.renderChatHistory();
        }

        // Show typing indicator
        this.showTypingIndicator();

        // Generate AI response
        const response = await this.generateResponse(message);

        // Remove typing indicator
        this.removeTypingIndicator();

        // Add assistant message
        this.messages.push({ role: 'assistant', content: response });
        this.appendMessage('assistant', response);

        // Save chat
        this.chats[this.currentChatId].messages = this.messages;
        this.chats[this.currentChatId].updatedAt = new Date().toISOString();
        this.saveChats();
    }

    // Scroll to bottom
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chat manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new ChatManager();
});
