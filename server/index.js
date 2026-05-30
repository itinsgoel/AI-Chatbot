require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { messages, system } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: system || 'You are a helpful assistant.' },
        ...messages
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.log('ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('✅ Server chal raha hai: http://localhost:3001'));