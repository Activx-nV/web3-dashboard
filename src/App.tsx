import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import WalletInfo from './components/WalletInfo';
import BalanceDisplay from './components/BalanceDisplay';
import NetworkSwitcher from './components/NetworkSwitcher';
import TransactionHistory from './components/TransactionHistory';
import MessageSigner from './components/MessageSigner';
import PixelSnow from './components/PixelSnow';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';

function App() {
  const { isConnected, isConnecting } = useAccount();

  const [usdPrice, setUsdPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        if (!response.ok) {
          console.error('Failed to fetch ETH price:', response.statusText);
          return;
        }

        const data: { ethereum?: { usd?: number } } = await response.json();
        if (typeof data.ethereum?.usd === 'number') {
          setUsdPrice(data.ethereum.usd);
        }
      } catch (error) {
        console.error('Error while fetching ETH price:', error);
      }
    };

    fetchEthPrice();
  }, []);

  return (
    <>
      <Toaster richColors />
      <div className="fixed inset-0 overflow-hidden pointer-events-none bg-black">
        <PixelSnow />
      </div>
      <div className="min-h-screen">
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
          <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-indigo-400 bg-clip-text text-transparent">
                  Web3 Dashboard
                </h1>
              </div>
            </div>
            <div className="scale-100 hover:scale-105 transition-transform">
              <ConnectButton showBalance={false} />
            </div>
          </header>

          {isConnecting && (
            <div className="text-center py-32">
              <div className="relative inline-flex">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-indigo-600 rounded-full animate-spin animation-delay-150"></div>
              </div>
              <p className="mt-6 text-lg text-gray-600 font-medium">
                Connecting to your wallet...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please check your wallet extension
              </p>
            </div>
          )}

          {isConnected && !isConnecting && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WalletInfo />
                <BalanceDisplay usdPrice={usdPrice} />
              </div>

              <NetworkSwitcher />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionHistory usdPrice={usdPrice} />
                <MessageSigner />
              </div>
            </div>
          )}

          {!isConnected && !isConnecting && (
            <div className="text-center py-20 animate-fadeIn">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8 relative inline-block">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative text-8xl">✨</div>
                </div>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  Connect your wallet to explore available features
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
