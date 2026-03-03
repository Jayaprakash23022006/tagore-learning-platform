// Global utilities for Tagore Learning Platform

function initAIChat() {
    const chatBtn = document.getElementById('chatBtn');
    if (!chatBtn) return;

    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChat');

    chatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        chatInput.focus();
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = text;
        chatMessages.appendChild(userMsg);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add Loading indicator
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message ai';
        loadingMsg.innerHTML = '<span class="loading">Thinking...</span>';
        chatMessages.appendChild(loadingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Get page context for system prompt
            const pageName = document.title;
            const systemPrompt = `You are the AI Tutor for the Tagore Learning Platform. The user is currently on the "${pageName}" portal. Be helpful, concise, and educational.`;

            // Assume server is running on localhost:5000
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, systemPrompt })
            });

            const data = await response.json();
            chatMessages.removeChild(loadingMsg);

            if (response.ok) {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'message ai';
                aiMsg.textContent = data.reply;
                chatMessages.appendChild(aiMsg);
            } else {
                throw new Error(data.error || 'Server error');
            }

        } catch (error) {
            chatMessages.removeChild(loadingMsg);
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message ai';
            errorMsg.style.color = '#ef4444';
            errorMsg.textContent = `Error: ${error.message}. Ensure backend server is running on port 5000.`;
            chatMessages.appendChild(errorMsg);
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function handleLogin(portalType, fallbackUrl) {
    // Basic mock navigation to specific portal via welcome
    // using localStorage to pass intended portal
    localStorage.setItem('targetPortal', fallbackUrl);
    window.location.href = 'welcome.html';
}

document.addEventListener('DOMContentLoaded', () => {
    initAIChat();
});
