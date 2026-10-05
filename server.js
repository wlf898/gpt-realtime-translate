import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/session", async (req, res) => {
  try {

    const targetLanguage =
      req.body.targetLanguage || "zh";

    const response = await fetch(
      "https://api.openai.com/v1/realtime/translations/client_secrets",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          session: {
            model: "gpt-realtime-translate",

            audio: {
              input: {
                transcription: {
                  model: "gpt-realtime-whisper"
                },

                noise_reduction: {
                  type: "near_field"
                }
              },

              output: {
                language: targetLanguage
              }
            }
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return res
        .status(response.status)
        .json(data);
    }

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "服务器请求失败"
    });

  }
});


app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});


const PORT =
  process.env.PORT || 3000;


app.listen(PORT, "0.0.0.0", () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
