import { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import './App.css'
import logo from "./assets/logo.png";
import CurrentBalance from "./components/CurrentBalance";
import RequestAndPay from "./components/RequestAndPay";
import AccountDetails from "./components/AccountDetails";
import RecentActivity from "./components/RecentActivity";
import ABI from "./abi.json";

const contract = '0xC1415aC3C869eCE78d4077825c36D7Bb9ff383CD';

import { useAccountEffect, useAccount, useDisconnect, useConnect, useReadContract, useBalance } from 'wagmi'

const { Header, Content } = Layout;

function App() {
  const { address } = useAccount()
  const { isConnected } = useAccount() 
  const { disconnect } = useDisconnect()

  useAccountEffect({ 
    onConnect(data) {
      console.log('connected', data)
    },
    onDisconnect() {
      console.log('disconnected')
      disconnectAndSetNull()
    },
  })

  const { connectors, connect } = useConnect()
  const [connector] = useState(connectors[1])

  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState();

  function disconnectAndSetNull() {
    //disconnect();
    setName("...");
    setBalance("...");
    setDollars("...");
    setHistory(null);
    setRequests({ "1": [0], "0": [] });
  }

  function systematic(arr) {
    const dataArray = arr.map((transaction, index) => ({
      key: (arr.length + 1 - index).toString(),
      type: transaction.action,
      amount: parseInt(transaction.amount),
      message: transaction.message,
      address: transaction.otherPartyAddress,
      subject: transaction.otherPartyName,
    }));
  
    return dataArray.reverse();
}

  const resultName =  useReadContract({
    abi: ABI,
    address: contract,
    functionName: 'getMyName',
    args: [String(address)],
  })

  const resultHistory =  useReadContract({
    abi: ABI,
    address: contract,
    functionName: 'getMyHistory',
    args: [String(address)],
  })

  const resultRequests = useReadContract({
    abi: ABI,
    address: contract,
    functionName: 'getMyRequests',
    args: [String(address)],
  })

  const getBalance = useBalance({
    address: String(address),
    token: '0x0000000000000000000000000000000000001010', 
  })

  async function getNameAndBalance() {

    await setName(resultName.data.name)
    await setHistory(systematic(resultHistory.data))
    await setRequests(resultRequests.data)
    await setBalance(Number(Number(getBalance.data.value)/1e18).toFixed(2))
    await setDollars(Number(Number(getBalance.data.value)/1e18).toFixed(2)) // to multiplie matic token price

  }
  
  useEffect(() => {
    if(resultName.isSuccess){
      getNameAndBalance()
    }
  }, [resultName.isSuccess]);


  return (
    <div className="App">
      <Layout>
        <Header className="header">
          <div className="headerLeft">
            <img src={logo} alt="logo" className="logo" />
            {isConnected && (
              <>
                <div
                  className="menuOption"
                  style={{ borderBottom: "1.5px solid black" }}
                >
                  Summary
                </div>
                <div className="menuOption">Activity</div>
                <div className="menuOption">{`Send & Request`}</div>
                <div className="menuOption">Wallet</div>
                <div className="menuOption">Help</div>
              </>
            )}
          </div>
          {isConnected ? (
            <Button type={"primary"} onClick={()=>disconnect()}>
              Disconnect Wallet
            </Button>
          ) : (
            <Button type={"primary"} onClick={() => connect({ connector })}>
              Connect Wallet
            </Button>
          )}
        </Header>
        <Content className="content">
          {isConnected ? (
            <>
              <div className="firstColumn">
                <CurrentBalance dollars={dollars} />
                
                <RequestAndPay contract={contract} requests={requests} getNameAndBalance={getNameAndBalance}/>
                
                <AccountDetails
                  address={address}
                  name={name}
                  balance={balance}
                  contract={contract}
                />
              </div>
              <div className="secondColumn">
                <RecentActivity history={history} />
              </div>
            </>
          ) : (
            <div>Please Login</div>
          )}
        </Content>
      </Layout>
    </div>
  )
}

export default App