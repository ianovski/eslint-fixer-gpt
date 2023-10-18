import { PromptObj, processMessages } from './preprocess'

const buildPrompt = (promptObj: PromptObj): string => {
  const promptQuestion = "Given the following message, ruleId, line number, and source code returned by ESLint, provide a solution for how this error could be resolved:";
  const prompt = `${promptQuestion}
    message: ${promptObj.message}
    ruleId: ${[promptObj.ruleId]}
    line number: ${promptObj.lineStart}
    source code: ${promptObj.errorFile}`;
  return prompt;
};

const fetch = async (model: string, content: string, openai: any) => {
  try{
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: content }],
      model: model,
    });
    return response;
  } catch (error: any) {
    console.error("Error: Could not reach API");
  };
};

const makeResponse = (filepath: string, lineNumber: number, columnStart: number, responseMessage: string): string => {
  const response = `
    ${filepath}
    ${lineNumber}:${columnStart}
    ${responseMessage}
  `;
  return response;
};

export const processLint = async (lintOutput: any, model: string, openai: any) => {
  const responses: string[] = [];

  for (const element of lintOutput) {
    if (element.messages.length > 0) {
      const promptObjs: PromptObj[] = processMessages(element.filePath, element.messages);
      for (const promptObj of promptObjs) {
        const prompt = buildPrompt(promptObj);
        const response = await fetch(model, prompt, openai);
        const responseMessage = response.choices[0].message.content;
        responses.push(makeResponse(promptObj.filepath, promptObj.lineStart, promptObj.columnStart, responseMessage as string));
      };
    };
  };

  return responses;
};
