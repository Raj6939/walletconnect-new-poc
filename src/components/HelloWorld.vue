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
import { signMessage,disconnect, switchNetwork, readContract, writeContract,waitForTransaction } from '@wagmi/core'
import {abi, getAddress} from "../contract/finananceContractABI"
import toast from "../elements/toast"
import axios from "axios"
export default {
  name: 'HelloWorld',  
  data(){
    return{
      airdropAddress:'',
      filteredObject:null,
      chainId:0
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
    },
   async disconnectWallet() {
    await disconnect();
    this.toast('Disconnected','success')
    },
   async sign(){
    const signature = await signMessage({
  message: 'Hi there I am from Fyre',
})
console.log(signature)
   },
  async claimReward() {
    if(this.airdropAddress===""){
      return this.toast('Enter Airdrop id','error')
    }
    try{
    let data =[]       
    const getWalletConnect = localStorage.getItem('walletconnect')
    console.log(JSON.parse(getWalletConnect).accounts[0])
    const parsedData = JSON.parse(getWalletConnect)
    const walletAddress = parsedData.accounts[0]
    console.log(walletAddress)
     const res = await axios.get(`https://bank.influencebackend.xyz/bank/check/${walletAddress}`)
     console.log(res)
      data = [...res.data]
      const filteredObject = data.find((x)=>{
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
    const {hash} = await writeContract({
      mode:'recklesslyUnprepared',
      address:address,
      abi:abi,
      functionName:'withdraw',
      args:[this.filteredObject.treeIndex-1,walletAddress,amountInWei,getProofFromApi]}
      )    
      console.log(hash)
      const waitResp = await waitForTransaction({
        hash:hash
      })
      console.log(waitResp)
      console.log(waitResp.status)
      if(waitResp.status===1){
       return this.toast("Reward claimed successfully! check your wallet",'success')
      }
    }
    catch(e){
      console.log(e.message)
      this.toast(e.message,'error')    
    }
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
