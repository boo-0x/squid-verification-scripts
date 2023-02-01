import axios from "axios";
import { VERIFICATION_API } from ".";
import { VerifiedContract } from "./types";

// Old explorer version did not have a license field
const getLicense = (contract: VerifiedContract) => {
  const sourceMain = contract.source[contract.filename];
  const licenseRegex =
    /SPDX-License-Identifier:\s*(unlicense|MIT|GNU GPLv2|GNU GPLv3|GNU LGPLv2.1|GNU LGPLv3|BSD-2-Clause|BSD-3-Clause|MPL-2.0|OSL-3.0|Apache-2.0|GNU AGPLv3)/i;
  const match = sourceMain.match(licenseRegex);
  return match ? match[1] : "none";
};

export const verifyContract = async (contract: VerifiedContract) => {
  const payload = {
    address: contract.address,
    arguments: JSON.stringify(contract.args),
    compilerVersion: contract.compiler_version,
    filename: contract.filename,
    license: getLicense(contract),
    name: contract.name,
    optimization: String(contract.optimization),
    runs: contract.runs,
    source: JSON.stringify(contract.source),
    target: contract.target,
  };
  const response = await axios.post(VERIFICATION_API!, payload);
  return response.data;
};
