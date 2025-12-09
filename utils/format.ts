
export const shortenAddress = (address: string, chars = 4): string => {
    if (!address) return "";
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
};

export const formatNumber = (value: number, maxDecimals = 4): string => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDecimals,
    }).format(value);
}
