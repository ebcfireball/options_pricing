"use client";
import {
    calc_call_bls,
    calc_put_bls,
    get_greeks_bls,
} from "../../utils/black_scholes";
import { useState, useEffect } from "react";
import HeatMap from "./heatmap";

export default function BlackScholes() {
    const [type, setType] = useState("call");
    const [price, setPrice] = useState(100);
    const [strike, setStrike] = useState(100);
    const [sig, setSig] = useState(0.2);
    const [riskf, setRiskf] = useState(0.05);
    const [expire, setExpire] = useState(12);
    const [greeks, setGreeks] = useState(
        get_greeks_bls(price, strike, sig, riskf, expire / 12)
    );
    const [dividend, setDividend] = useState(0);
    const get_call = () =>
        calc_call_bls(price, strike, sig, riskf, expire / 12, dividend);
    const get_put = () =>
        calc_put_bls(price, strike, sig, riskf, expire / 12, dividend);
    const [call, setCall] = useState(get_call());
    const [put, setPut] = useState(get_put());
    const reinitialize = () => {
        setCall(get_call());
        setPut(get_put());
        setGreeks(
            get_greeks_bls(price, strike, sig, riskf, expire / 12, dividend)
        );
    };

    useEffect(() => {
        reinitialize();
    }, [price, strike, sig, riskf, expire, dividend]);
    return (
        <>
            <div className="mx-auto my-6 text-3xl font-bold">
                Black Scholes Model
            </div>
            <div className="flex-col flex sm:flex-row gap-10">
                <div className="flex flex-col gap-2 place-content-evenly font-semibold">
                    <div className="gap-2 flex-col flex">
                        <p>Stock Price</p>
                        <input
                            className="p-1 rounded text-center border-[1px] border-black hover:border-blue-300 transition-all duration-500"
                            onChange={(e) => {
                                setPrice(e.target.value);
                            }}
                            type="number"
                            name="price"
                            id=""
                            value={price}
                        />
                    </div>
                    <div className="gap-2 flex-col flex">
                        <p>Strike Price</p>
                        <input
                            className="p-1 rounded text-center border-[1px] border-black hover:border-blue-300 transition-all duration-500"
                            onChange={(e) => {
                                setStrike(e.target.value);
                            }}
                            type="number"
                            name="strike"
                            id=""
                            value={strike}
                        />
                    </div>
                    <div className="gap-2 flex-col flex">
                        <p>Volatility(sigma)</p>
                        <input
                            className="p-1 rounded text-center border-[1px] border-black hover:border-blue-300 transition-all duration-500"
                            onChange={(e) => {
                                setSig(e.target.value);
                            }}
                            type="number"
                            name="volatility"
                            id=""
                            value={sig}
                        />
                    </div>
                    <div className="gap-2 flex-col flex">
                        <p>Risk Free Rate</p>
                        <input
                            className="p-1 rounded text-center border-[1px] border-black hover:border-blue-300 transition-all duration-500"
                            onChange={(e) => {
                                setRiskf(e.target.value);
                            }}
                            type="number"
                            name="risk free"
                            id=""
                            value={riskf}
                        />
                    </div>
                    <div className="gap-2 flex-col flex">
                        <p>Time To Maturity</p>
                        <input
                            className="p-1 rounded text-center border-[1px] border-black hover:border-blue-300 transition-all duration-500"
                            onChange={(e) => {
                                setExpire(e.target.value);
                            }}
                            type="number"
                            name="expire"
                            id=""
                            value={expire}
                        />
                    </div>
                    <div className="gap-2 flex-col flex">
                        <p>Dividend</p>
                        <input
                            className="p-1 rounded text-center border-[1px] border-black hover:border-blue-300 transition-all duration-500"
                            onChange={(e) => {
                                setDividend(e.target.value);
                            }}
                            type="number"
                            name="dividend"
                            id=""
                            value={dividend}
                        />
                    </div>
                </div>
                <div className="flex flex-col place-content-evenly gap-2  w-full">
                    <div className="flex gap-2 place-content-evenly">
                        <button
                            className={`${
                                type == "call"
                                    ? "shadow-md shadow-green-400"
                                    : ""
                            }`}
                            onClick={() => setType("call")}
                        >
                            Call
                        </button>
                        <button
                            className={`${
                                type == "put" ? "shadow-md shadow-red-400" : ""
                            }`}
                            onClick={() => setType("put")}
                        >
                            Put
                        </button>
                    </div>
                    <div
                        className={`${
                            type == "call" ? "flex flex-col" : "hidden"
                        } p-4 bg-gradient-to-r from-green-400 to-green-700 max-w-[250px] rounded-lg text-black font-semibold hover:p-6 transition-all duration-500 min-w-[150px]`}
                    >
                        <p className="mb-2 text-lg font-bold ">
                            Call Price: {call.toFixed(2)}
                        </p>
                        <div className="grid gap-1">
                            <p>Delta: {greeks["delta"][0].toFixed(2)}</p>
                            <p>Gamma: {greeks["gamma"].toFixed(4)}</p>
                            <p>Theta: {greeks["theta"][0].toFixed(3)}</p>
                            <p>Vega: {greeks["vega"].toFixed(2)}</p>
                            <p>Rho: {greeks["rho"][0].toFixed(2)}</p>
                        </div>
                    </div>
                    <div
                        className={`${
                            type == "put" ? "flex flex-col" : "hidden"
                        } p-4 bg-gradient-to-r from-red-400 to-red-700 rounded-lg text-black max-w-[250px] font-semibold hover:p-6 transition-all duration-500 min-w-[150px]`}
                    >
                        <p className="mb-2 font-bold text-lg">
                            Put Price: {put.toFixed(2)}
                        </p>
                        <div className="grid gap-1">
                            <p>Delta: {greeks["delta"][1].toFixed(2)}</p>
                            <p>Gamma: {greeks["gamma"].toFixed(4)}</p>
                            <p>Theta: {greeks["theta"][1].toFixed(3)}</p>
                            <p>Vega: {greeks["vega"].toFixed(2)}</p>
                            <p>Rho: {greeks["rho"][1].toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <HeatMap
                    data={{
                        price: price,
                        strike: strike,
                        expire: expire,
                        dividend: dividend,
                        vol: sig,
                        riskfree: riskf,
                        type: type,
                        model: "bls",
                    }}
                />
            </div>
        </>
    );
}
