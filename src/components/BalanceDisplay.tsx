import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { formatBalance } from '../utils/formatters';
import { toast } from 'sonner';

export default function BalanceDisplay({
  usdPrice,
}: {
  usdPrice: number | null;
}) {
  const { address } = useAccount();

  const {
    data: currentBalance,
    refetch: refetchCurrentBalance,
    isLoading,
  } = useBalance({ address });
  const { data: mainBalance, refetch: refetchMainBalance } = useBalance({
    address,
    chainId: 1,
  });
  const { data: arbitrumTestBalance, refetch: refetchArbitrumBalance } =
    useBalance({
      address,
      chainId: 421614,
    });
  const { data: sepoliaTestBalance, refetch: refetchSepoliaBalance } =
    useBalance({
      address,
      chainId: 11155111,
    });

  const isUsdPriceAvailable = typeof usdPrice === 'number';

  const balanceInUsd =
    currentBalance && isUsdPriceAvailable
      ? (Number(formatEther(currentBalance.value)) * (usdPrice ?? 0)).toFixed(2)
      : '0.00';

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">💰</span>
          Balance
        </h2>
        <button
          onClick={async () => {
            if (isLoading) {
              return;
            }

            try {
              await Promise.allSettled([
                refetchCurrentBalance(),
                refetchMainBalance(),
                refetchArbitrumBalance(),
                refetchSepoliaBalance(),
              ]);

              toast.success('Data re-fetched successfully!');
            } catch (error) {
              console.error(error);
              toast.error('Failed to re-fetch the data');
            }
          }}
          className="text-gray-400 hover:text-blue-600 hover:cursor-pointer transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-900 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative bg-linear-to-r from-emerald-500 to-teal-900 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium opacity-90">Current Network</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-white/20 rounded w-48"></div>
              <div className="h-6 bg-white/20 rounded w-32"></div>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="text-4xl font-bold tracking-tight">
                  {currentBalance && formatBalance(currentBalance.value)}
                </p>
                <span className="text-xl font-semibold opacity-90">
                  {currentBalance?.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium opacity-90">
                  ≈ ${balanceInUsd} USD
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">
            All Networks
          </h3>
        </div>

        <div className="group flex items-center justify-between p-4 bg-linear-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all cursor-pointer border border-gray-100 hover:border-blue-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg">⟠</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Ethereum</p>
              <p className="text-xs text-gray-500">Mainnet</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-800">
              {mainBalance && formatBalance(mainBalance.value)} ETH
            </p>
            <p className="text-xs text-gray-500">
              $
              {mainBalance && isUsdPriceAvailable
                ? (
                    Number(formatEther(mainBalance.value)) * (usdPrice ?? 0)
                  ).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </div>

        <div className="group flex items-center justify-between p-4 bg-linear-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all cursor-pointer border border-gray-100 hover:border-cyan-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-linear-to-br from-blue-300 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg">◈</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Arbitrum</p>
              <p className="text-xs text-gray-500">Testnet (Sepolia)</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-800">
              {arbitrumTestBalance && formatBalance(arbitrumTestBalance.value)}{' '}
              ETH
            </p>
            <p className="text-xs text-gray-500">
              $
              {arbitrumTestBalance && usdPrice
                ? (
                    Number(formatEther(arbitrumTestBalance.value)) * usdPrice
                  ).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </div>

        <div className="group flex items-center justify-between p-4 bg-linear-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all cursor-pointer border border-gray-100 hover:border-cyan-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-linear-to-br from-blue-300 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg">◈</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Sepolia</p>
              <p className="text-xs text-gray-500">Testnet (Sepolia)</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-800">
              {sepoliaTestBalance && formatBalance(sepoliaTestBalance.value)}{' '}
              ETH
            </p>
            <p className="text-xs text-gray-500">
              $
              {sepoliaTestBalance && usdPrice
                ? (
                    Number(formatEther(sepoliaTestBalance.value)) * usdPrice
                  ).toFixed(2)
                : '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold text-emerald-800">
              Total Portfolio
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-800">
            {isUsdPriceAvailable ? (
              <>
                $
                {(
                  (Number(formatEther(mainBalance?.value ?? 0n)) +
                    Number(formatEther(arbitrumTestBalance?.value ?? 0n)) +
                    Number(formatEther(sepoliaTestBalance?.value ?? 0n))) *
                  (usdPrice ?? 0)
                ).toFixed(2)}
              </>
            ) : (
              <span className="text-sm text-emerald-700">
                Waiting for price data...
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
