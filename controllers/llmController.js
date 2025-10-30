// Using Node.js built-in fetch (available in Node 18+)

const summarizeTranscript = async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  try {
    const prompt = `Please summarize the following medical consultation transcript into key instructions and follow-up actions:\n\n${transcript}`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.json({
      summary: data.response,
      originalLength: transcript.length,
      summaryLength: data.response.length
    });

  } catch (error) {
    console.error('LLM summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize transcript' });
  }
};

const generateResponse = async (req, res) => {
  const { prompt, model = "llama3.2" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.json({
      response: data.response,
      model: model
    });

  } catch (error) {
    console.error('LLM generation error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
};

module.exports = {
  summarizeTranscript,
  generateResponse
};