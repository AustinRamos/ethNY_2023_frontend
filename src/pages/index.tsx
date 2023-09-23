import type { NextPage } from 'next';

import { TipCard } from '../components/tip/TipCard';
import BridgeWalletCard from "../features/transfer/BridgeWalletCard";
import { TransferTokenCard } from '../features/transfer/TransferTokenCard';

const Home: NextPage = () => {
  return (
    <div className="space-y-2">
      <TipCard />
      <BridgeWalletCard></BridgeWalletCard>
      { <TransferTokenCard /> }
    </div>
  );
};

export default Home;
