import { formatEther } from 'viem';

export function shortenAddress(address?: string, chars = 4): string {
  if (!address) {
    return 'Unknown';
  }

  const prefixLength = chars + 2; // "0x" + chars
  if (address.length <= prefixLength + chars) {
    return address;
  }

  return `${address.slice(0, prefixLength)}...${address.slice(-chars)}`;
}

export function formatBalance(amount?: bigint, decimals = 4): string {
  if (!amount) {
    return '0';
  }

  const formatted = formatEther(amount);
  const [integer, fraction] = formatted.split('.');

  if (!fraction && !decimals) {
    return integer;
  }

  return `${integer}.${fraction.slice(0, decimals).padEnd(decimals, '0')}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
