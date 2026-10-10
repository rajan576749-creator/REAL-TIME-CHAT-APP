import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const registerUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/register",
        {
          username,
          email,
          password,
        }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        {
          email,
          password,
        }
      );

      alert(res.data.message);
      setIsLoggedIn(true);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      user: username,
      text: message,
    };

    socket.emit("send_message", messageData);
    setMessage("");
  };

  if (isLoggedIn) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>💬 Real Time Chat Room</h1>

        <div
          style={{
            border: "1px solid black",
            height: "300px",
            padding: "10px",
            marginBottom: "10px",
            overflowY: "auto",
            borderRadius: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.user}:</strong> {msg.text}
            </p>
          ))}
        </div>

        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            padding: "8px 15px",
          }}
        >
          Send
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Real Time Chat App</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={registerUser}>
        Register
      </button>

      <button
        onClick={loginUser}
        style={{ marginLeft: "10px" }}
      >
        Login
      </button>
    </div>
  );
}

export default App;