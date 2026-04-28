// Analytics-focused chatbot for NourishNet home page
class AnalyticsChatbot {
    constructor(containerId) {
        this.containerId = containerId;
        this.isOpen = false;
        this.conversationState = { step: 'greeting', data: {} };
        this.init();
    }

    init() {
        this.createChatWidget();
        this.bindEvents();
    }

    createChatWidget() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <!-- Chat Toggle Button -->
            <div class="analytics-chat-toggle" id="analyticsChatToggle">
                <i class="fa-solid fa-chart-line"></i>
                <span class="chat-pulse"></span>
            </div>

            <!-- Chat Window -->
            <div class="analytics-chat-window" id="analyticsChatWindow">
                <div class="analytics-chat-header">
                    <div class="chat-avatar">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>
                    <div class="chat-info">
                        <h4>NourishNet Analytics</h4>
                        <p>Donation insights & improvements</p>
                    </div>
                    <button class="chat-close" id="analyticsChatClose">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                
                <div class="analytics-chat-messages" id="analyticsChatMessages">
                    <div class="message bot">
                        <div class="message-bubble">
                            👋 Hi! I'm your analytics assistant. I can help you understand donation patterns, impact metrics, and suggest improvements for the platform.
                        </div>
                    </div>
                    
                    <div class="message bot">
                        <div class="message-bubble">
                            Here are some things you can ask me about:
                        </div>
                        <div class="suggested-questions">
                            <div class="suggestion-category">
                                <h5><i class="fa-solid fa-chart-bar"></i> Recent Analytics</h5>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('What are the latest donation statistics?')">
                                    📊 Latest donation statistics
                                </div>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('Which NGOs received the most donations this month?')">
                                    🏆 Top performing NGOs
                                </div>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('What food types are donated most frequently?')">
                                    🍽️ Popular food categories
                                </div>
                            </div>
                            
                            <div class="suggestion-category">
                                <h5><i class="fa-solid fa-lightbulb"></i> Improvements</h5>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('How can we reduce food waste in the system?')">
                                    ♻️ Reduce food waste
                                </div>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('What improvements can increase volunteer participation?')">
                                    🚀 Boost volunteer engagement
                                </div>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('How to optimize delivery routes?')">
                                    🗺️ Optimize delivery efficiency
                                </div>
                            </div>
                            
                            <div class="suggestion-category">
                                <h5><i class="fa-solid fa-target"></i> Impact Analysis</h5>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('How many people were fed this week?')">
                                    👥 Weekly impact summary
                                </div>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('What is our carbon footprint reduction?')">
                                    🌱 Environmental impact
                                </div>
                                <div class="suggestion-item" onclick="analyticsBot.askQuestion('Show me donation trends over time')">
                                    📈 Donation trends
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-chat-input">
                    <input type="text" id="analyticsChatInput" placeholder="Ask about donations, analytics, or improvements..." />
                    <button id="analyticsChatSend">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        this.addAnalyticsStyles();
    }

    addAnalyticsStyles() {
        if (document.getElementById('analytics-chatbot-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'analytics-chatbot-styles';
        styles.textContent = `
            .analytics-chat-toggle {
                position: fixed;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 120px;
                background: linear-gradient(135deg, #8b5cf6, #6366f1);
                border-radius: 25px 0 0 25px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: -3px 0 20px rgba(139, 92, 246, 0.4);
                z-index: 1000;
                transition: all 0.3s ease;
                writing-mode: vertical-rl;
                text-orientation: mixed;
            }

            .analytics-chat-toggle:hover {
                width: 55px;
                box-shadow: -5px 0 30px rgba(139, 92, 246, 0.6);
                transform: translateY(-50%) translateX(-5px);
            }

            .analytics-chat-toggle i {
                color: white;
                font-size: 1.8rem;
                margin-bottom: 8px;
            }

            .analytics-chat-toggle::after {
                content: "Analytics";
                color: white;
                font-size: 0.7rem;
                font-weight: 600;
                letter-spacing: 1px;
                writing-mode: vertical-rl;
                text-orientation: mixed;
            }

            .chat-pulse {
                position: absolute;
                top: 10px;
                left: -5px;
                width: 15px;
                height: 15px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }

            .analytics-chat-window {
                position: fixed;
                right: 60px;
                top: 50%;
                transform: translateY(-50%);
                width: 420px;
                height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                display: none;
                flex-direction: column;
                z-index: 1001;
                overflow: hidden;
                border: 2px solid #e5e7eb;
            }

            .analytics-chat-window.open {
                display: flex;
                animation: slideInRight 0.4s ease;
            }

            @keyframes slideInRight {
                from { transform: translateY(-50%) translateX(30px) scale(0.9); opacity: 0; }
                to { transform: translateY(-50%) translateX(0) scale(1); opacity: 1; }
            }

            .analytics-chat-header {
                background: linear-gradient(135deg, #1f2937, #111827);
                color: white;
                padding: 1.25rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .chat-avatar {
                width: 45px;
                height: 45px;
                background: linear-gradient(135deg, #8b5cf6, #6366f1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.3rem;
            }

            .chat-info h4 {
                margin: 0;
                font-size: 1.1rem;
                font-weight: 700;
            }

            .chat-info p {
                margin: 0;
                font-size: 0.85rem;
                opacity: 0.8;
            }

            .chat-close {
                margin-left: auto;
                background: rgba(255,255,255,0.15);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .chat-close:hover {
                background: rgba(255,255,255,0.25);
            }

            .analytics-chat-messages {
                flex: 1;
                padding: 1.25rem;
                overflow-y: auto;
                background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            }

            .message {
                margin-bottom: 1.25rem;
                display: flex;
                flex-direction: column;
            }

            .message.bot {
                align-items: flex-start;
            }

            .message.user {
                align-items: flex-end;
            }

            .message-bubble {
                max-width: 85%;
                padding: 1rem 1.25rem;
                border-radius: 18px;
                font-size: 0.95rem;
                line-height: 1.5;
            }

            .message.bot .message-bubble {
                background: white;
                color: #1f2937;
                border-bottom-left-radius: 6px;
                box-shadow: 0 3px 12px rgba(0,0,0,0.08);
                border: 1px solid #e5e7eb;
            }

            .message.user .message-bubble {
                background: linear-gradient(135deg, #8b5cf6, #6366f1);
                color: white;
                border-bottom-right-radius: 6px;
            }

            .suggested-questions {
                margin-top: 1rem;
                max-width: 100%;
            }

            .suggestion-category {
                margin-bottom: 1.25rem;
                background: #f8fafc;
                border-radius: 12px;
                padding: 1rem;
                border: 1px solid #e2e8f0;
            }

            .suggestion-category h5 {
                margin: 0 0 0.75rem 0;
                font-size: 0.9rem;
                font-weight: 600;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .suggestion-category h5 i {
                color: #8b5cf6;
            }

            .suggestion-item {
                padding: 0.75rem;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                margin-bottom: 0.5rem;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .suggestion-item:hover {
                border-color: #8b5cf6;
                background: #faf5ff;
                transform: translateX(3px);
            }

            .suggestion-item:last-child {
                margin-bottom: 0;
            }

            .analytics-chat-input {
                padding: 1.25rem;
                background: white;
                border-top: 2px solid #f1f5f9;
                display: flex;
                gap: 0.75rem;
            }

            .analytics-chat-input input {
                flex: 1;
                padding: 0.875rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 25px;
                outline: none;
                font-size: 0.9rem;
                transition: all 0.3s;
            }

            .analytics-chat-input input:focus {
                border-color: #8b5cf6;
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            }

            .analytics-chat-input button {
                width: 45px;
                height: 45px;
                background: linear-gradient(135deg, #8b5cf6, #6366f1);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .analytics-chat-input button:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
            }

            @media (max-width: 768px) {
                .analytics-chat-toggle {
                    width: 45px;
                    height: 100px;
                }
                
                .analytics-chat-toggle::after {
                    font-size: 0.6rem;
                }
                
                .analytics-chat-window {
                    width: calc(100vw - 70px);
                    height: 70vh;
                    right: 55px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        const toggle = document.getElementById('analyticsChatToggle');
        const close = document.getElementById('analyticsChatClose');
        const send = document.getElementById('analyticsChatSend');
        const input = document.getElementById('analyticsChatInput');

        toggle?.addEventListener('click', () => this.toggleChat());
        close?.addEventListener('click', () => this.closeChat());
        send?.addEventListener('click', () => this.sendMessage());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        const window = document.getElementById('analyticsChatWindow');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            window.classList.add('open');
        } else {
            window.classList.remove('open');
        }
    }

    closeChat() {
        const window = document.getElementById('analyticsChatWindow');
        window.classList.remove('open');
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('analyticsChatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, true);
            input.value = '';
            this.processMessage(message);
        }
    }

    askQuestion(question) {
        this.addMessage(question, true);
        this.processMessage(question);
    }

    addMessage(content, isUser = false) {
        const messagesContainer = document.getElementById('analyticsChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${content}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async processMessage(message) {
        // Show typing indicator
        setTimeout(async () => {
            const response = await this.getAnalyticsResponse(message);
            this.addMessage(response);
        }, 1200);
    }

    async getAnalyticsResponse(message) {
        try {
            const response = await fetch('http://localhost:3000/analytics-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    context: this.conversationState
                })
            });

            const result = await response.json();
            return result.response || "I'm analyzing the data. Let me get back to you with insights.";
        } catch (error) {
            return "I'm currently processing analytics data. Please ensure the backend server is running for real-time insights.";
        }
    }
}

// Initialize analytics chatbot
let analyticsBot;
document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('analytics-chatbot-container');
    if (chatContainer) {
        analyticsBot = new AnalyticsChatbot('analytics-chatbot-container');
    }
});