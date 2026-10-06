import * as readline from "node:readline/promises";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

let model = "openai/gpt-6-luna"; // deepseek/deepseek-v4-flash
let reasoning = "medium";
let log = "";
let instructions = await readFile(new URL("./AGENTS.md", import.meta.url), "utf8");

const tools = [
    {
        type: "function",
        name: "bash",
        description: "Executa comandos bash para listar, ler e escrever arquivos",
        parameters: {
            type: "object",
            properties: {
                command: { type: "string" }
            },
            required: ["command"],
            additionalProperties: false
        }
    }
];

async function callLLM (input: any[]) {
    while (true) {
        // console.log(input);
        const response = await fetch("https://openrouter.ai/api/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`
            },
            body: JSON.stringify({
                model,
                reasoning: {
                    effort: reasoning,
                    summary: "detailed"
                },
                input,
                tools
            })
        });
        const jsonResponse: any = await response.json();

        log = JSON.stringify(jsonResponse, undefined, "  ");
        // console.log(log);

        const call = jsonResponse.output.find((element: any) => element.type === "function_call");

        if (!call) {
            const outputElement = jsonResponse.output.find((element: any) => element.type === "message");
            const outputText = outputElement.content.find((element: any) => element.type === "output_text").text;
            return outputText;
        }

        input.push(call);

        const { command } = JSON.parse(call.arguments);

        let result;

        try {
            console.log("Calling: ", command);
            result = execFileSync("bash", ["-lc", command], {
                cwd: process.cwd(),
                encoding: "utf8"
            });
        } catch (error) {
            console.log(error);
        }

        input.push({
            type: "function_call_output",
            call_id: call.call_id,
            output: result
        });
    }
}

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let context: any = [];

function init () {
    context = [];
    context.push({ role: "system", content: "Você é um agente especializado em programação. Seu foco é tirar dúvidas e resolver problemas sobre desenvolvimento de software. Não responda nada fora deste assunto. Peça educadamente ao usuário para fazer perguntas sobre este assunto." });
    context.push({ role: "system", content: instructions });
}

async function compact () {
    const input: any = [
        { role: "system", content: "Resuma a conversa para manter o contexto. Retorne apenas o resumo" },
        ...context.slice(1)
    ];
    const output = await callLLM(input);
    init();
    context.push({ role: "assistant", content: output });
}

init();

while (true) {
    const input = await readlineInterface.question("> ");
    if (input === "/exit") {
        break;
    }
    if (input === "/clear") {
        init();
        console.clear();
        continue;
    }
    if (input === "/log") {
        console.log(log);
        continue;
    }
    if (input === "/context") {
        console.log(context);
        continue;
    }
    if (input.startsWith("/model")) {
        console.log("Modelo atual: ", model);
        const newModel = input.replace("/model", "").trim();
        if (newModel) {
            console.log("Modelo novo: ", newModel);
            model = newModel;
        }
        continue;
    }
    if (input.startsWith("/reasoning")) {
        console.log("Reasoning atual: ", reasoning);
        const newReasoning = input.replace("/reasoning", "").trim();
        if (newReasoning) {
            console.log("Reasoning novo: ", newReasoning);
            reasoning = newReasoning
        }
        continue;
    }
    if (input === "/compact") {
        await compact();
        continue;
    }
    context.push({ role: "user", content: input });
    const output = await callLLM(context);
    context.push({ role: "assistant", content: output });
    console.log(output);
}

readlineInterface.close();
