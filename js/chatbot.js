// Role-specific chatbot for NourishNet dashboards
class NourishNetChatbot {
    constructor(role, containerId) {
        this.role = role;
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
            <div class="chat-toggle" id="chatToggle">
                <i class="fa-solid fa-robot"></i>
                <span class="chat-badge">Amina AI</span>
            </div>

            <!-- Chat Window -->
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <div class="chat-avatar">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div class="chat-info">
                        <h4>Amina AI</h4>
                        <p>${this.getRoleDescription()}</p>
                    </div>
                    <button class="chat-close" id="chatClose">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="message bot">
                        <div class="message-bubble">
                            ${this.getGreeting()}
                        </div>
                    </div>
                    
                    <div class="message bot">
                        <div class="message-bubble">
                            Here are some common questions I can help you with:
                        </div>
                        <div class="role-suggestions">
                            ${this.renderSuggestedQuestions()}
                        </div>
                    </div>
                </div>
                
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="Type your message..." />
                    <button id="chatSend">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        this.addChatStyles();
    }

    addChatStyles() {
        if (document.getElementById('chatbot-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'chatbot-styles';
        styles.textContent = `
            .chat-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                z-index: 1000;
                transition: all 0.3s ease;
            }

            .chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
            }

            .chat-toggle i {
                color: white;
                font-size: 1.5rem;
            }

            .chat-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ff6b6b;
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: 600;
            }

            .chat-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                z-index: 1001;
                overflow: hidden;
            }

            .chat-window.open {
                display: flex;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .chat-header {
                background: linear-gradient(135deg, #4a5568, #2d3748);
                color: white;
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .chat-avatar {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #ff7f50, #ff6b6b);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }

            .chat-info h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }

            .chat-info p {
                margin: 0;
                font-size: 0.8rem;
                opacity: 0.8;
            }

            .chat-close {
                margin-left: auto;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chat-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                background: #f8fafc;
            }

            .message {
                margin-bottom: 1rem;
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
                max-width: 80%;
                padding: 0.75rem 1rem;
                border-radius: 15px;
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .message.bot .message-bubble {
                background: white;
                color: #2d3748;
                border-bottom-left-radius: 5px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .message.user .message-bubble {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-bottom-right-radius: 5px;
            }

            .quick-replies {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 0.75rem;
            }

            .quick-reply {
                padding: 0.5rem 0.75rem;
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 20px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s;
            }

            .quick-reply:hover {
                border-color: #667eea;
                background: #f7fafc;
            }

            .chat-input {
                padding: 1rem;
                background: white;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 0.5rem;
            }

            .chat-input input {
                flex: 1;
                padding: 0.75rem;
                border: 2px solid #e2e8f0;
                border-radius: 20px;
                outline: none;
                font-size: 0.9rem;
            }

            .chat-input input:focus {
                border-color: #667eea;
            }

            .chat-input button {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .role-suggestions {
                margin-top: 1rem;
                max-width: 100%;
            }

            .suggestion-category {
                margin-bottom: 1rem;
                background: #f8fafc;
                border-radius: 10px;
                padding: 0.875rem;
                border: 1px solid #e2e8f0;
            }

            .suggestion-category h5 {
                margin: 0 0 0.625rem 0;
                font-size: 0.85rem;
                font-weight: 600;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 0.4rem;
            }

            .suggestion-item {
                padding: 0.625rem 0.75rem;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                margin-bottom: 0.4rem;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                gap: 0.4rem;
            }

            .suggestion-item:hover {
                border-color: #667eea;
                background: #f7fafc;
                transform: translateX(2px);
            }

            .suggestion-item:last-child {
                margin-bottom: 0;
            }

            @media (max-width: 768px) {
                .chat-window {
                    width: calc(100vw - 40px);
                    height: 70vh;
                    bottom: 90px;
                    right: 20px;
                    left: 20px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        const toggle = document.getElementById('chatToggle');
        const close = document.getElementById('chatClose');
        const send = document.getElementById('chatSend');
        const input = document.getElementById('chatInput');

        toggle?.addEventListener('click', () => this.toggleChat());
        close?.addEventListener('click', () => this.closeChat());
        send?.addEventListener('click', () => this.sendMessage());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        const window = document.getElementById('chatWindow');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            window.classList.add('open');
        } else {
            window.classList.remove('open');
        }
    }

    closeChat() {
        const window = document.getElementById('chatWindow');
        window.classList.remove('open');
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, true);
            input.value = '';
            this.processMessage(message);
        }
    }

    addMessage(content, isUser = false) {
        const messagesContainer = document.getElementById('chatMessages');
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
            const response = await this.getAIResponse(message);
            this.addMessage(response);
        }, 1000);
    }

    async getAIResponse(message) {
        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    role: this.role,
                    context: this.conversationState
                })
            });

            const result = await response.json();
            return result.response || "I'm having trouble connecting right now. Please try again.";
        } catch (error) {
            return "I'm currently offline. Please make sure the backend server is running.";
        }
    }

    getRoleDescription() {
        const descriptions = {
            'hotel': 'Food donation assistant',
            'ngo': 'Donation management helper',
            'volunteer': 'Task coordination assistant',
            'donor': 'Impact tracking helper'
        };
        return descriptions[this.role] || 'Your AI assistant';
    }

    getGreeting() {
        const greetings = {
            'hotel': `Hi! I'm here to help you donate surplus food to NGOs. What would you like to know?`,
            'ngo': `Hello! I can help you manage incoming donations and coordinate with volunteers. How can I assist?`,
            'volunteer': `Hey there! I'm here to help you find delivery tasks and track your impact. What do you need?`,
            'donor': `Hi! I can help you make meaningful donations and track your impact. What would you like to do?`
        };
        return greetings[this.role] || 'Hello! How can I help you today?';
    }

    getSuggestedQuestions() {
        const suggestions = {
            'hotel': {
                'Getting Started': [
                    { text: '🍽️ How do I donate surplus food?', question: 'How do I donate surplus food from my restaurant?' },
                    { text: '📋 What types of food can I donate?', question: 'What types of food are accepted for donation?' },
                    { text: '⏰ How quickly will food be picked up?', question: 'How quickly will volunteers pick up my donated food?' }
                ],
                'Process & Requirements': [
                    { text: '📦 How should I package the food?', question: 'How should I package food for donation pickup?' },
                    { text: '🕐 Can I schedule regular donations?', question: 'Can I set up regular donation schedules?' },
                    { text: '📄 What documentation do I need?', question: 'What documentation or permits do I need for food donation?' }
                ],
                'Impact & Tracking': [
                    { text: '📊 What\'s my donation impact?', question: 'How many people have I fed through my donations?' },
                    { text: '🏆 How do I earn badges?', question: 'How can I earn contributor badges and recognition?' },
                    { text: '📈 Can I see donation history?', question: 'Where can I view my complete donation history?' }
                ]
            },
            'ngo': {
                'Donation Management': [
                    { text: '📥 How do I accept donations?', question: 'How do I accept and manage incoming food donations?' },
                    { text: '🔍 How to find available donations?', question: 'How can I find available food donations in my area?' },
                    { text: '❌ Can I reject unsuitable donations?', question: 'Can I reject donations that don\'t meet our requirements?' }
                ],
                'Volunteer Coordination': [
                    { text: '🚚 How to coordinate with volunteers?', question: 'How do I coordinate pickup and delivery with volunteers?' },
                    { text: '📞 How to contact volunteers directly?', question: 'Can I contact volunteers directly for urgent pickups?' },
                    { text: '⭐ How to rate volunteer performance?', question: 'How do I rate and provide feedback on volunteer performance?' }
                ],
                'Impact & Reporting': [
                    { text: '📊 How to track people fed?', question: 'How do I track and report the number of people we\'ve fed?' },
                    { text: '📸 How to upload impact photos?', question: 'How do I upload photos and videos of food distribution?' },
                    { text: '📋 How to generate reports?', question: 'How can I generate impact reports for donors and stakeholders?' }
                ]
            },
            'volunteer': {
                'Finding Tasks': [
                    { text: '📍 What tasks are available near me?', question: 'What delivery tasks are available in my area?' },
                    { text: '🚗 Tasks matching my vehicle type?', question: 'Show me tasks that match my vehicle type and capacity' },
                    { text: '⚡ Are there any urgent deliveries?', question: 'Are there any urgent or high-priority delivery tasks?' }
                ],
                'Task Management': [
                    { text: '✅ How do I accept a delivery task?', question: 'How do I accept and start a delivery task?' },
                    { text: '📱 How to update task status?', question: 'How do I update the status of my current delivery?' },
                    { text: '🗺️ How to get navigation help?', question: 'Can I get navigation assistance for pickup and delivery locations?' }
                ],
                'Performance & Rewards': [
                    { text: '📈 What\'s my volunteer impact?', question: 'How many deliveries have I completed and people helped?' },
                    { text: '⭐ How is my rating calculated?', question: 'How is my volunteer rating calculated and how can I improve it?' },
                    { text: '🏅 What rewards can I earn?', question: 'What badges and rewards can I earn as a volunteer?' }
                ]
            },
            'donor': {
                'Making Donations': [
                    { text: '🎂 How to donate for my birthday?', question: 'How can I make a donation to celebrate my birthday?' },
                    { text: '🏢 Which NGO should I choose?', question: 'How do I choose the right NGO for my donation?' },
                    { text: '💰 What donation amounts are suggested?', question: 'What are typical donation amounts for different occasions?' }
                ],
                'Occasions & Celebrations': [
                    { text: '💒 Wedding celebration donations?', question: 'How can I make a donation to celebrate my wedding?' },
                    { text: '🎓 Graduation milestone giving?', question: 'How do I donate to mark my graduation achievement?' },
                    { text: '🎉 Festival and holiday donations?', question: 'How can I make donations during festivals and holidays?' }
                ],
                'Impact & Sharing': [
                    { text: '👥 How many people will I feed?', question: 'How many people will my donation be able to feed?' },
                    { text: '📸 Can I see distribution photos?', question: 'Can I see photos and videos of my donation being distributed?' },
                    { text: '📱 How to share my impact?', question: 'How can I share my donation impact on social media?' }
                ]
            }
        };
        return suggestions[this.role] || {};
    }

    renderSuggestedQuestions() {
        const suggestions = this.getSuggestedQuestions();
        let html = '';
        
        Object.keys(suggestions).forEach(category => {
            html += `
                <div class="suggestion-category">
                    <h5>${category}</h5>
                    ${suggestions[category].map(item => `
                        <div class="suggestion-item" onclick="window.chatbotInstance_${this.role}.askSuggestedQuestion('${item.question.replace(/'/g, "\\'")}')">
                            ${item.text}
                        </div>
                    `).join('')}
                </div>
            `;
        });
        
        return html;
    }

    askSuggestedQuestion(question) {
        this.addMessage(question, true);
        this.processMessage(question);
    }
}

// Auto-initialize chatbot if role is specified
document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatbot-container');
    if (chatContainer && window.userRole) {
        const chatbot = new NourishNetChatbot(window.userRole, 'chatbot-container');
        // Store globally for suggested questions
        window[`chatbotInstance_${window.userRole}`] = chatbot;
    }
});