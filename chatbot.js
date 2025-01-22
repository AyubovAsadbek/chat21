// Yordamchi funksiyalar
function createElement(tag, options = {}, styles = {}) {
  const el = document.createElement(tag);
  Object.assign(el, options);
  Object.assign(el.style, styles);
  return el;
}

// Elementlarni yaratish
const app = createElement(
  "div",
  {},
  {
    position: "fixed",
    bottom: "8px",
    right: "8px",
    zIndex: 1000,
  }
);

const chatButton = createElement(
  "button",
  { innerText: "Chat" },
  {
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderRadius: "50%",
    padding: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    outline: "none",
    border: "none",
  }
);

const chatBox = createElement(
  "div",
  {},
  {
    display: "none",
    position: "absolute",
    bottom: "60px",
    right: "0",
    width: "320px",
    height: "450px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  }
);

// Header
const chatHeader = createElement(
  "div",
  { innerText: "Aisha AI" },
  {
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "16px",
    fontWeight: "bold",
  }
);

// Messages container
const messageContainer = createElement(
  "div",
  {},
  {
    flex: "1",
    overflowY: "auto",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }
);

// Input container
const inputContainer = createElement(
  "div",
  {},
  {
    padding: "8px",
    borderTop: "1px solid #ddd",
    display: "flex",
    gap: "8px",
  }
);

const inputField = createElement(
  "input",
  { placeholder: "Type a message..." },
  {
    flex: "1",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
  }
);

const sendButton = createElement(
  "button",
  { innerText: "Send" },
  {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  }
);

// Chat toggling
let isChatOpen = false;
chatButton.addEventListener("click", () => {
  isChatOpen = !isChatOpen;
  chatBox.style.display = isChatOpen ? "block" : "none";
  chatButton.innerText = isChatOpen ? "Close" : "Chat";
});

// Messages array
const messages = [
  { content: "Hello! How can I assist you today?", isUser: false },
];

function renderMessages() {
  messageContainer.innerHTML = "";
  messages.forEach((msg) => {
    const messageBubble = createElement(
      "div",
      { innerText: msg.content },
      {
        maxWidth: "70%",
        padding: "8px",
        borderRadius: "13px",
        backgroundColor: msg.isUser ? "#1F93FF" : "#f1f1f1",
        color: msg.isUser ? "#fff" : "#000",
        alignSelf: msg.isUser ? "flex-end" : "flex-start",
      }
    );
    messageContainer.appendChild(messageBubble);
  });
}

function scrollToBottom() {
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Sambanova bilan so'rov
async function sendMessageToSambanova(userMessage) {
  const apiURL = "https://api.sambanova.ai/v1/chat/completions"; // API manzili
  const apiKey = "3e2529e6-dd6e-4974-b714-bcaa5a0b19fc"; // O'zingizning API kalitingizni bu yerga kiriting

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
        model: "Meta-Llama-3.1-8B-Instruct",
      }),
    });

    if (!response.ok) {
      throw new Error("API so‘rovda xato yuz berdi.");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Kechirasiz, API bilan bog‘lanishda muammo yuz berdi.";
  }
}

// Send message
sendButton.addEventListener("click", async () => {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  messages.push({ content: userMessage, isUser: true });
  renderMessages();
  scrollToBottom();
  inputField.value = "";

  const botReply = await sendMessageToSambanova(userMessage);
  messages.push({ content: botReply, isUser: false });
  renderMessages();
  scrollToBottom();
});

chatBox.append(chatHeader, messageContainer, inputContainer);
inputContainer.append(inputField, sendButton);
app.append(chatButton, chatBox);
document.body.appendChild(app);

renderMessages();
