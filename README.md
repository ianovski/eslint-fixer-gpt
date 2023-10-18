# ESLINT Fixer GPT
This README provides guidance on installing and using the ESLINT Fixer GPT tool. This tool is used to provide additional insight into how to fix errors caught by ESLint.

## Install Dependencies Globally
To install the necessary dependencies globally, use the following command:
```
npm i -g
```

## Build the Package
To build the package, use the following command:
```
npm run build
```

## Update package.json in the Target Repo
Update the `package.json` file in the target repository that will utilize this tool. A script demonstrating how the tool can be used is shown below:
### Example `scripts` in package.json:
```
"scripts": {
    "fixer": "eslint-fixer-gpt ./eslint-output.json ${OPENAI_API_KEY}",
    "lint": "npx eslint -f json --o eslint-output.json",
    "lint:fixer": "(npm run lint) || npm run fixer"
  }
```
Make sure to replace ${OPENAI_API_KEY} with your actual OpenAI API key for the fixer script to function properly.

## Run the Tool
To run the tool and perform linting and fixing, execute the following command:
```
npm run lint:fixer
```
