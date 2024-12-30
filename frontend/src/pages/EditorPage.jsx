import React from "react";
import Editor from "@monaco-editor/react";

function EditorPage({
  roomId,
  copyRoomId,
  copySuccess,
  users,
  typing,
  language,
  handleLanguageChange,
  code,
  handleCodeChange,
  leaveRoom,
  runCode,
  outPut,
  loading,
  setLoading
}) {
  return (
    <div className="editor-container">
        <div className="sidebar">
          <div className="room-info">
            <h2>{roomId}</h2>
            <button onClick={copyRoomId} className="copy-button">
              Copy Room Id
            </button>
            {copySuccess && <span className="copy-success">{copySuccess}</span>}
          </div>
          <h3>Users in Room:</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user.slice(0, 8)}...</li>
            ))}
          </ul>
          <p className="typing-indicator">{typing}</p>
          <select
            className="language-selector"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        <button className="leave-button" onClick={leaveRoom}>
          Leave Room
        </button>
      </div>

      <div className="editor-wrapper">
        <Editor
          height={"60%"}
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
        <button className="run-btn" onClick={runCode}>
          Execute
        </button>
        <textarea
          className="output-console"
          value={outPut}
          readOnly
          placeholder={loading ? "Running code..." : "Output will appear here..."}
        />
      </div>
    </div>
  );
}

export default EditorPage;
