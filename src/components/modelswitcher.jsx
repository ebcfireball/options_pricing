"use client";
import Bjerksund2002 from "./bjerksund2002";
import BlackScholes from "./black_scholes";
import { useState } from "react";

export default function ModelSwitcher() {
    const [model, setModel] = useState('bls')
    return (
        <div>
            <div className="flex gap-2 place-content-evenly mt-4">
                <button onClick={()=>{setModel('bls')}}>Black Scholes</button>
                <button onClick={()=>{setModel('bs2002')}}>Bjerksund Stensland 2002</button>
            </div>
            <div>
                {model=='bls'?<BlackScholes />:<Bjerksund2002 />}
            </div>
        </div>
    );
}
