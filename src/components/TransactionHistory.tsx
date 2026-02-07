import { useEffect, useState } from 'react';
import { formatEther, formatUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';
import { formatDate, shortenAddress } from '../utils/formatters';

export default function TransactionHistory({
  usdPrice,
}: {
  usdPrice: number | null;
}) {
  const { address, chain } = useAccount();
  const [transactions, setTransactions] = useState<EtherscanTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const chainId = useChainId();

  useEffect(() => {
    if (!address || !chainId) return;

    const fetchTransactions = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
        const url = new URL('https://api.etherscan.io/v2/api');
        url.searchParams.set('chainid', String(chainId));
        url.searchParams.set('module', 'account');
        url.searchParams.set('action', 'txlist');
        url.searchParams.set('address', address);
        url.searchParams.set('startblock', '0');
        url.searchParams.set('endblock', '99999999');
        url.searchParams.set('sort', 'desc');
        if (apiKey) url.searchParams.set('apikey', apiKey);

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`Etherscan request failed: ${response.statusText}`);
        }

        const data: EtherscanResponse = await response.json();

        if (data.status === '1') {
          setTransactions(data.result);
        } else {
          console.error('Etherscan API error:', data.message);
          setErrorMessage(data.message || 'Failed to load transactions');
          setTransactions([]);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, chainId]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">📜</span>
          Transactions
        </h2>
      </div>
      {isLoading ? (
        <div className="text-center py-16">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading transactions...
          </p>
        </div>
      ) : errorMessage ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{errorMessage}</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Your transaction history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
          {transactions.map((tx, index) => {
            const dateTime = formatDate(+tx.timeStamp);
            const transactionFeeInWei =
              BigInt(tx.gasUsed) * BigInt(tx.gasPrice);
            const transactionFeeInEth = Number(
              formatEther(transactionFeeInWei)
            );
            const gasPriceInGwei = Number(formatUnits(BigInt(tx.gasPrice), 9));

            return (
              <div
                key={tx.hash}
                className="group border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg bg-linear-to-br from-white to-gray-50 hover:to-blue-50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.isError === '0'
                          ? 'bg-green-100 ring-4 ring-green-50'
                          : 'bg-red-100 ring-4 ring-red-50'
                      }`}
                    >
                      {tx.isError === '0' ? (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          tx.isError === '0' ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {tx.isError === '0' ? 'Success' : 'Failed'}
                      </p>
                      <p className="text-xs text-gray-500">{dateTime}</p>
                    </div>
                  </div>
                  {chain?.blockExplorers?.default?.url ? (
                    <a
                      href={`${chain.blockExplorers.default.url}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition-colors group-hover:scale-105"
                    >
                      View
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Explorer URL not available
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2 mb-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">
                      From
                    </span>
                    <code className="text-xs font-mono text-gray-800 bg-white px-2 py-1 rounded">
                      {shortenAddress(tx.from)}
                    </code>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">
                      To
                    </span>
                    <code className="text-xs font-mono text-gray-800 bg-white px-2 py-1 rounded">
                      {tx.to ? shortenAddress(tx.to) : 'Contract creation'}
                    </code>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <span className="text-sm font-semibold text-gray-700">
                    Amount
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">
                      {Number(formatEther(BigInt(tx.value))).toFixed(4)} ETH
                    </p>
                    <p className="text-xs text-gray-500">
                      {typeof usdPrice === 'number' ? (
                        <>
                          ={' '}
                          {(
                            Number(formatEther(BigInt(tx.value))) * usdPrice
                          ).toFixed(2)}{' '}
                          USD
                        </>
                      ) : (
                        'USD value unavailable'
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                  <code className="text-xs font-mono text-gray-600 break-all">
                    {tx.hash.slice(0, 24)}...{tx.hash.slice(-12)}
                  </code>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    Transaction fee:
                    <br />
                    <code className="font-mono text-gray-600 break-all">
                      {`${transactionFeeInEth} ETH`} (
                      <span className="text-[11px]">
                        Gas price Gwei {gasPriceInGwei}
                      </span>
                      )
                    </code>
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Nonce: <br />
                    <code className="font-mono text-gray-600 break-all">
                      {tx.nonce}
                    </code>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
