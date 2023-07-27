import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request){
  try {
    const codeData = await request.json()

    const prompt = generatePromptFromData(codeData);
    const url = "https://api.openai.com/v1/chat/completions";
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a web development instructor for a software engineering bootcamp.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    const responseData = await response.json();
    const content = responseData.choices[0]?.message?.content;
    return Response.json(content || "");
  } catch (error) {
    return Response.json(`Error fetching data: ${error.message}`);
  }
};

function generatePromptFromData(codeData) {
  const { css, js, html, question } = codeData;
  const codeSnippet = `
  <html>
      <head>
          <style>${css}</style>
      </head>
      <body>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          ${html}
          <script type="text/jsx">${js}</script>
      </body>
  </html>
  `
  // Generate the complete prompt with system messages
  const prompt = ` Provide answers related to different languages don't mention any problems that have to do with babel or the included script tags. Don't mention any missing libraries as those are either intention or mistakes on our end that the student doesn't need to focus on. The student wants to know: "${question}"\n\nHere's the CSS code snippet they provided:\n\n${css}\n\nHere's the HTML code snippet they provided:\n\n${html}\n\n Here's the JavaScript code snippet they provided:\n\n${js}\n. The code is being ran in a iframe because it is in a web development playground. the student only wrote the javascript, css, and html mentioned before. Here is the entire code snippet running in the iframe ${codeSnippet}`;

  return prompt;
}