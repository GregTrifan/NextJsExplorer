import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";

import { type AddressInfo } from "@/hooks/blockscout/queries";
import { parseHash } from "@/utils/hashes";
import { parseNumber, parseWithER } from "@/utils/parseNumbers";
import { camelToFlat } from "@/utils/parseNames";

interface ContractProps {
    addressInfo: AddressInfo;
    chainId: number;
}

function getNativeCurrency(chainId?: number) {
    if (chainId === 137) return "MATIC";
    return "ETH";
}

export const BalanceCard = (props: ContractProps) => {
    const addressInfo = props.addressInfo;
    const chainId = props.chainId;

    const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyStates((prev) => ({ ...prev, [key]: true }));
            setTimeout(() => {
                setCopyStates((prev) => ({ ...prev, [key]: false }));
            }, 2000);
        });
    };

    return (
        <div className="fade-in-1s outline outline-offset-1 outline-4 hover:outline-2 outline-emerald-900 hover:outline-sky-400 dark:outline-emerald-400 dark:shadow-emerald-500/20 dark:hover:outline-sky-400  dark:hover:shadow-sky-500/20 dark:shadow-xl  transition-all  fade-in-1s mt-2 items-center justify-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto font-semibold pb-2 rounded-lg bg-gray-50 dark:bg-black/10 pt-2 pl-2 pr-2">
            {addressInfo.token?.icon_url && (
                <Image
                    src={addressInfo.token?.icon_url}
                    height={36}
                    width={36}
                    alt={addressInfo.token?.name}
                    className="mx-auto mb-2 rounded-sm mt-2"
                />
            )}

            {addressInfo?.name && (
                <div className="text-3xl sm:text-4xl font-semibold pr-5 pl-5 mt-2 text-blue-950 dark:text-blue-400">
                    {camelToFlat(addressInfo?.name)}
                </div>
            )}

            {addressInfo?.implementation_name && (
                <div className="text-2xl sm:text-3xl font-semibold pr-5 pl-5 mt-3 text-emerald-900 dark:text-emerald-400">
                    {camelToFlat(addressInfo?.implementation_name)}
                </div>
            )}

            {addressInfo?.token && (
                <div className="mt-2 text-xl sm:text-2xl font-semibold text-cyan-950 break-words dark:text-cyan-500">
                    {addressInfo.token?.name}{" "}
                    {addressInfo.token?.symbol && (
                        <span>{"(" + String(addressInfo.token?.symbol) + ")"}</span>
                    )}
                    <span className="text-xs ml-1 break-keep">
                        {addressInfo.token?.type}
                    </span>
                </div>
            )}

            {addressInfo.token?.holders && (
                <div className="text-xs sm:text-lg font-semibold pr-5 pl-5 mt-2 text-cyan-900 dark:text-cyan-600">
                    {parseNumber(addressInfo.token?.holders)} holders
                </div>
            )}

            {addressInfo.token?.symbol && addressInfo.token?.exchange_rate && (
                <div className="underline underline-offset-2 dark:text-cyan-600	decoration-indigo-500 hover:decoration-pink-400 decoration-2 hover:decoration-1 text-xs sm:text-lg font-semibold pr-5 pl-5 mt-2 text-cyan-900 tracking-wide">
                    1 {addressInfo.token.symbol} = ${addressInfo.token.exchange_rate}
                </div>
            )}

            {addressInfo.token?.volume_24h && (
                <div className="transition-all text-xs sm:text-lg  dark:text-cyan-600 pr-5 pl-5 mt-2 font-bold tracking-wide text-cyan-800">
                    ${parseNumber(addressInfo.token?.volume_24h)}{" "}
                    <span className="text-cyan-950 dark:text-cyan-400/50 font-medium tracking-tighter">
                        24h volume
                    </span>
                </div>
            )}

            {addressInfo.token?.volume_24h &&
                addressInfo.token?.circulating_market_cap !== "0.0" &&
                addressInfo.token?.circulating_market_cap && (
                    <div className="text-xs sm:text-lg pr-5 pl-5 mt-1 text-cyan-950 dark:text-cyan-500/70">
                        <span className="text-cyan-800 dark:text-cyan-400 font-semibold tracking-wide">
                            {(
                                (Number(addressInfo.token?.volume_24h) /
                                    Number(addressInfo.token?.circulating_market_cap)) *
                                100
                            ).toLocaleString("en-US")}
                            %
                        </span>{" "}
                        of
                    </div>
                )}

            {addressInfo.token?.circulating_market_cap &&
                addressInfo.token?.circulating_market_cap !== "0.0" && (
                    <div className="text-xs sm:text-lg font-bold tracking-wide pr-5 pl-5 mt-1 text-cyan-800 dark:text-cyan-600">
                        ${parseNumber(addressInfo.token?.circulating_market_cap)}
                        <span className="ml-1 text-cyan-950  dark:text-cyan-400/50 font-medium tracking-tight">
                            circ market cap
                        </span>
                    </div>
                )}

            {!addressInfo.is_contract && (
                <div className="flex justify-center items-center pr-5 pl-5 mt-2">
                    <p className="text-base sm:text-xl font-semibold text-cyan-800 dark:text-cyan-400 sm:ml-3 md:ml-6">
                        {addressInfo?.ens_domain_name ?? parseHash(addressInfo.hash)}
                    </p>
                    <button
                        onClick={() => handleCopy(addressInfo.hash, "address")}
                        className="sm:ml-3"
                    >
                        <DocumentDuplicateIcon className="w-4 h-4 text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-200" />
                    </button>
                    {copyStates["address"] && (
                        <span className="ml-2 text-xs font-semibold text-red-500">
                            Copied!
                        </span>
                    )}
                </div>
            )}

            {(Number(addressInfo?.coin_balance) > 1 ||
                addressInfo?.is_contract === false) && (
                    <div className="mt-1 text-cyan-950 dark:text-cyan-400">
                        ${parseWithER(addressInfo?.coin_balance, addressInfo?.exchange_rate)}{" "}
                        in {getNativeCurrency(chainId)}
                    </div>
                )}

            {addressInfo.is_contract && (
                <div className="flex items-center justify-center pr-5 pl-5 mt-1">
                    <p className="has-tooltip text-xs sm:text-base font-semibold sm:ml-3 md:ml-5 text-cyan-800 dark:text-cyan-400  tracking-wide">
                        <div className="tooltip -ml-10 dark:bg-black dark:text-white/80 dark:border dark:border-gray-100/30">{addressInfo.hash}</div>
                        {addressInfo?.ens_domain_name ?? parseHash(addressInfo.hash)}
                    </p>

                    <button
                        onClick={() => handleCopy(addressInfo.hash, "contractAddress")}
                        className="ml-1 sm:ml-3"
                    >
                        <DocumentDuplicateIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 hover:text-gray-400" />
                    </button>

                    {copyStates["contractAddress"] && (
                        <span className="ml-2 text-xs font-semibold text-red-500">
                            Copied!
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
