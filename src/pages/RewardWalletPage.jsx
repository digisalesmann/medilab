import React, { useEffect, useState } from 'react';
import { FaGift, FaCoins, FaShoppingCart } from 'react-icons/fa';
import { Card, CardContent } from '../components/ui/card'; // You can replace with your design system if not using shadcn
import { formatDistanceToNow } from 'date-fns';

export default function RewardWallet() {
  const [points, setPoints] = useState(0);
  const [redeemed, setRedeemed] = useState([]);

  useEffect(() => {
    const storedPoints = Number(localStorage.getItem('rewardPoints')) || 0;
    const storedRedeemed = JSON.parse(localStorage.getItem('rewardRedeemed') || '[]');

    setPoints(storedPoints);
    setRedeemed(storedRedeemed);
  }, []);

  const handleRedeem = (item) => {
    if (points < item.cost) return alert("Not enough points");

    const newPoints = points - item.cost;
    const redemption = { ...item, redeemedAt: new Date().toISOString() };

    const updatedRedeemed = [redemption, ...redeemed];
    localStorage.setItem('rewardPoints', newPoints);
    localStorage.setItem('rewardRedeemed', JSON.stringify(updatedRedeemed));

    setPoints(newPoints);
    setRedeemed(updatedRedeemed);
  };

  const sampleRewards = [
    { id: 1, name: "Free Delivery", cost: 50 },
    { id: 2, name: "10% Discount", cost: 75 },
    { id: 3, name: "₦500 Voucher", cost: 100 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white pt-24 pb-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-700 mb-2">Your Reward Wallet</h1>
          <p className="text-gray-600">Earn and redeem points for exclusive perks and discounts</p>
        </div>

        {/* Points Summary */}
        <Card className="bg-white shadow-md rounded-xl p-6 text-center">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <FaCoins className="text-yellow-500 text-4xl mb-2" />
              <h2 className="text-2xl font-semibold">{points} Points</h2>
              <p className="text-sm text-gray-500">Available Balance</p>
            </div>
          </CardContent>
        </Card>

        {/* Redeemable Rewards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-emerald-700">Redeem Your Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleRewards.map((reward) => (
              <Card key={reward.id} className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between">
                <CardContent>
                  <div className="text-center">
                    <FaGift className="text-pink-500 text-3xl mx-auto mb-2" />
                    <h3 className="text-lg font-semibold mb-1">{reward.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Cost: {reward.cost} pts</p>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={points < reward.cost}
                      className={`w-full py-2 rounded font-semibold transition ${
                        points >= reward.cost ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Redeem
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* History */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-emerald-700">Redemption History</h2>
          {redeemed.length === 0 ? (
            <p className="text-gray-500">No redemptions yet.</p>
          ) : (
            <ul className="space-y-4">
              {redeemed.map((item, idx) => (
                <li key={idx} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                  <FaShoppingCart className="text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Redeemed {formatDistanceToNow(new Date(item.redeemedAt), { addSuffix: true })} — Cost: {item.cost} pts
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
