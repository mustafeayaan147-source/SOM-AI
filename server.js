const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Fariin ma jirto."
      });
    }

    const apiKey = process.env.NIMCO_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "NIMCO_API_KEY lagama helin Render."
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are SomAI, a helpful AI assistant. Answer Somali questions in Somali and English questions in English."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.error?.message || "Groq API error"
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "AI jawaab ma soo celin."
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`SomAI server running on port ${PORT}`);
});
