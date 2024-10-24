import { BivariateCumulativeNormalDistributionWe04DP } from '@quantlib/ql'
import { defaultThetaPerDay } from '@quantlib/ql'
import cdf from '@stdlib/stats-base-dists-normal-cdf'
import { calc_call_bls, calc_put_bls } from './black_scholes'

const CBND = (a, b, rho) => {
    const bivariate = new BivariateCumulativeNormalDistributionWe04DP(rho)
    return bivariate.f(a, b)
}

export const calc_call_bs2002 = (price, strike, expire, riskfree, carry, vol) => {
    const call = calc_call_bls(price,strike, vol, riskfree, expire, riskfree - carry)
    if (carry >= riskfree) {
        return call
    }
    const t = 0.5 * (Math.sqrt(5) - 1) * expire
    const T = expire
    const v2 = vol ** 2

    const beta_inside = Math.abs((carry / v2 - 0.5) ** 2 + 2 * riskfree / v2)
    const beta = (0.5 - carry / v2) + Math.sqrt(beta_inside)
    const b_infinity = (beta / (beta - 1)) * strike
    const b_zero = Math.max(strike, (riskfree / (riskfree - carry)) * strike)

    const h_T = -(carry * T + 2 * vol * Math.sqrt(T)) * ((strike ** 2) / ((b_infinity - b_zero) * b_zero))
    const x_T = b_zero + (b_infinity - b_zero) * (1 - Math.exp(h_T))
    const h_t = -(carry * (T - t) + 2 * vol * Math.sqrt(T - t)) * ((strike ** 2) / ((b_infinity - b_zero) * b_zero))
    const x_t = b_zero + (b_infinity - b_zero) * (1 - Math.exp(h_t))
    let value;

    const alpha_T = (x_T - strike) * (x_T ** (-beta))
    const alpha_t = (x_t - strike) * (x_t ** (-beta))

    if (price >= x_T) {
        value = price - strike
    } else {
        value = (alpha_T * (price ** beta) - (alpha_T * calc_phi(price, t, beta, x_T, x_T, riskfree, carry, vol))
            + calc_phi(price, t, 1, x_T, x_T, riskfree, carry, vol) - calc_phi(price, t, 1, x_t, x_T, riskfree, carry, vol)
            - (strike * calc_phi(strike, t, 0, x_T, x_T, riskfree, carry, vol)) + (strike * calc_phi(strike, t, 0, x_t, x_T, riskfree, carry, vol))
            + (alpha_t * calc_phi(strike, t, beta, x_t, x_T, riskfree, carry, vol)) - (alpha_t * calc_psi(strike, expire, beta, x_t, x_T, x_t, t, carry, riskfree, vol))
            + calc_psi(price, expire, 1, x_t, x_T, x_t, t, carry, riskfree, vol) - calc_psi(strike, expire, 1, strike, x_T, x_t, t, carry, riskfree, vol)
            - (strike * calc_psi(strike, expire, 0, x_t, x_T, x_t, t, carry, riskfree, vol)) + (strike * calc_psi(strike, expire, 0, strike, x_T, x_t, t, carry, riskfree, vol))
        )
    }
    return Math.max(value,call)
}

export const calc_put_bs2002 = (price, strike, expire, riskfree, carry, vol) => {
    return calc_call_bs2002(strike, price, expire, riskfree - carry, carry, vol)
}

const calc_psi = (price, expire, gamma, h, x_T, x_t, t, carry, riskfree, vol) => {
    const v2 = vol ** 2
    const lambda = -riskfree + gamma * carry + 0.5 * gamma * (gamma - 1) * v2
    const kap = 2 * carry / v2 + (2 * gamma - 1)
    const tT = Math.sqrt(t / expire)
    const d_second = (carry + (gamma - 0.5) * v2)
    const dT_second = d_second * expire
    const dt_second = d_second * t
    const denom = vol * Math.sqrt(expire)

    const d1 = -(Math.log(price / x_t) + dt_second) / denom
    const d2 = -(Math.log((x_T ** 2) / (price * x_t)) + dt_second) / denom
    const d3 = -(Math.log(price / x_t) - dt_second) / denom
    const d4 = -(Math.log((x_T ** 2) / (price * x_t)) - dt_second) / denom
    const D1 = -(Math.log(price / h) + dT_second) / denom
    const D2 = -(Math.log((x_T ** 2) / (price * h)) + dT_second) / denom
    const D3 = -(Math.log((x_t ** 2) / (price * h)) + dT_second) / denom
    const D4 = -(Math.log((price * (x_t ** 2)) / (h * (x_t ** 2))) + dT_second) / denom

    const cof = Math.exp(lambda * expire) * (price ** gamma)
    const first_num = CBND(d1, D1, tT)
    const second_num = -((x_T / price) ** kap) * CBND(d2, D2, tT)
    const third_num = -((x_t / price) ** kap) * CBND(d3, D3, -tT)
    const fourth_num = ((x_t / x_T) ** kap) * CBND(d4, D4, -tT)

    return cof * (first_num + second_num + third_num + fourth_num)
}

const calc_phi = (price, expire, gamma, h, x_T, riskfree, carry, vol) => {
    const v2 = vol ** 2
    const lambda = -riskfree + gamma * carry + 0.5 * gamma * (gamma - 1) * v2
    const kap = 2 * carry / v2 + (2 * gamma - 1)

    const first_cof = Math.exp(lambda * expire) * (price ** gamma)
    const second_cof = (x_T / price) ** kap

    let first_norm = -(Math.log(price / h) + (carry + (gamma - 0.5) * v2) * expire) / (vol * Math.sqrt(expire))
    let second_norm = -(Math.log((x_T ** 2) / (price * h)) + (carry + (gamma - 0.5) * v2) * expire) / (vol * Math.sqrt(expire))
    first_norm = cdf(first_norm, 0, 1)
    second_norm = cdf(second_norm, 0, 1)

    return first_cof * (first_norm - second_cof * second_norm)
}

