require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
var allowlist = ["http://localhost:3000"];
const corsOptions = {
  origin: allowlist,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.get("/search", async (req, res) => {
  console.log(req.originalUrl, "qqqqqqqqqqqq");

  // let jqlQuery = "project = KAN";
  let jqlQuery;
  if (req.query?.status === undefined) {
    jqlQuery = `project=KAN`;
  } else {
    jqlQuery = `project=KAN AND status='${req.query?.status}'`;
  }
  const maxResults = req.query.maxResults; // Default to 1 if not provided
  const startAt = req.query.startAt * 10; // Default to 0 if not provided

  console.log(process.env.BASE_URL, "query parameters");
  const encodedJql = encodeURIComponent(jqlQuery);

  try {
    const apiUrl = `${process.env.BASE_URL}rest/api/3/search?jql=${encodedJql}&maxResults=${maxResults}&startAt=${startAt}`;

    console.log("API URL:", apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Basic ${process.env.JIRA_API_KEY}`,
        Accept: "application/json",
      },
    });

    // Extract and log only necessary parts of the response
    console.log("Response data:", response.data);
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    // Send only the data part of the response
    res.json(response.data);
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

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
