import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🚀 CarbonChain API Tests\n');
console.log('=' .repeat(50));

const tests = [
  { name: 'CAD Trust', file: 'test-cad-trust.js' },
  { name: 'Verra Registry', file: 'test-verra.js' },
  { name: 'Gold Standard', file: 'test-goldstandard.js' }
];

for (const test of tests) {
  console.log(`\n📊 Running: ${test.name}`);
  console.log('-'.repeat(50));
  
  try {
    const { stdout, stderr } = await execAsync(`node tests/${test.file}`);
    console.log(stdout);
    if (stderr) console.error('Errors:', stderr);
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
  }
  
  console.log('\n');
}

console.log('=' .repeat(50));
console.log('✅ All tests completed!\n');
