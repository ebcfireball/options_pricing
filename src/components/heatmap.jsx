import { calc_call_bls, calc_put_bls } from "../../utils/black_scholes";
import { calc_call_bs2002, calc_put_bs2002 } from "../../utils/bjerksund2002";

export default function HeatMap({ data }) {
    const { price, strike, expire, dividend, vol, riskfree, type, model } =
        data;
    const x_lower = price - 20;
    const y_lower = vol - 0.1;
    const x_step = 4;
    const y_step = 0.02;
    const x_values = [];
    for (let i = 0; i < 10; i++) {
        x_values.push(x_lower + x_step * i);
    }
    const values = [];
    for (let i = 0; i < 10; i++) {
        values.push(y_lower + (10 - i) * y_step);
        for (let j = 0; j < 10; j++) {
            if (model == "bls") {
                if (type == "call") {
                    values.push(
                        calc_call_bls(
                            x_lower + x_step * j,
                            strike,
                            y_lower + (10 - i) * y_step,
                            riskfree,
                            expire / 12,
                            dividend
                        )
                    );
                } else {
                    values.push(
                        calc_put_bls(
                            x_lower + x_step * j,
                            strike,
                            y_lower + (10 - i) * y_step,
                            riskfree,
                            expire / 12,
                            dividend
                        )
                    );
                }
            } else {
                if (type == "call") {
                    values.push(
                        calc_call_bs2002(
                            x_lower + x_step * j,
                            strike,
                            expire / 12,
                            riskfree,
                            dividend,
                            y_lower + (10 - i) * y_step
                        )
                    );
                } else {
                    console.log(
                        calc_put_bs2002(
                            80,
                            strike,
                            expire / 12,
                            riskfree,
                            dividend,
                            0.14
                        )
                    );
                    console.log(
                        calc_put_bls(
                            80,
                            strike,
                            0.12,
                            riskfree,
                            expire / 12,
                            dividend
                        )
                    );
                    values.push(
                        calc_put_bs2002(
                            x_lower + x_step * j,
                            strike,
                            expire / 12,
                            riskfree,
                            dividend,
                            y_lower + (10 - i) * y_step
                        )
                    );
                }
            }
        }
    }
    const filti = values.filter((val, ind) => ind % 11 != 0);
    const mini = Math.min(...filti);
    const maxi = Math.max(...filti);
    const diffi = maxi - mini;
    const get_rgb = (val) => {
        const diffper = (val - mini) / diffi;
        return {
            backgroundColor: `rgb(${250 * (1 - diffper)},${250 * diffper},0)`,
        };
    };
    return (
        <>
            <div className="flex flex-col ">
                <p className="text-xl my-2 font-semibold">
                    {type == "call" ? "Call" : "Put"}
                </p>
                <div className="grid grid-cols-11 text-sm h-[500px] w-[550px]">
                    {values.map((val, ind) => (
                        <div
                            style={ind % 11 == 0 ? {} : get_rgb(val)}
                            className={`place-content-center ${
                                ind % 11 == 0 ? "text-blue-400" : "text-white"
                            }`}
                            key={ind}
                        >
                            {val.toFixed(2)}
                        </div>
                    ))}
                    <div></div>
                    {x_values.map((val, ind) => (
                        <div
                            className="place-content-center text-blue-400"
                            key={ind}
                        >
                            {val}
                        </div>
                    ))}
                </div>
                <p className="text-lg font-semibold text-yellow-200">
                    Vertical Axis(Y): Volatility{" "}
                    <span className="text-green-300">
                        Horizontal(Y):Spot Price
                    </span>
                </p>
            </div>
            <div className="flex flex-col my-auto">
                <p>{mini.toFixed(2)}</p>
                <div className="bg-gradient-to-t from-[rgb(0,250,0)] to-[rgb(250,0,0)] h-[200px] w-[30px]"></div>
                <p>{maxi.toFixed(2)}</p>
            </div>
        </>
    );
}
