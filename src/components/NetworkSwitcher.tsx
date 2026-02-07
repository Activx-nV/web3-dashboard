import { useAccount, useChainId, useChains, useSwitchChain } from 'wagmi';

export default function NetworkSwitcher() {
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const chains = useChains();

  const handleSwitchNetwork = (newChainId: number) => {
    switchChain({ chainId: newChainId });
  };

  if (!isConnected) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">🌐</span>
          Network
        </h2>
        <div className="px-3 py-1 bg-gray-900 text-green-500 rounded-full text-xs font-semibold">
          {chains.length} Available
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {chains.map(({ id, name }) => (
          <button
            key={id}
            onClick={() => handleSwitchNetwork(id)}
            disabled={chainId === id}
            className={`
              group relative p-5 rounded-2xl border-2 transition-all duration-300
              ${
                chainId === id
                  ? 'border-green-500 bg-linear-to-br from-green-50 to-emerald-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-lg hover:-translate-y-1'
              }
              ${chainId === id ? 'cursor-default' : 'cursor-pointer'}
              disabled:opacity-100
            `}
          >
            {chainId === id && (
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                ✓
              </div>
            )}

            <div
              className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-linear-to-br from-emerald-500 to-gray-950 flex items-center justify-center text-white text-2xl shadow-md ${
                chainId !== id && 'group-hover:scale-110'
              } transition-transform`}
            >
              ◈
            </div>
            <p className="text-sm font-bold text-gray-800 text-center mb-1">
              {name}
            </p>

            {chainId === id && (
              <div className="mt-2 flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-emerald-700">
                  Connected
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
