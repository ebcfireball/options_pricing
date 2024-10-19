"use client";
import { useState, useEffect} from "react";
import "./App.css";
import { calc_call, calc_put, get_greeks} from "../utils/pricing";

function App() {
  const [price,setPrice] = useState(100)
  const [strike, setStrike] = useState(100)
  const [sig, setSig] = useState(.2)
  const [riskf, setRiskf] = useState(.05)
  const [expire, setExpire] = useState(12)
  const [greeks, setGreeks] = useState(get_greeks(price,strike,sig,riskf,expire))
  const get_call = () => calc_call(price, strike, sig, riskf, expire / 12);
  const get_put = () => calc_put(price, strike, sig, riskf, expire / 12);
  const [call, setCall] = useState(get_call())
  const [put, setPut] = useState(get_put())
  const reinitialize = () => {
    setCall(get_call())
    setPut(get_put())
    setGreeks(get_greeks(price,strike,sig,riskf,expire))
  };
  useEffect(()=>{
    reinitialize()
  },[price,strike,sig,riskf,expire])
  return (
    <>
      <div className="mx-auto my-6">Black Scholes Options Pricing</div>
      <table className="mx-auto">
        <thead>
          <tr>
            <th className="border p-2">Stock Price</th>
            <th className="border p-2">Strike Price</th>
            <th className="border p-2">Volatility(sigma)</th>
            <th className="border p-2">Risk Free Rate</th>
            <th className="border p-2">Time To Maturity(months)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                onChange={(e) => {
                  setPrice(e.target.value) 
                }}
                type="number"
                name="Price"
                id=""
                placeholder="Stock Price"
                value={price}
              />
            </td>
            <td>
              <input
                onChange={(e) => {
                  setStrike(e.target.value)
                }}
                type="number"
                name="Strike"
                value={strike}
                id=""
                placeholder="Strike Price"
              />
            </td>
            <td>
              <input
                onChange={(e) => {
                  setSig(e.target.value)
                }}
                type="number"
                name="Volatility"
                value={sig}
                id=""
                placeholder="Volatility"
              />
            </td>
            <td>
              <input
                onChange={(e) => {
                  setRiskf(e.target.value)
                }}
                type="number"
                value={riskf}
                name="RiskFree"
                id=""
                placeholder="Risk Free Rate"
              />
            </td>
            <td>
              <input
                onChange={(e) => {
                  setExpire(e.target.value)
                }}
                type="number"
                name="TTM"
                value={expire}
                id=""
                placeholder="Time to Expire(months)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-around m-20">
        <div>
          <p className="m-6">Call Price: {call.toFixed(2)}</p>
          <div className="grid grid-cols-5 gap-2">
            <p>Delta: {greeks["delta"][0].toFixed(2)}</p>
            <p>Gamma: {greeks["gamma"].toFixed(4)}</p>
            <p>Theta: {greeks["theta"][0].toFixed(3)}</p>
            <p>Vega: {greeks["vega"].toFixed(2)}</p>
            <p>Rho: {greeks["rho"][0].toFixed(2)}</p>
          </div>
        </div>
        <div>
          <p className="m-6">Put Price: {put.toFixed(2)}</p>
          <div className="grid grid-cols-5 gap-2">
            <p>Delta: {greeks["delta"][1].toFixed(2)}</p>
            <p>Gamma: {greeks["gamma"].toFixed(4)}</p>
            <p>Theta: {greeks["theta"][1].toFixed(3)}</p>
            <p>Vega: {greeks["vega"].toFixed(2)}</p>
            <p>Rho: {greeks["rho"][1].toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
