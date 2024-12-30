import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import io from "socket.io-client";
import { Toaster } from "react-hot-toast";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";

const socket = io("http://localhost:5000");

const App = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    return () => {
      socket.off("userJoined");
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("leaveRoom");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <Router>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                socket={socket}
                roomId={roomId}
                setRoomId={setRoomId}
                userName={userName}
                setUserName={setUserName}
              />
            }
          />
          <Route
            path="/editor"
            element={
              <EditorPage
                socket={socket}
                roomId={roomId}
                setRoomId={setRoomId}
                setUserName={setUserName}
                users={users}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
