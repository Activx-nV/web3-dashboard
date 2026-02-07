import { normalize } from 'viem/ens';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';

export default function WalletInfo() {
  const { address, chain } = useAccount();
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: normalize(ensName || ''),
  });

  const copyAddress = async () => {
    if (!address) {
      toast.info('Wallet address is not available yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      toast.success('Successfully copied!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="group bg-white/90 backdrop-blur-sm p-8 rounded-4xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-black">👤</span>
          Wallet Info
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-900  rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-green-500">
            Connected
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-4 p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl">
        <div className="relative">
          {ensAvatar ? (
            <img
              src={ensAvatar}
              alt="ENS Avatar"
              className="w-20 h-20 rounded-2xl ring-4 ring-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-emerald-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
              {address?.[2] || '?'}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
        </div>

        <div className="flex-1 min-w-0">
          {ensName && (
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xl font-bold text-gray-800 truncate">
                {ensName}
              </p>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                ENS
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
            <code className="text-sm font-mono text-gray-700 truncate">
              {address ? (
                <Tooltip>
                  <TooltipTrigger>
                    <p>{`${address.slice(0, 10)}...${address.slice(-8)}`}</p>
                  </TooltipTrigger>
                  <TooltipContent>{address}</TooltipContent>
                </Tooltip>
              ) : (
                'Address is unknown'
              )}
            </code>
            <button
              onClick={copyAddress}
              className="shrink-0 text-blue-600 hover:text-blue-700 hover:cursor-pointer hover:bg-blue-50 p-1.5 rounded-lg transition-all hover:scale-110"
              title="Copy address"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => {
            const etherscanUrl = chain?.blockExplorers?.default?.url;

            if (!etherscanUrl || !address) {
              toast.info('Explorer URL or address is not available.');
              return;
            }

            window.open(`${etherscanUrl}/address/${address}`, '_blank');
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 hover:cursor-pointer text-blue-700 rounded-xl font-medium transition-all hover:shadow-md group"
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View on Explorer
        </button>
      </div>
    </div>
  );
}
