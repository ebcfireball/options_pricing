import cdf from "@stdlib/stats-base-dists-normal-cdf";

export const calc_call_bls = (price, strike, sig, riskfree, expire, dividend) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire,dividend);
  const d2 = get_d2(d1, sig, expire);
  const d1Norm = cdf(d1, 0, 1);
  const d2Norm = cdf(d2, 0, 1);
  return price * Math.exp(-dividend * expire) * d1Norm - strike * d2Norm * Math.exp(-riskfree * expire);
};

export const calc_put_bls = (price, strike, sig, riskfree, expire, dividend) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire, dividend);
  const d2 = get_d2(d1, sig, expire);
  const d1Norm = cdf(0 - d1, 0, 1);
  const d2Norm = cdf(0 - d2, 0, 1);
  return strike * d2Norm * Math.exp(-riskfree * expire) - price * (Math.exp(-dividend * expire)) * d1Norm;
};

export const calc_delta = (price, strike, sig, riskfree, expire, dividend) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire, dividend);
  const del = cdf(d1, 0, 1);
  return [Math.exp(-dividend * expire) * del, Math.exp(-dividend * expire) * (del - 1)];
};

export const calc_gamma = (price, strike, sig, riskfree, expire, dividend) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire, dividend);
  return (npdf(d1) * Math.exp(-dividend * expire)) / (price * sig * Math.sqrt(expire));
};

export const calc_theta = (price, strike, riskfree, sig, expire, dividend) => {
  const div2 = Math.exp(-dividend * expire)
  const d1 = get_d1(price, strike, sig, riskfree, expire, dividend);
  const d2 = get_d2(d1, sig, expire);
  const call =
    (1 / 365) *
    (-(((price * sig * div2) / (2 * Math.sqrt(expire))) * npdf(d1)) -
      riskfree * strike * Math.exp(-riskfree * expire) * cdf(d2, 0, 1)
      + dividend * price * div2 * cdf(d1, 0, 1)
    );
  const put =
    (1 / 365) *
    (-(((price * sig * div2) / (2 * Math.sqrt(expire))) * npdf(d1)) +
      riskfree * strike * Math.exp(-riskfree * expire) * cdf(d2, 0, 1)
      - dividend * price * div2 * cdf(-d1, 0, 1)
    );
  return [call, put];
};

export const calc_vega = (price, expire, strike, riskfree, sig, dividend) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire, dividend);
  return (price *(Math.exp(-dividend*expire))* Math.sqrt(expire) * npdf(d1)) / 100;
};

export const calc_rho = (strike, riskfree, price, sig, expire, dividend) => {
  const d2 = get_d2(get_d1(price, strike, sig, riskfree, expire, dividend), sig, expire);
  const call = (strike * expire * Math.exp(-riskfree * expire) * cdf(d2, 0, 1)) / 100;
  const put =
    (-strike * expire * Math.exp(-riskfree * expire) * cdf(-d2, 0, 1)) / 100;
  return [call, put];
};

export const get_greeks_bls = (price, strike, sig, riskfree, expire, dividend) => {
  const greeks = {
    "delta": calc_delta(price, strike, sig, riskfree, expire, dividend),
    "gamma": calc_gamma(price, strike, sig, riskfree, expire, dividend),
    "vega": calc_vega(price, expire, strike, riskfree, sig, dividend),
    "theta": calc_theta(price, strike, riskfree, sig, expire, dividend),
    "rho": calc_rho(strike, riskfree, price, sig, expire, dividend)
  }
  return greeks
}

export const get_d1 = (price, strike, sig, riskfree, expire, dividend) => {
  const res = (
    (Math.log(price / strike) + expire * (riskfree - dividend + sig ** 2 / 2)) /
    (sig * Math.sqrt(expire))
  );
  return res
};

export const get_d2 = (d1, sig, expire) => {
  return d1 - sig * Math.sqrt(expire);
};

export const npdf = (d1) => {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(d1 ** 2) / 2);
};
