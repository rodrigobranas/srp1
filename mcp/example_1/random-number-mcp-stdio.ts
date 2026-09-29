import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
    name: "Random Number MCP",
    version: "1.0.0"
});

server.registerTool("get_random_number", {
    description: "Utilize essa ferramenta quando precisar gerar números randômicos aleatórios"
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

const transport = new StdioServerTransport();
await server.connect(transport);
