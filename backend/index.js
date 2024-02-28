const express = require("express");
const cors = require("cors");
const Moralis = require("moralis").default;
require("dotenv").config();

const app = express();
const port = 3001;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());

app.get("/getNameAndBalance", async(req, res)=>{

    const {userAddress} = req.query;

    const response = await Moralis.EvmApi.utils.runContractFunction({
        chain: "0x13881",
        address: "0xAC002d53FFE64cc00b8CE9d237E2FF91085560cc",
        functionName: "getMyName",
        abi: ABI,
        params: {
            _user: userAddress
        }
    });

    const jsonResponseName = response.raw;

    const jsonResponse = {
        name: jsonResponseName
    };

    return res.status(200).json({jsonResponse});
})


Moralis.start({
    apiKey: process.env.MORALIS_KEY,
}).then(()=>{
    app.listen(port, ()=>{
        console.log("Listening for api callson ", port)
    });
});