console.log("Script Loaded");
"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

var RewardsContractAddress = "0xB08858790B0317e16B6B45a80f3d8379E7e290F6"
var rewards_abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_distributor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "nftcontract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "feereciever",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "artistreciever",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "artistReciever",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "distributedAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "distributor",
		"outputs": [
			{
				"internalType": "contract IDividendDistributor",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeReciever",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nftContract",
		"outputs": [
			{
				"internalType": "contract IAutostakingContract",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "process",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "reciever",
				"type": "address"
			}
		],
		"name": "setArtistReciever",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IDividendDistributor",
				"name": "dist",
				"type": "address"
			}
		],
		"name": "setDividendDistributor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "reciever",
				"type": "address"
			}
		],
		"name": "setFeeReciever",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IAutostakingContract",
				"name": "autostaker",
				"type": "address"
			}
		],
		"name": "setNtContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

var contract;
// Web3modal instance
let web3Modal;
rewardContract

// Chosen wallet provider given by the dialog window
let provider;

let connected=false;

let mintPrice = 0.2;


// Address of the selected account
let selectedAccount;
let web3;
let t;
let accounts;

var myContract;
var rewardContract;

$.notify.defaults({
    position: "top center",
    className: 'success',
    autoHide: true,
  // if autoHide, hide after milliseconds
    autoHideDelay: 5000,
})

var LoaderModal = document.getElementById("loaderModal");
/**
 * Setup the orchestra
 */
 function init() {

   
    console.log("WalletConnectProvider is", WalletConnectProvider);
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);
  
    // Check that the web page is run in a secure context,
    // as otherwise MetaMask won't be available
    /*if(location.protocol !== 'https:') {
      // https://ethereum.stackexchange.com/a/62217/620
      const alert = document.querySelector("#alert-error-https");
      alert.style.display = "block";
      document.querySelector("#connectWallet").setAttribute("disabled", "disabled")
      return;
    }*/
  
    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
          options: {
            rpc: {
              56: "https://bsc-dataseed.binance.org",
            },
            network: 'binance'
          },
      },
    };
  
    web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });
    console.log("Web3Modal instance is", web3Modal);
  }

  async function getData(){

      if(connected){

        const balance = await web3.eth.getBalance(RewardsContractAddress);
		const ethBalance = web3.utils.fromWei(balance, "ether");
		const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
		$(".bnbBalanceVal").text(humanFriendlyBalance);
        
        //console.log(humanFriendlyBalance)
		document.querySelector(".dashstats").style.display = "inline";
		document.querySelector("#disconnectWallet").style.display = "inline";
		document.querySelector("#connectWallet").style.display = "none";
       // console.log("updated");
      }else{
        document.querySelector("#disconnectWallet").style.display = "none";
		document.querySelector(".dashstats").style.display = "none";
		document.querySelector("#connectWallet").style.display = "inline";
		
		
      }
  }

  	async function distribute(){
		$.notify(
			`Approve Txn`
		  );
		rewardContract.methods.process().send({from: accounts[0]}).then(function(data){
			getData();
			$.notify(
                `Successfully Collected`
              );
		}, function(err){
			$.notify("error, couldnt collect", "error")
		})
	}

  async function fetchAccountData() {
    // Get a Web3 instance for the wallet
    web3 = new Web3(provider);
  
    console.log("Web3 instance is", web3);
	rewardContract = new web3.eth.Contract(rewards_abi, RewardsContractAddress);
    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API
    const chainData = evmChains.getChain(chainId);
    
    
    // Get list of accounts of the connected wallet
    accounts = await web3.eth.getAccounts();
    
    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);
    selectedAccount = accounts[0];
       
    const balance = await web3.eth.getBalance(RewardsContractAddress);
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    //document.querySelector("#accountbalance").textContent = humanFriendlyBalance;
    // Because rendering account does its own RPC commucation
    // with Ethereum node, we do not want to display any results
    // until data for all accounts is loaded
    //await Promise.all(rowResolvers);
  
    // Display fully loaded UI for wallet data
    //document.querySelector(".buyAreaDisconnected").style.display = "none";
    //document.querySelector("#buyarea").style.display = "flex";
    connected = true;
    t = setInterval(getData, 1000);
  }


  /**
   * Fetch account data for UI when
   * - User switches accounts in wallet
   * - User switches networks in wallet
   * - User connects wallet initially
   */
  async function refreshAccountData() {

    // If any current data is displayed when
    // the user is switching acounts in the wallet
    // immediate hide this data

  
    // Disable button while UI is loading.
    // fetchAccountData() will take a while as it communicates
    // with Ethereum node via JSON-RPC and loads chain data
    // over an API call.
    document.querySelector("#connectWallet").setAttribute("disabled", "disabled")
    await fetchAccountData(provider);
    document.querySelector("#connectWallet").removeAttribute("disabled")
  }

  async function switchEthereumChain() {
    try {
        $.notify("Network must be Smart Chain", 'error');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
    } catch (e) {
      if (e.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x38',
                chainName: 'Smart Chain',
                nativeCurrency: {
                  name: 'Binance',
                  symbol: 'BNB', // 2-6 characters long
                  decimals: 18
                },
                blockExplorerUrls: ['https://bscscan.com'],
                rpcUrls: ['https://bsc-dataseed.binance.org'],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
          $.notify("There was a problem adding smart chain", 'error');
        }
      }else{
          $.notify("There was a problem switching chains", 'error');
      }
      // console.error(e)
    }
  }
  
  /**
   * Connect wallet button pressed.
   */
  async function onConnect() {
  
    console.log("Opening a dialog", web3Modal);
    try {
      provider = await web3Modal.connect();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }
    if(provider.chainId != 0x38){
        await switchEthereumChain()
    }else{
        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts) => {
            fetchAccountData();
        });

       
    }
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
      fetchAccountData();
    });
  
    // Subscribe to chainId change
    provider.on("chainChanged", async (chainId) => {
        clearInterval(t);
        connected = false;
        if(chainId == 0x38){
            fetchAccountData();
        }else{
            await switchEthereumChain();
        }
        
    });
    await refreshAccountData();

  }
  
  /**
   * Disconnect wallet button pressed.
   */
  async function onDisconnect() {
  
    console.log("Killing the wallet connection", provider);
  
    // TODO: Which providers have close method?
    if(provider.close) {
      await provider.close();
      console.log(provider)
        
      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.
      await web3Modal.clearCachedProvider();
      provider = null;
    }
    
    selectedAccount = null;
    document.querySelector("#disconnectWallet").style.display = "none";
    // Set the UI back to the initial state
    connected = false;
  }

  

  async function startLoader(txt){
	$.notify(
		txt
	  );
  }


window.addEventListener('load', async () => {
    init();
    document.querySelector("#connectWallet").addEventListener("click", onConnect);
    //document.querySelector("#disconnectWallet").addEventListener("click", onDisconnect);
  });