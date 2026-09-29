import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { type Request, type Response } from "express";
import { z } from "zod";

const server = new McpServer({
    name: "Random Number MCP",
    version: "1.0.0"
});

server.registerTool("get_random_number", {
    description: "Utilize essa ferramenta quando precisar gerar números randômicos aleatórios"
}, async () => {
    const output = Math.floor(Math.random() * 1000);
    console.log("get_random_number", new Date(), output);
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
    description: "Utilize essa ferramenta quando precisar gerar números randômicos aleatórios limitados",
    inputSchema: {
        limit: z.number().optional().describe("Representa o limite máximo do número aleatório")
    }
}, async ({ limit }) => {
    const output = Math.floor(Math.random() * (limit || 10));
    console.log("get_random_number_limit", new Date(), output);
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
