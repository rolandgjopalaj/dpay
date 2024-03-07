import React, { useEffect, useState } from "react";
import { Modal, Input, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import matic from "../assets/matic.png";
import ABI from "../abi.json";

import { useWriteContract, useWaitForTransactionReceipt } from  "wagmi";

function AccountDetails({ address, name, balance, contract }) {

  const [newName, setNewName] = useState("")
  const [nameModal, setNameModal] = useState(false)

  const { data: hash, writeContract } = useWriteContract() 
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash, }) 

  async function addName() { 
    writeContract({
      address: contract,
      abi: ABI,
      functionName: 'addName',
      args: [newName],
    })
  }
  
  useEffect(()=>{
    if(isConfirmed){
      setNameModal(false)
    }
  }, [isConfirmed])

  return (
    <>
    <Card title="Account Details" style={{ width: "100%" }}>
      <div className="accountDetailRow">
        <UserOutlined style={{ color: "#767676", fontSize: "25px" }} />
        <div>
          <div className="accountDetailHead"> {name} </div>
          <div className="accountDetailBody">
            {" "}
            Address: {address.slice(0, 4)}...{address.slice(38)}
          </div>
        </div>
      </div>
      <div className="accountDetailRow">
        <img src={matic} alt="maticLogo" width={25} />
        <div>
          <div className="accountDetailHead"> Native Matic Tokens</div>
          <div className="accountDetailBody">{balance} Matic</div>
        </div>
      </div>
      <div className="balanceOptions">
        <div 
        className="extraOption"
        onClick={()=>setNameModal(true)}
        >Set Username</div>
      </div>
    </Card>
    <Modal
      title="Set a name"
      open={nameModal}
      onOk={() => {
        addName();
      }}
      onCancel={()=>setNameModal(false)}
      okText="Confirm"
      cancelText="Cancel"
    >
      <Input placeholder="name here" value={newName} onChange={(val)=>setNewName(val.target.value)}/>
    </Modal>
    </>
  );
}

export default AccountDetails;