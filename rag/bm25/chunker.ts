import type { Section } from "./types";

// Seções maiores do que isso viram mais de um trecho, agrupando parágrafos inteiros.
const MAX_WORDS = 300;
const HEADING = /^(#{2,6}) (.+)$/;

type RawSection = { path: string[]; body: string[] };

// Cada título (## a ######) abre uma seção; o caminho guarda os títulos acima dele, como um breadcrumb.
// O que vem antes do primeiro ## (título e cabeçalho do arquivo) não é indexado.
function splitByHeadings(markdown: string): RawSection[] {
  const sections: RawSection[] = [{ path: [], body: [] }];
  const path: string[] = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(HEADING);
    if (!match) {
      sections.at(-1)?.body.push(line);
      continue;
    }
    path.splice((match[1] ?? "").length - 2, path.length, (match[2] ?? "").trim());
    sections.push({ path: [...path], body: [] });
  }
  return sections.slice(1);
}

function toParagraphs(body: string[]): string[] {
  return body.join("\n").split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function groupParagraphs(paragraphs: string[]): string[] {
  const groups: string[][] = [];
  let words = 0;
  for (const paragraph of paragraphs) {
    const size = countWords(paragraph);
    if (groups.length === 0 || words + size > MAX_WORDS) {
      groups.push([]);
      words = 0;
    }
    groups.at(-1)?.push(paragraph);
    words += size;
  }
  return groups.map((group) => group.join("\n\n"));
}

export function splitIntoSections(file: string, markdown: string): Section[] {
  const title = markdown.match(/^# (.+)$/m)?.[1] ?? file;
  return splitByHeadings(markdown).flatMap(({ path, body }) => {
    const heading = path.join(" › ");
    return groupParagraphs(toParagraphs(body)).map((text) => ({ file, title, heading, text }));
  });
}
