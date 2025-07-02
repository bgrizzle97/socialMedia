import React, { useState } from 'react';

const AIAgentExperiment = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [agentCard, setAgentCard] = useState(null);
  const [taskType, setTaskType] = useState("echo");
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [openAIApiKey, setOpenAIApiKey] = useState("");
  
  const fetchAgentCard = async () => {
    setStatus("Fetching agent card...");
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/posts/a2a/agent-card');
      const data = await response.json();
      setAgentCard(data);
      setStatus(null);
    } catch (err) {
      setError('Error fetching agent card.');
      setStatus(null);
    }
  };

  const handleTest = async () => {
    setStatus("Sending task...");
    setError(null);
    let task;
    if (taskType === 'custom') {
      try {
        task = JSON.parse(input);
      } catch (e) {
        setError('Invalid JSON for custom task.');
        setStatus(null);
        return;
      }
    } else {
      task = { type: taskType, content: input };
    }
    setHistory(h => [...h, { task, direction: 'sent', timestamp: new Date() }]);
    try {
      const response = await fetch('http://localhost:5000/api/posts/a2a/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, openAIApiKey: taskType === 'openai' ? openAIApiKey : undefined }),
      });
      const data = await response.json();
      setResult(data.artifact?.message || JSON.stringify(data));
      setHistory(h => [...h, { response: data, direction: 'received', timestamp: new Date() }]);
      setInput("");
      setStatus("Task completed.");
    } catch (err) {
      setError('Error connecting to agent endpoint.');
      setStatus(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">AI Agent Experiment</h2>
      <p className="mb-4">Try out experimental agent-to-agent features here.</p>
      <div className="mb-4 flex flex-col md:flex-row md:items-end gap-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mb-2 md:mb-0"
          onClick={fetchAgentCard}
        >
          Fetch Agent Card
        </button>
        <select
          className="border border-gray-300 rounded p-2 text-black"
          value={taskType}
          onChange={e => setTaskType(e.target.value)}
        >
          <option value="echo">Echo</option>
          <option value="reverse">Reverse</option>
          <option value="uppercase">Uppercase</option>
          <option value="length">Length</option>
          <option value="openai">OpenAI (ChatGPT)</option>
          <option value="custom">Custom</option>
        </select>
        <textarea
          className="w-full p-2 border border-gray-300 rounded text-black"
          rows={3}
          placeholder={taskType === 'custom' ? 'Enter raw JSON for the task object' : `Type your agent message here... (${taskType} task)`}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleTest}
          disabled={!input.trim() || (taskType === 'openai' && !openAIApiKey.trim())}
        >
          Send Task
        </button>
      </div>
      {taskType === 'openai' && (
        <div className="mb-4">
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded text-black mb-1"
            placeholder="Enter your OpenAI API key (sk-...)"
            value={openAIApiKey}
            onChange={e => setOpenAIApiKey(e.target.value)}
          />
          <div className="text-xs text-gray-500">Your API key is only used for this session and is never stored on the server.</div>
        </div>
      )}
      {status && <div className="mb-2 text-blue-700">{status}</div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {agentCard && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-black">
          <div className="font-semibold">Agent Card:</div>
          <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(agentCard, null, 2)}</pre>
        </div>
      )}
      {result && <div className="mb-4 p-2 bg-gray-100 rounded text-black">{result}</div>}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Task History</h3>
        <div className="bg-gray-900 rounded p-3 text-white text-xs max-h-60 overflow-y-auto">
          {history.length === 0 && <div className="text-gray-400">No tasks yet.</div>}
          {history.map((item, idx) => (
            <div key={idx} className="mb-2">
              {item.direction === 'sent' ? (
                <div>
                  <span className="text-green-400">[Sent]</span> <span className="text-gray-400">{item.timestamp.toLocaleString()}</span>
                  <pre className="bg-gray-800 rounded p-2 mt-1">{JSON.stringify(item.task, null, 2)}</pre>
                </div>
              ) : (
                <div>
                  <span className="text-blue-400">[Received]</span> <span className="text-gray-400">{item.timestamp.toLocaleString()}</span>
                  <pre className="bg-gray-800 rounded p-2 mt-1">{JSON.stringify(item.response, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAgentExperiment; 