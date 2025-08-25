import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { rewardsService } from "../lib/rewards/service";

const RewardsCtx = createContext(null);
export const useRewards = () => useContext(RewardsCtx);

export function RewardsProvider({ children }) {
  const [user, setUser] = useState(rewardsService.getUser());
  const [txns, setTxns] = useState(rewardsService.getTxns());
  const [vouchers, setVouchers] = useState(rewardsService.getVouchers());
  const [missions, setMissions] = useState(rewardsService.getMissions());
  const [catalog, setCatalog] = useState(rewardsService.getCatalog());
  const tiers = rewardsService.getTiers();

  // Simple “reloads” after each operation
  const refresh = () => {
    setUser(rewardsService.getUser());
    setTxns(rewardsService.getTxns());
    setVouchers(rewardsService.getVouchers());
    setMissions(rewardsService.getMissions());
    setCatalog(rewardsService.getCatalog());
  };

  const value = useMemo(() => ({
  user, txns, vouchers, missions, catalog, tiers,
  earn: (...args) => { rewardsService.earn(...args); refresh(); },
  redeem: (id) => { const v = rewardsService.redeem(id); refresh(); return v; },
  markVoucherUsed: (c) => { rewardsService.markVoucherUsed(c); refresh(); },
  dailyCheckIn: () => { rewardsService.dailyCheckIn(); refresh(); },
  completeMission: (id) => { rewardsService.completeMission(id); refresh(); },
  canDailyCheckIn: () => rewardsService.canDailyCheckIn(),
  refresh,
}), [user, txns, vouchers, missions, catalog, tiers]);


  useEffect(() => { refresh(); }, []); // ensure up-to-date

  return <RewardsCtx.Provider value={value}>{children}</RewardsCtx.Provider>;
}