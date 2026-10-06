import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const directory = dirname(fileURLToPath(import.meta.url));
const helloWorldPath = join(directory, 'helloWorld.js');

test('helloWorld.js executa e imprime a mensagem esperada', () => {
  const output = execFileSync(process.execPath, [helloWorldPath], {
    encoding: 'utf8',
  });

  assert.equal(output, 'Hello World\n');
});
