require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes

// Define a route to handle requests to the third-party API
app.get("/*", async (req, res) => {
  console.log(req.originalUrl, "qqqqqqqqqqqq");
  const apiUrl = `https://saashutosh39.atlassian.net${req.originalUrl}`;
  try {
    console.log(apiUrl, "hellloooo");
    console.log("process.env.EMAIL", process.env.JIRA_API_KEY);

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Basic Auth ${Buffer.from(
          `${process.env.EMAIL}:${process.env.JIRA_API_KEY}`
        ).toString("base64")}`,
        Accept: "application/json",
      },
    });

    console.log(response.data, "uuuuuuuuuu");
    res.json(response);
  } catch (error) {
    console.error("Request failed", error.message);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      res.status(error.response.status).json({
        message: error.message,
        data: error.response.data,
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
