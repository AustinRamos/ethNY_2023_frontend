// Import any other necessary dependencies
import { WideChevron } from '@hyperlane-xyz/widgets';
import { Spinner } from '../../components/animation/Spinner'; // You can import this if needed
import { Card } from '../../components/layout/Card';
import { useTokenRoutes } from '../tokens/routes/hooks';
import { BridgeTokenForm } from './BridgeTokenForm';

// Import any other necessary dependencies



function BridgeTokenCard() {
  const { tokenRoutes, isLoading, error: routesError } = useTokenRoutes();

  return (
    <Card classes="w-100 sm:w-[31rem] relative">
      <>
        <div className="absolute left-0 right-0 -top-32 xs:-top-24 flex justify-center overflow-hidden z-10">
          <WideChevron direction="s" height="100%" width="100" rounded={true} />
        </div>
        <div className="relative flex items-start justify-between z-20">
          <h2 className="pl-0.5 text-lg">Bridge from Polygon to Arbitrum</h2>
          {/* Render a button with your desired text and style */}
          {/* { <IconButton
            imgSrc={GearIcon} // If you have a gear icon, provide its source here
            width={20}
            height={20}
            title="Settings"
            classes="hover:rotate-90"
          /> } */}
        </div>
        {<BridgeTokenForm />}

        {isLoading && (
          <div className="my-24 flex flex-col items-center">
            <Spinner />
            <h3 className="mt-5 text-sm text-gray-500">Finding token routes</h3>
          </div>
        )}
        {routesError && (
          <div className="my-32 flex flex-col items-center text-center">
            <h3 className="text-red-500">Error searching for token routes.</h3>
            <div className="mt-3 text-sm text-red-500">
              Please ensure chain and token configs are valid.
            </div>
            <div className="mt-4 text-xs text-gray-500">{routesError.toString()}</div>
          </div>
        )}
      </>
    </Card>
  );
}

export default BridgeTokenCard;