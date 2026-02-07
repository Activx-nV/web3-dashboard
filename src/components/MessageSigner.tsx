import { useState, type ChangeEvent } from 'react';
import { useSignMessage } from 'wagmi';
import { verifyMessage } from 'viem';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export default function MessageSigner() {
  const { address } = useAccount();
  const {
    data: signature,
    signMessage,
    isPending,
    isError,
    error,
    reset,
  } = useSignMessage();

  const [message, setMessage] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  );
  const [verifying, setVerifying] = useState(false);

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (signature) {
      reset();
      setVerificationResult(null);
    }
  };

  const handleSign = () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    signMessage({ message });
  };

  const handleVerify = async () => {
    if (!signature || !message || !address) {
      toast.info('Missing signature or message');
      return;
    }

    try {
      setVerifying(true);

      const isVerified = await verifyMessage({
        address,
        message,
        signature,
      });

      if (isVerified) {
        setVerificationResult('✅ Signature is valid!');
      } else {
        setVerificationResult('❌ Signature is invalid');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setVerificationResult('❌ Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const copySignature = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      toast.info('Signature copied to clipboard!');
    }
  };

  const clearAll = () => {
    setMessage('');
    reset();
    setVerificationResult(null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">✍️</span>
          Sign Message
        </h2>
        <div className="flex items-center gap-2">
          {signature && (
            <button
              onClick={clearAll}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isError && error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fadeIn">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-semibold text-red-800">
                {error.message || 'Failed to sign message'}
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Your Message
          </label>
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter any message to sign"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-linear-to-br from-white to-gray-50 placeholder-gray-400"
            rows={4}
            disabled={isPending || verifying}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 flex items-center gap-1">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Your private key never leaves your wallet
            </p>
            <span className="text-xs text-gray-400">
              {message.length} characters
            </span>
          </div>
        </div>

        <button
          onClick={handleSign}
          disabled={!message.trim() || isPending || !address}
          className="group w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:hover:shadow-lg transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          <span className="flex items-center justify-center gap-2">
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Waiting for signature...
              </>
            ) : !address ? (
              <>
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Connect Wallet First
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Sign Message
              </>
            )}
          </span>
        </button>

        {signature && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-bold text-green-800">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Signature Generated
                </label>
                <button
                  onClick={copySignature}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                >
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </button>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200 max-h-32 overflow-y-auto custom-scrollbar">
                <code className="text-xs font-mono text-gray-700 break-all leading-relaxed">
                  {signature}
                </code>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Length: {signature.length} characters
              </p>
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className="group w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center gap-2">
                {verifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Verify Signature
                  </>
                )}
              </span>
            </button>

            {verificationResult && (
              <div
                className={`p-5 rounded-2xl border-2 animate-fadeIn ${
                  verificationResult.includes('valid')
                    ? 'bg-linear-to-br from-green-50 to-emerald-50 border-green-300'
                    : 'bg-linear-to-br from-red-50 to-rose-50 border-red-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      verificationResult.includes('valid')
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {verificationResult.includes('valid') ? (
                      <svg
                        className="w-6 h-6 text-white"
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
                        className="w-6 h-6 text-white"
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
                      className={`font-bold text-lg ${
                        verificationResult.includes('valid')
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}
                    >
                      {verificationResult}
                    </p>
                    <p
                      className={`text-sm ${
                        verificationResult.includes('valid')
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {verificationResult.includes('valid')
                        ? 'The signature matches the connected wallet address'
                        : 'The signature does not match the connected wallet'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-1">
                What is Message Signing?
              </p>
              <p className="text-xs text-blue-800 leading-relaxed whitespace-pre-wrap">
                Message signing proves you own a wallet address without exposing
                your private key. It's commonly used for authentication, proving
                ownership, and verifying identity in Web3 applications. <br />
                <br />
                <i className="text-red-700">
                  This demo verifies the message purely on Frontend, but in real
                  apps verification should be implemented on Backend via SIWE.
                </i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
