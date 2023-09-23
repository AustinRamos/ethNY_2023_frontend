import { ethers } from 'ethers'; // Import ethers


export function BridgeTokenForm() {


  //CHANGE THIS IF NECESSARY TO MY ALCHEMY ONE
  const mumbaiProviderUrl = 'https://rpc-mumbai.matic.today'; // Polygon Mumbai testnet provider URL
  const provider = new ethers.providers.JsonRpcProvider(mumbaiProviderUrl);

  const privateKey = 'YOUR_PRIVATE_KEY';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const amountWETH = e.target.amountWETH.value;
    const amountUSDC = e.target.amountUSDC.value;
    
    // Add your logic here for handling the form submission
    // You can use amountWETH and amountUSDC in your logic
    // For example, you can send a request to initiate the bridge transaction.
    // Implement your onSubmit logic here.
    console.log('Submitting form with amountWETH:', amountWETH, 'amountUSDC:', amountUSDC);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="amountWETH" className="block text-gray-700 text-sm font-bold mb-2">
          Amount of WETH
        </label>
        <input
          type="number"
          id="amountWETH"
          name="amountWETH"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter amount of WETH"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="amountUSDC" className="block text-gray-700 text-sm font-bold mb-2">
          Amount of USDC
        </label>
        <input
          type="number"
          id="amountUSDC"
          name="amountUSDC"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter amount of USDC"
          required
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Bridge to Arbitrum
        </button>
      </div>
    </form>
  );
}
