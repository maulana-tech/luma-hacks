const solc = require("solc");
const fs = require("fs");
const path = require("path");

const CONTRACTS_DIR = __dirname;
const ABI_DIR = path.join(CONTRACTS_DIR, "abis");

if (!fs.existsSync(ABI_DIR)) {
  fs.mkdirSync(ABI_DIR, { recursive: true });
}

const solFiles = fs
  .readdirSync(CONTRACTS_DIR)
  .filter((f) => f.endsWith(".sol"))
  .sort();

if (solFiles.length === 0) {
  console.error("No .sol files found in contracts/");
  process.exit(1);
}

const sources = {};
for (const file of solFiles) {
  const full = path.join(CONTRACTS_DIR, file);
  sources[file] = { content: fs.readFileSync(full, "utf8") };
}

const input = {
  language: "Solidity",
  sources,
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object", "evm.bytecode.sourceMap"],
      },
    },
    optimizer: { enabled: true, runs: 200 },
  },
};

console.log(`Compiling: ${solFiles.join(", ")}`);

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  for (const err of output.errors) {
    if (err.severity === "error") {
      console.error("Compilation error:", err.formattedMessage);
      process.exit(1);
    } else {
      console.warn("Warning:", err.formattedMessage);
    }
  }
}

const compiled = output.contracts || {};

let written = 0;

for (const sourceName of Object.keys(compiled)) {
  const sourceContracts = compiled[sourceName] || {};
  for (const contractName of Object.keys(sourceContracts)) {
    const contract = sourceContracts[contractName];
    if (!contract?.abi || !contract?.evm?.bytecode?.object) continue;

    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    const abiOut = path.join(ABI_DIR, `${contractName}.json`);
    const artifactOut = path.join(CONTRACTS_DIR, `${contractName}.json`);

    fs.writeFileSync(abiOut, JSON.stringify(abi, null, 2));
    fs.writeFileSync(artifactOut, JSON.stringify({ abi, bytecode }, null, 2));

    console.log(`- ${contractName}: ABI ${abi.length} entries, bytecode ${bytecode.length} chars`);
    console.log(`  ABI: ${path.relative(process.cwd(), abiOut)}`);
    console.log(`  Artifact: ${path.relative(process.cwd(), artifactOut)}`);
    written += 1;
  }
}

if (written === 0) {
  console.error("No contracts emitted. Check solc output.");
  process.exit(1);
}

console.log("\nDone.");
