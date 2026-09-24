import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "Random number mcp",
    version: "1.0.0"
});

server.registerTool("get_random_number", {
    description: "Utilize quando for gerar um número randômico"
}, async () => {
    const output = Math.floor(Math.random() * 1000);
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
    return {
        content: [
            {
                type: "text",
                text: `Random number: ${output}`
            }
        ]
    }
});

const transport = new StdioServerTransport();
await server.connect(transport);
