#! /usr/bin/env node
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { readJsonFile } from './engine/ingest'
import { processLint } from './engine/process'

const args = process.argv.slice(2);
console.log("args = ", args);
if (args.length < 2) {
  console.error('Please provide path and OPENAI API Key');
  process.exit(1);
}

dotenv.config();
const openai = new OpenAI({
  apiKey: args[1],
});

const filePath = path.resolve(args[0]);
const model = "gpt-3.5-turbo";

const eslintFixerGPT = async() => {
  const lintOutput: any = readJsonFile(filePath);
  const responses: any = await processLint(lintOutput, model, openai);
  responses.forEach((response: string) => {
    console.log("********************************************************************************************************");
    console.log(response);
  });
}

eslintFixerGPT();
