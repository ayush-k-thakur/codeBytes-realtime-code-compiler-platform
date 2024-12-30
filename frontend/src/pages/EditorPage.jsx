import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function EditorPage({ socket, roomId, setRoomId, setUserName, users }) {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("javascript");
  const [typing, setTyping] = useState("");
  const [outPut, setOutPut] = useState("");
  const [code, setCode] = useState("// start code here");
  const version = "*";

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
    navigate("/");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard");
  };

  const runCode = async () => {
    setOutPut("Running Code...");
    await socket.emit("compileCode", { code, roomId, language, version });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    console.log(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "code.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)}... is Typing`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", (newLanguage) => {
      setLanguage(newLanguage);
    });

    socket.on("codeResponse", (response) => {
      setOutPut(response.run.output);
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
    };
  }, []);

  return (
    <div className="editor-container">
      <div className="sidebar">
        <div className="room-info">
          <h2>{roomId}</h2>
          <button onClick={copyRoomId} className="copy-button">
            Copy Room Id
          </button>
        </div>
        <h3>Users in Room:</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
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
        <button className="download-btn" onClick={handleDownloadCode}>
          Download Code
        </button>
        <textarea
          className="output-console"
          value={outPut}
          readOnly
          placeholder="Output will appear here..."
        />
      </div>
    </div>
  );
}

export default EditorPage;
