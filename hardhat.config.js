require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {//"0.8.24"
  solidity: "0.8.9",
  networks:{
    mumbai:{
      url: process.env.POLYGON_MUMBI,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan:{
    apiKey: process.env.API_KEY,
  }
};
