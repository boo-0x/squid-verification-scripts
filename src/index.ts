import "dotenv/config";
import { VerifiedContract, VerifiedInSquid } from "./types";
import { fetchVerifiedContracts } from "./graphQL";
import fs from "fs";
import { verifyContract } from "./api";

const NETWORK = process.env.NETWORK;
if (NETWORK !== "mainnet" && NETWORK !== "testnet")
  throw new Error("Network not set in environment.");
export const SQUID_URI = process.env[`SQUID_URI_${NETWORK.toUpperCase()}`];
export const VERIFICATION_API =
  process.env[`VERIFICATION_API_${NETWORK.toUpperCase()}`];
export const QUERY_LIMIT = Number(process.env.QUERY_LIMIT) || 500;
console.log(`
  Network: ${NETWORK}
  Squid URI: ${SQUID_URI}
  Verification API: ${VERIFICATION_API}
  Query limit: ${QUERY_LIMIT}
`);

const verifyContracts = async (
  contracts: VerifiedContract[],
  verifiedInSquid: VerifiedInSquid[]
) => {
  const notVerifiedInSquid = contracts.filter(
    (contract: VerifiedContract) =>
      !verifiedInSquid.find((c) => c.id === contract.address)
  );
  console.log(`Verified contracts not in Squid: ${notVerifiedInSquid.length}`);

  let count = 0;
  for (const contract of notVerifiedInSquid) {
    count++;
    console.log(
      `Verifying ${contract.address} [${count}/${notVerifiedInSquid.length}]`
    );
    await verifyContract(contract);
  }
};

const main = async () => {
  const verifiedInSquid: VerifiedInSquid[] = await fetchVerifiedContracts();
  console.log(`Verified contracts in Squid: ${verifiedInSquid.length}`);

  let fileExists = true;
  let fileIndex = 1;
  while (fileExists) {
    const fileName = `src/data/verified_${NETWORK.toLowerCase()}_${String(
      fileIndex
    ).padStart(2, "0")}.json`;
    if (fs.existsSync(fileName)) {
      console.log(`Batch ${fileIndex}`);
      const file = fs.readFileSync(fileName, "utf8");
      const contractBatch: VerifiedContract[] = JSON.parse(file);
      await verifyContracts(contractBatch, verifiedInSquid);
      fileIndex++;
    } else {
      fileExists = false;
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
