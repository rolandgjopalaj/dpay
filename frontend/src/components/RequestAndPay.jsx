import React, { useState, useEffect } from "react";
import { DollarOutlined, SwapOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber } from "antd";

import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from  "wagmi";

import { polygonMumbai } from 'wagmi/chains'
import ABI from "../abi.json";

function RequestAndPay({ requests, getNameAndBalance }) {

  const [payModal, setPayModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState(5);
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");


  const showPayModal = () => {
    setPayModal(true);
  };
  const hidePayModal = () => {
    setPayModal(false);
  };

  const showRequestModal = () => {
    setRequestModal(true);
  };
  const hideRequestModal = () => {
    setRequestModal(false);
  };

  useEffect(()=>{
  },[])

  const { data: hash, writeContract } = useWriteContract() 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash, }) 

  async function createPaymentRequest() { 
    writeContract({
      address: '0xAC002d53FFE64cc00b8CE9d237E2FF91085560cc',
      abi: ABI,
      functionName: 'createRequest',
      args: [requestAddress, requestAmount, requestMessage],
    })
  }


  const { data: hashPay, writeContract:  writeContractPay} = useWriteContract() 

  const { isLoading: isConfirmingPay, isSuccess: isConfirmedPay } = useWaitForTransactionReceipt({ hashPay, }) 

  async function payRequest() { 
    console.log(String(Number(1)))
    writeContractPay({
      address: '0xAC002d53FFE64cc00b8CE9d237E2FF91085560cc',
      abi: ABI,
      functionName: 'payRequest',
      args: [0],
      overrides: {
        value: String(Number(1)),
      },
    })
  }


    return (
        <>
        <Modal
          title="Confirm Payment"
          open={payModal}
          onOk={() => {
            payRequest()
            hidePayModal();
          }}
          onCancel={hidePayModal}
          okText="Proceed To Pay"
          cancelText="Cancel"
        >
          {requests && requests["0"].length > 0 && (
            <>
              <h2>Sending payment to {requests["3"][0]}</h2>
              <h3>Value: {requests["1"][0]} Matic</h3>
              <p>"{requests["2"][0]}"</p>
            </>
          )}
        </Modal>
        <Modal
          title="Request A Payment"
          open={requestModal}
          onOk={() => {
            createPaymentRequest();
            hideRequestModal();
          }}
          onCancel={hideRequestModal}
          okText="Proceed To Request"
          cancelText="Cancel"
        >
          <p>Amount (Matic)</p>
          <InputNumber value={requestAmount} onChange={(val)=>setRequestAmount(val)}/>
          <p>From (address)</p>
          <Input placeholder="0x..." value={requestAddress} onChange={(val)=>setRequestAddress(val.target.value)}/>
          <p>Message</p>
          <Input placeholder="Lunch Bill..." value={requestMessage} onChange={(val)=>setRequestMessage(val.target.value)}/>
        </Modal>
        <div className="requestAndPay">
          <div
            className="quickOption"
            onClick={() => {
              showPayModal();
            }}
          >
            <DollarOutlined style={{ fontSize: "26px" }} />
            Pay
            {requests && requests["0"].length > 0 && (
              <div className="numReqs">{requests["0"].length}</div>
            )}
          </div>
          <div
            className="quickOption"
            onClick={() => {
              showRequestModal();
            }}
          >
            <SwapOutlined style={{ fontSize: "26px" }} />
            Request
          </div>
        </div>
        </>
    );
}

export default RequestAndPay;