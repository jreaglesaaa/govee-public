const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// Your Govee info
const API_KEY = "0466a610-400a-49df-9fac-8cded79fee31";
const DEVICE_MAC = "D4:AD:FC:7A:53:86";
const DEVICE_MODEL = "H6008";

// Toggle ON/OFF
app.post("/toggle", async (req, res) => {
  const { state } = req.body;
  const body = {
    requestId: Date.now().toString(),
    payload: {
      device: DEVICE_MAC,
      model: DEVICE_MODEL,
      cmd: { name: "turn", value: state }
    }
  };
  try {
    const response = await fetch("https://developer-api.govee.com/v1/devices/control", {
      method: "POST",
      headers: {
        "Govee-API-Key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error sending command");
  }
});

// Set RGB color
app.post("/color", async (req, res) => {
  const { r, g, b } = req.body;
  const body = {
    requestId: Date.now().toString(),
    payload: {
      device: DEVICE_MAC,
      model: DEVICE_MODEL,
      cmd: { name: "color", value: { r, g, b } }
    }
  };
  try {
    const response = await fetch("https://developer-api.govee.com/v1/devices/control", {
      method: "POST",
      headers: {
        "Govee-API-Key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error sending color");
  }
});

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
