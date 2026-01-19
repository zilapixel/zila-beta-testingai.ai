// ZILA AI Chat Logic
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// ZILA Token Information
const ZILA_TOKEN_INFO = {
    vision: "ZILA is a next-generation blockchain token designed to integrate AI, Web3, and decentralized finance. Its vision is to create a transparent, intelligent, and community-driven digital ecosystem.",
    mission: [
        "Empower users through AI-driven blockchain solutions",
        "Enable secure, scalable, and decentralized financial systems",
        "Support staking, presale, and long-term ecosystem growth",
        "Build global accessibility without borders"
    ],
    website: "https://zilaa10.github.io/TOKENOMICS-ZILA.ai/"
};

// Keywords that trigger ZILA token response
const ZILA_KEYWORDS = [
    'zila token', 'token zila', 'zila crypto', 'zila coin',
    'what is zila', 'tell me about zila', 'zila blockchain',
    'zila presale', 'buy zila', 'zila price'
];

// Function to check if message is about ZILA token
function isAboutZILA(message) {
    const lowerMessage = message.toLowerCase();
    return ZILA_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

// Function to generate ZILA token response
function generateZILAResponse() {
    const missionList = ZILA_TOKEN_INFO.mission.map(item => `• ${item}`).join('\n');
    
    return `<strong>ZILA Token Vision:</strong><br>
${ZILA_TOKEN_INFO.vision}<br><br>
<strong>ZILA Token Mission:</strong><br>
${missionList.replace(/\n/g, '<br>')}<br><br>
<strong>For more information, visit the official ZILA website:</strong><br>
<a href="${ZILA_TOKEN_INFO.website}" target="_blank">${ZILA_TOKEN_INFO.website}</a>`;
}

// Function to generate AI response
function generateAIResponse(userMessage) {
    // Check if question is about ZILA token
    if (isAboutZILA(userMessage)) {
        return generateZILAResponse();
    }

    // General responses for common questions
    const lowerMessage = userMessage.toLowerCase();

    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
        return "Hello! I'm ZILA AI, your advanced multilingual assistant. How can I help you today?";
    }

    // About ZILA AI
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you') || lowerMessage.includes('about you')) {
        return "I'm ZILA AI, an advanced multilingual AI assistant. I can understand and respond in all human languages. I'm designed to be polite, futuristic, and professional. I can help you with questions, provide information, and assist you with various tasks. I'm also integrated with blockchain technology through the ZILA token ecosystem.";
    }

    // Capabilities
    if (lowerMessage.includes('what can you do') || lowerMessage.includes('your capabilities') || lowerMessage.includes('help me')) {
        return "I can help you with:<br>• Answering questions in any language<br>• Providing information on various topics<br>• Explaining concepts clearly and accurately<br>• Information about ZILA token and blockchain<br>• General assistance and conversation<br><br>Just ask me anything!";
    }

    // Languages
    if (lowerMessage.includes('language') || lowerMessage.includes('multilingual')) {
        return "I support all human languages! You can communicate with me in any language, and I'll automatically detect and respond in the same language. This makes me accessible to users worldwide.";
    }

    // Blockchain/Web3
    if (lowerMessage.includes('blockchain') || lowerMessage.includes('web3') || lowerMessage.includes('crypto') || lowerMessage.includes('defi')) {
        return "I'm built on Web3 principles, integrating AI with blockchain technology. ZILA represents the future of decentralized AI systems. For specific information about ZILA token, please ask me about 'ZILA token' or visit our official website.";
    }

    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're welcome! I'm here to help anytime. Feel free to ask me anything else!";
    }

    // Default response
    return `I understand your question: "${userMessage}"<br><br>As ZILA AI, I'm here to provide helpful and accurate information. While I can discuss many topics, I specialize in:<br>• General knowledge and explanations<br>• Information about ZILA token and blockchain<br>• Multilingual communication<br><br>Could you please provide more specific details about what you'd like to know?`;
}

// Function to add message to chat
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = isUser ? 'YOU' : 'AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const paragraph = document.createElement('p');
    paragraph.innerHTML = content;
    
    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle sending message
function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    userInput.value = '';
    
    // Simulate AI thinking delay
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessage(aiResponse, false);
    }, 500);
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Focus input on load
window.addEventListener('load', () => {
    userInput.focus();
});
