import fs from "fs";
import path from "path";

export type ErrorSource = {
  errorLine: string;
  errorSubstring: string;
  errorFile: string;
};

export type MessageObj = {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  messageId: string;
  endLine: number;
  endColumn: number;
}

export type PromptObj = {
  filepath: string;
  message: string;
  ruleId: string;
  severity: number;
  lineStart: number;
  columnStart: number;
  lineEnd: number;
  columnEnd: number;
  errorLine: string;
  errorSubstring: string;
  errorFile: string
};

const parseError = (
  filename: string,
  lineStart: number,
  colStart: number,
  lineEnd: number,
  colEnd: number
): ErrorSource => {
  try {
    const filepath = path.resolve(__dirname, filename);
    const fileContent = fs.readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n");
    if (
      lineStart <= 0 ||
      lineStart > lines.length ||
      lineEnd <= 0 ||
      lineEnd > lines.length
    ) {
      throw new Error("Invalid line numbers");
    }

    const startLine = lines[lineStart - 1];
    const endLine = lines[lineEnd - 1];

    if (
      colStart < 0 ||
      colStart > startLine.length ||
      colEnd < 0 ||
      colEnd > endLine.length
    ) {
      throw new Error("Invalid column numbers");
    }
    const errorLine = lines.slice(lineStart - 1, lineEnd).join("\n");
    const errorSubstring = errorLine.substring(colStart - 1, colEnd);
    const errorSource: ErrorSource = {
      errorLine: errorLine,
      errorSubstring: errorSubstring,
      errorFile: fileContent,
    };
    return errorSource;
  } catch (error: any) {
    console.error("Error:", error.message);
    return { errorLine: "", errorSubstring: "", errorFile: "" };
  }
};

const makePromptObj = ( filepath: string, errorSource: ErrorSource, message: MessageObj ): PromptObj => {
  const prompt: PromptObj = {
      filepath: filepath,
      message: message.message,
      ruleId: message.ruleId,
      severity: message.severity,
      lineStart: message.line,
      columnStart: message.column,
      lineEnd: message.endLine,
      columnEnd: message.endColumn,
      errorLine: errorSource.errorLine,
      errorSubstring: errorSource.errorSubstring,
      errorFile: errorSource.errorFile,
  };
  return prompt;
}

export const processMessages = (filepath: string, messages: MessageObj[]): PromptObj[] => {
  const promptObjs: PromptObj[] = [];
  messages.forEach((message: MessageObj) => {
      const errorSource = parseError(
        filepath,
        message.line,
        message.column,
        message.endLine,
        message.endColumn
      );
      const prompt = makePromptObj(filepath, errorSource, message)
      promptObjs.push(prompt);
    }
  )
  return promptObjs;
};
