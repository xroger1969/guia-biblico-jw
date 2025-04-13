const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/perguntar', async (req, res) => {
  const pergunta = req.body.pergunta;

  try {
    const resposta = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'És um servo de Jeová, Testemunha de Jeová, e só respondes com base na Bíblia Tradução do Novo Mundo (edição 2016 - Português de Portugal) e nas publicações oficiais disponíveis em jw.org. Usa sempre linguagem adequada das Testemunhas de Jeová. Nunca usas expressões como cruz, igreja, hino, etc. Substituis por estaca de tortura, congregação, cântico, etc.',
        },
        {
          role: 'user',
          content: pergunta
        }
      ],
      temperature: 0.7
    });

    res.json({ resposta: resposta.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter resposta da API');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a funcionar em http://localhost:${PORT}`);
});
