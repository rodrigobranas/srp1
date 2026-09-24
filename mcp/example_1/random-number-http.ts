import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { type Request, type Response } from "express";
import { z } from "zod";

const server = new McpServer({
    name: "Random number mcp",
    version: "1.0.0"
});

server.registerTool("get_random_number", {
    description: "Utilize quando for gerar um número randômico"
}, async () => {
    const output = Math.floor(Math.random() * 1000);
    console.log(new Date(), "get_random_number", output);
    return {
        content: [
            {
                type: "text",
                text: `Random number: ${output}`
            }
        ]
    }
});

server.registerTool("get_random_number_limit", {
    description: "Utilize quando for gerar um número randômico que tem um limite máximo de tamanho",
    inputSchema: {
        limit: z.number().optional().describe("limite do número desejado")
    }
}, async ({ limit }) => {
    const output = Math.floor(Math.random() * (limit || 10));
    console.log(new Date(), "get_random_number_limit", output);
    return {
        content: [
            {
                type: "text",
                text: `Random number: ${output}`
            }
        ]
    }
});

const app = express();
app.use(express.json());

app.post("/mcp", async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
