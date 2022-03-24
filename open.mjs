import alfy from "alfy";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import open from "open";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const query = alfy.input;

const token = alfy.config.get("token");

// get email html content
const { data } = await axios.get(`https://api.mail.tm/messages/${query}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// write html content to file
const html = data.html[0];

await fs.writeFile(path.join(__dirname, "email.html"), html, "utf8");

// email.html file path
const filePath = path.join(__dirname, "email.html");

await open(filePath);
