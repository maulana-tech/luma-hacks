const solc = require("solc");
const fs = require("fs");
const path = require("path");

const CONTRACT_PATH = path.join(__dirname, "AgentRegistry.sol");
const ABI_OUT = path.join(__dirname, "abis", "AgentRegistry.json");
const ARTIFACT_OUT = path.join(__dirname, "AgentRegistry.json");

const source = fs.readFileSync(CONTRACT_PATH, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "AgentRegistry.sol": { content: source },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object", "evm.bytecode.sourceMap"],
      },
    },
    optimizer: { enabled: true, runs: 200 },
  },
};

console.log("Compiling AgentRegistry.sol...");

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

const contract = output.contracts["AgentRegistry.sol"]["AgentRegistry"];
if (!contract) {
  console.error("Contract not found in output");
  process.exit(1);
}

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

console.log(`ABI: ${abi.length} entries`);
console.log(`Bytecode: ${bytecode.length} characters`);

fs.writeFileSync(ABI_OUT, JSON.stringify(abi, null, 2));
console.log(`ABI saved to ${ABI_OUT}`);

fs.writeFileSync(ARTIFACT_OUT, JSON.stringify({ abi, bytecode }, null, 2));
console.log(`Artifact saved to ${ARTIFACT_OUT}`);

console.log("\nDone.");
