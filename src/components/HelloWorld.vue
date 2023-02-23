<template>
  <div class="text-center">    
    <h1>WalletConnect</h1>
    <b-input type="text" class="mx-auto text-center mb-4" style="width:300px;" v-model="airdropAddress" placeholder="Enter Airdrop Id"/>
    <b-button class="ml-2" variant="info" @click="connectWallet">Connect</b-button>        
    <b-button class="ml-2" variant="success" @click="claimReward">claimReward</b-button>
    <b-button class="ml-2" variant="danger" @click="disconnectWallet">Disconnect</b-button>
  </div>
</template>

<script>
import {initWalletConnect,web3modal} from "../walletConnect/myWallet"
import { signMessage,disconnect, switchNetwork, readContract, getContract,getProvider,getAccount, watchAccount,fetchSigner } from '@wagmi/core'
import {abi, getAddress} from "../contract/finananceContractABI"
import toast from "../elements/toast"
import axios from "axios"
// import {ethers} from "ethers"
export default {
  name: 'HelloWorld',  
  data(){
    return{
      airdropAddress:'',
      filteredObject:null,
      chainId:0,
      message_sign:'',
      signature:'',
      walletAddress:''
    }
  },
  mounted() {
     initWalletConnect()
  },
  methods:{  
  async connectWallet() {    
    if(this.airdropAddress==="") {
        return this.toast('Enter Airdrop id','error')
    }  
    console.log('connect')    
  await web3modal.openModal();
  if(this.walletAddress==="" && localStorage.getItem('wagmi.store')){          
          const getDataFromLocalStorage = localStorage.getItem('wagmi.store')          
          const parsed = JSON.parse(getDataFromLocalStorage) 
          // eslint-disable-next-line         
          if(parsed.state.data.hasOwnProperty('account')){            
            if(this.signature===""){
            await this.sign(parsed.state.data.account)   
            web3modal.closeModal()
            }           
          }                 
        }   
  watchAccount(async account=>{
    if(account.isConnected){
      console.log(account)
      this.walletAddress = account.address

      await this.sign(this.walletAddress)
    }
  })
    },
    async sign(address) {     
      console.log('in sign')
      const message = "You are Signing this message to ensure your participation in this event"
      this.message_sign = message;
      this.signature = await signMessage({
        message:this.message_sign
      })
      const signingKey = await fetchSigner()
      console.log(signingKey)
      const resolvedAddress = signingKey._address
      console.log(resolvedAddress)
      if(address === resolvedAddress){
      console.log(resolvedAddress)
      }              
    },
   async disconnectWallet() {
    await disconnect();
    this.walletAddress=""
    this.signature=""
    this.message_sign=""
    this.toast('Disconnected','success')
    },
  async claimReward() {
    if(this.airdropAddress===""){
      return this.toast('Enter Airdrop id','error')
    }    
    try{
    let allProjects =[]       
    const getWalletConnect = localStorage.getItem('walletconnect')
    console.log(JSON.parse(getWalletConnect).accounts[0])
    const parsedData = JSON.parse(getWalletConnect)
    const isMetamask = parsedData.peerMeta.name
    console.log(isMetamask)
    if(isMetamask === 'MetaMask'){      
            var userAgent = navigator.userAgent.toLowerCase();
            var Android = userAgent.indexOf("android") > -1;              
            const isIos = this.iOS()
            console.log(Android)
            console.log(isIos)
            if(Android === true || isIos === true){
              const url = "metamask://dapp/google.co"
              const a = document.createElement("a");
              a.href = url;
              a.target = "_self";
              document.body.appendChild(a);
              a.click();
              a.remove();
            }                
    }
    const walletAddress = parsedData.accounts[0]
    console.log(walletAddress)
     const res = await axios.get(`https://bank.influencebackend.xyz/bank/check/${walletAddress}`)
     console.log(res)
      allProjects = [...res.data]
      const filteredObject = allProjects.find((x)=>{
        return x._id === this.airdropAddress
      })
      console.log(filteredObject)
      this.filteredObject = { ...filteredObject}
      this.chainId =filteredObject.additionalData.chainId
      const chainIdOfWallet = parsedData.chainId
      console.log(chainIdOfWallet)     
       
      if(this.chainId!==chainIdOfWallet){
      const network = await switchNetwork({
        chainId: this.chainId,
        })
        console.log(network)
      }
      
    const address = getAddress(this.chainId) 
    const withdrawn = await readContract({
      address: address,
      abi:abi,
      functionName:'getWithdrawn',
      args:[ this.filteredObject.treeIndex - 1,
                this.filteredObject.inputData.hash]      
    })
    console.log("withdrawn",withdrawn)
    if(withdrawn == true){
      throw new Error('Reward already claimed')
    }
    const getProofFromApi= await this.getProof(this.airdropAddress,walletAddress)
    console.log(getProofFromApi)
    const amountInWei = this.filteredObject.inputData.data.value.toString()
    console.log(amountInWei)
    console.log("address",address)
    console.log("abi",abi)
    console.log("index",this.filteredObject.treeIndex-1)
    console.log("amount",amountInWei)
    console.log("getProofFromApi",getProofFromApi)
    // const {hash} = await writeContract({
    //   mode:'recklesslyUnprepared',
    //   address:address,
    //   abi:abi,
    //   functionName:'withdraw',
    //   args:[this.filteredObject.treeIndex-1,walletAddress,amountInWei,getProofFromApi]}
    //   )    
    //   console.log(hash)
    //   const waitResp = await waitForTransaction({
    //     hash:hash
    //   })
      const provider = getProvider({
        chainId:this.chainId
      })
      console.log(provider)
      const account = getAccount();
console.log(account)
  const signer = await account.connector?.getSigner();  
console.log(signer)
      // console.log(refetch)
      const contract = getContract({
        address:address,
        abi:abi,    
        signerOrProvider:signer    
      })
      console.log(contract)
      console.log(this.filteredObject.treeIndex)
      const treeIndex =this.filteredObject.treeIndex-1
      console.log(treeIndex)
      const resp = await contract.functions.withdraw(
        treeIndex,
        walletAddress,
        amountInWei,
        getProofFromApi,{
        gasLimit: 250000
        }
      )
      console.log(resp)
      console.log(resp.hash)
      const response = await resp.wait();
      console.log(response)
      if(response.status===1){
       return this.toast("Reward claimed successfully! check your wallet",'success')
      }
    }
    catch(e){
      console.log(e.message)
      this.toast(e.message,'error')    
    }
  },
  iOS() {
  return [    
    'iPhone',   
  ].includes(navigator.platform)    
},

  async getProof(projectId,walletAddress) {
      const proof = await axios.get(`https://bank.influencebackend.xyz/proof/${projectId}/${walletAddress}`)
      return proof?.data?.merkleProof      
    },
  },
  mixins:[toast]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
