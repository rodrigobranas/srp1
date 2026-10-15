// Palavras muito frequentes que não ajudam a diferenciar um trecho do outro (já sem acento).
const STOPWORDS = new Set([
  "a", "o", "as", "os", "ao", "aos", "um", "uma", "uns", "umas", "de", "do", "da", "dos", "das",
  "em", "no", "na", "nos", "nas", "num", "numa", "por", "pelo", "pela", "pelos", "pelas", "para",
  "pra", "com", "sem", "sob", "entre", "ate", "e", "ou", "mas", "nem", "que", "se", "como",
  "quando", "onde", "qual", "quais", "quem", "este", "esta", "estes", "estas", "esse", "essa",
  "esses", "essas", "isso", "isto", "aquele", "aquela", "aquilo", "ele", "ela", "eles", "elas",
  "seu", "sua", "seus", "suas", "lhe", "lhes", "me", "te", "nao", "sim", "mais", "menos", "muito",
  "muita", "muitos", "muitas", "ja", "tambem", "so", "ser", "sao", "foi", "era", "sera", "estar",
  "estao", "ter", "tem", "ha", "pode", "podem", "deve", "devem", "outro", "outra", "outros",
  "outras", "cada", "todo", "toda", "todos", "todas", "mesmo", "ainda", "apenas", "assim",
  "entao", "sobre", "apos", "antes", "depois",
]);

// Regras simples de plural em português, para "medicamentos" e "medicamento" virarem o mesmo termo.
const PLURAL_RULES: [RegExp, string][] = [
  [/oes$/, "ao"],
  [/ais$/, "al"],
  [/eis$/, "el"],
  [/ns$/, "m"],
  [/res$/, "r"],
  [/s$/, ""],
];

// Minúsculas e sem acento: "Pressão" e "pressao" passam a ser o mesmo termo.
function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function singularize(token: string): string {
  if (token.length <= 3) return token;
  const rule = PLURAL_RULES.find(([pattern]) => pattern.test(token));
  return rule ? token.replace(rule[0], rule[1]) : token;
}

// O mesmo tokenizador é usado para indexar e para buscar; se forem diferentes, os termos não batem.
export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(singularize);
}
