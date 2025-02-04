import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-hot-toast";
import logo from "../assets/logo.png";

function HomePage({ socket, roomId, setRoomId, userName, setUserName }) {
  const navigate = useNavigate();
  
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("New Room Created");
  };

  const joinRoom = () => {
    if (roomId == "" || userName == "") {
      toast.error("Valid Room ID and Username required");
      return;
    }
    socket.emit("join", { roomId, userName });
    toast.success("Joined the room");
    navigate("/editor");
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="logoWrapper">
          <div className="logoContainer">
            <img className="homePageLogo" src={logo} alt="code-sync-logo" />
            <h3>CodeBytes</h3>
          </div>
          <h3>Real-time code collaboration platform</h3>
        </div>
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
