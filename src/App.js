import { useEffect,useState } from 'react';
import { ethers } from 'ethers';
import wallet from "./artifacts/contracts/Wallet.sol/Wallet.json";
import './App.css';

const walletAdersse="0x5FbDB2315678afecb367f032d93F642f64180aa3";


function App() {
  const [balance, setBalance] = useState();
  const [amount, setAmount] = useState();
  const [amountWithdraw, setAmountWithdraw] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  useEffect(()=>{
    getBalance();
  },[])
  
  async function getBalance(){
      if(typeof window.ethereum !== "undefined"){
        const accounts=await window.ethereum.request({method:"eth_requestAccounts"});
        const provider=new ethers.providers.Web3Provider(window.ethereum);
        const contract=new ethers.Contract(walletAdersse,wallet.abi,provider);
        
       try {
          let overide={
            from:accounts[0]
          }
          const data= await contract.getBalance(overide);
          setBalance(String(data));
       } catch (error) {
          setError(error)
       }

      }
  }
  async function snedMoney(){
    if(!amount)return;
    


    if(typeof window.ethereum !== "undefined"){
      const accounts=await window.ethereum.request({method:"eth_requestAccounts"});
      const provider=new ethers.providers.Web3Provider(window.ethereum);
      const signer=provider.getSigner();
      
      
      try {
        const override={
    
        value:ethers.utils.parseEther(amount),
        to:walletAdersse,
        from:accounts[0]
        }
        const transaction=await signer.sendTransaction(override);
        await transaction.wait();

        setSuccess("You have send money to your waller");
        setAmount('');
        getBalance();

      } catch (error) {
          setError(error)
      }
      
    }
  }

  async function widthrawMoney(){
      if(!amountWithdraw) return
      if(typeof window.ethereum !=="undefined"){
        const accounts=await window.ethereum.request({method:"eth_requestAccounts"});
        const provider=new ethers.providers.Web3Provider(window.ethereum);
        const signer=provider.getSigner();
        const contract=new ethers.Contract(walletAdersse,wallet.abi,signer);

        try {
            const override={
              to:accounts[0],
              value:ethers.utils.parseEther(amountWithdraw)
            }
            const transaction=await contract.withdrawMoney(accounts[0],ethers.utils.parseEther(amountWithdraw));
            await transaction.wait();
            setSuccess("You have withdraw "+amountWithdraw+ " money to your wallet");
            getBalance();
            setAmountWithdraw('');
          
        } catch (error) {
          setError("une erreur");
        }
      }
  }
  return (
    <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
      <div className='grid grid-cols-2 text-2xl '>
        <div>Welcome to your wallet <strong className='font-bold text-blue-600'>WEB 3</strong></div>
        <div className='text-end '>
          You have <span className='font-bold text-blue-600'>{
            balance? 
            balance / 10**18 : 0
            } ETH </span> in your wallet
        </div>
      </div>
      
      <br /><br />
        <div className=' grid grid-cols-4 gap-2'>
          <div>
              <input className='bg-gray-200 border border-gray-300 text-gray-900 text-md rounded-lg c focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  ' type="text" 
              placeholder="Put the amount tha you want to send" onChange={(e)=>{setAmount(e.target.value)}}/>
          </div>
          <div>
              <button className='bg-green-600 p-2 rounded-md text-white' onClick={snedMoney}>Withdraw money to your wallet</button>
          </div>
          {/* Send amout to another address */}
          <div>
              <input className='bg-gray-200 border border-gray-300 text-gray-900 text-md rounded-lg c focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  ' type="text" 
              placeholder="Put the amount tha you want to send" onChange={(e)=>{setAmountWithdraw(e.target.value)}}/>
              {amountWithdraw}
          </div>
          <div>
              <button className='bg-blue-600 p-2 rounded-md text-white' onClick={widthrawMoney}>Send Money to another</button>
          </div>
        </div>
        <br />
        <div className='grid justify-items-center'>
            {success && <div className='text-blue-600 '>{success}</div>}
            {error && <div className='text-orange-600 '>{error}</div>}
        </div>
      
     
     
    </div>
   
  );
}

export default App;
