import cdf from "@stdlib/stats-base-dists-normal-cdf";
export const calc_call = (price, strike, sig, riskfree, expire) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire);
  const d2 = get_d2(d1, sig, expire);
  const d1Norm = cdf(d1, 0, 1);
  const d2Norm = cdf(d2, 0, 1);
  return price * d1Norm - strike * d2Norm * Math.exp(-riskfree * expire);
};

export const calc_put = (price, strike, sig, riskfree, expire) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire);
  const d2 = get_d2(d1, sig, expire);
  const d1Norm = cdf(0 - d1, 0, 1);
  const d2Norm = cdf(0 - d2, 0, 1);
  return strike * d2Norm * Math.exp(-riskfree * expire) - price * d1Norm;
};

export const calc_delta = (price, strike, sig, riskfree, expire) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire);
  const del = cdf(d1, 0, 1);
  return [del, del - 1];
};

export const calc_gamma = (price, strike, sig, riskfree, expire) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire);
  console.log(npdf(d1))
  return npdf(d1) / (price * sig * Math.sqrt(expire));
};

export const calc_theta = (price, strike, riskfree, sig, expire) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire);
  const d2 = get_d2(d1, sig, expire);
  const call =
    (1 / 365) *
    (-(((price * sig) / (2 * Math.sqrt(expire))) * npdf(d1)) -
      riskfree * strike * Math.exp(-riskfree * expire) * cdf(d2, 0, 1));
  const put =
    (1 / 365) *
    (-(((price * sig) / (2 * Math.sqrt(expire))) * npdf(d1)) +
      riskfree * strike * Math.exp(-riskfree * expire) * cdf(d2, 0, 1));
  return [call, put];
};

export const calc_vega = (price, expire, strike, riskfree, sig) => {
  const d1 = get_d1(price, strike, sig, riskfree, expire);
  return (price * Math.sqrt(expire) * npdf(d1)) / 100;
};

export const calc_rho = (strike, riskfree, price, sig, expire) => {
  const d2 = get_d2(get_d1(price, strike, sig, riskfree, expire), sig, expire);
  const call = (strike * expire * Math.exp(-riskfree * expire) * cdf(d2, 0, 1)) / 100;
  const put =
    (-strike * expire * Math.exp(-riskfree * expire) * cdf(-d2, 0, 1)) / 100;
  return [call, put];
};

export const get_greeks = (price, strike, sig, riskfree, expire) =>{
  const greeks = {
    "delta": calc_delta(price,strike,sig,riskfree,expire),
    "gamma": calc_gamma(price,strike,sig,riskfree,expire),
    "vega": calc_vega(price,expire,strike,riskfree,sig),
    "theta": calc_theta(price,strike,riskfree,sig,expire),
    "rho": calc_rho(strike,riskfree,price,sig,expire)
  }
  return greeks
}

export const get_d1 = (price, strike, sig, riskfree, expire) => {
  return (
    (Math.log(price / strike) + expire * (riskfree + sig ** 2 / 2)) /
    (sig * Math.sqrt(expire))
  );
};

export const get_d2 = (d1, sig, expire) => {
  return d1 - sig * Math.sqrt(expire);
};

export const npdf = (d1) => {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(d1 ** 2) / 2);
};
