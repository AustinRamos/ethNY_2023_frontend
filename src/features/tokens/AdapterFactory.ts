import {
  EvmHypCollateralAdapter,
  EvmHypSyntheticAdapter,
  EvmNativeTokenAdapter,
  EvmTokenAdapter,
  IHypTokenAdapter,
  SealevelHypCollateralAdapter,
  SealevelHypNativeAdapter,
  SealevelHypSyntheticAdapter,
  SealevelNativeTokenAdapter,
  SealevelTokenAdapter,
} from '@hyperlane-xyz/hyperlane-token';
import { ChainName, MultiProtocolProvider } from '@hyperlane-xyz/sdk';
import { Address, ProtocolType, convertToProtocolAddress } from '@hyperlane-xyz/utils';

import { parseCaip2Id } from '../caip/chains';
import { AssetNamespace, getChainIdFromToken, isNativeToken, parseCaip19Id } from '../caip/tokens';
import { getMultiProvider } from '../multiProvider';

import { Route } from './routes/types';
import {
  isRouteFromCollateral,
  isRouteFromSynthetic,
  isRouteToCollateral,
  isRouteToSynthetic,
} from './routes/utils';

export class AdapterFactory {
  static TokenAdapterFromAddress(tokenCaip19Id: TokenCaip19Id) {
    const { address, chainCaip2Id } = parseCaip19Id(tokenCaip19Id);
    const { protocol, reference: chainId } = parseCaip2Id(chainCaip2Id);
    const multiProvider = getMultiProvider();
    const chainName = multiProvider.getChainMetadata(chainId).name;
    if (protocol == ProtocolType.Ethereum) {
      return isNativeToken(tokenCaip19Id)
        ? new EvmNativeTokenAdapter(chainName, multiProvider, {})
        : new EvmTokenAdapter(chainName, multiProvider, { token: address });
    } else if (protocol === ProtocolType.Sealevel) {
      return isNativeToken(tokenCaip19Id)
        ? new SealevelNativeTokenAdapter(chainName, multiProvider, {})
        : new SealevelTokenAdapter(chainName, multiProvider, { token: address });
    } else {
      throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }

  static HypCollateralAdapterFromAddress(baseTokenCaip19Id: TokenCaip19Id, routerAddress: Address) {
    return AdapterFactory.selectHypAdapter(
      getChainIdFromToken(baseTokenCaip19Id),
      routerAddress,
      baseTokenCaip19Id,
      EvmHypCollateralAdapter,
      isNativeToken(baseTokenCaip19Id) ? SealevelHypNativeAdapter : SealevelHypCollateralAdapter,
    );
  }

  static HypSyntheticTokenAdapterFromAddress(
    baseTokenCaip19Id: TokenCaip19Id,
    chainCaip2Id: ChainCaip2Id,
    routerAddress: Address,
  ) {
    return AdapterFactory.selectHypAdapter(
      chainCaip2Id,
      routerAddress,
      baseTokenCaip19Id,
      EvmHypSyntheticAdapter,
      SealevelHypSyntheticAdapter,
    );
  }

  static HypTokenAdapterFromRouteOrigin(route: Route) {
    const { type, originCaip2Id, originRouterAddress, baseTokenCaip19Id } = route;
    if (isRouteFromCollateral(route)) {
      return AdapterFactory.selectHypAdapter(
        originCaip2Id,
        originRouterAddress,
        baseTokenCaip19Id,
        EvmHypCollateralAdapter,
        isNativeToken(baseTokenCaip19Id) ? SealevelHypNativeAdapter : SealevelHypCollateralAdapter,
      );
    } else if (isRouteFromSynthetic(route)) {
      return AdapterFactory.selectHypAdapter(
        originCaip2Id,
        originRouterAddress,
        baseTokenCaip19Id,
        EvmHypSyntheticAdapter,
        SealevelHypSyntheticAdapter,
      );
    } else {
      throw new Error(`Unsupported route type: ${type}`);
    }
  }

  static HypTokenAdapterFromRouteDest(route: Route) {
    const { type, destCaip2Id, destRouterAddress, destTokenCaip19Id, baseTokenCaip19Id } = route;
    const tokenCaip19Id = destTokenCaip19Id || baseTokenCaip19Id;
    if (isRouteToCollateral(route)) {
      return AdapterFactory.selectHypAdapter(
        destCaip2Id,
        destRouterAddress,
        tokenCaip19Id,
        EvmHypCollateralAdapter,
        isNativeToken(tokenCaip19Id) ? SealevelHypNativeAdapter : SealevelHypCollateralAdapter,
      );
    } else if (isRouteToSynthetic(route)) {
      return AdapterFactory.selectHypAdapter(
        destCaip2Id,
        destRouterAddress,
        tokenCaip19Id,
        EvmHypSyntheticAdapter,
        SealevelHypSyntheticAdapter,
      );
    } else {
      throw new Error(`Unsupported route type: ${type}`);
    }
  }

  protected static selectHypAdapter(
    chainCaip2Id: ChainCaip2Id,
    routerAddress: Address,
    baseTokenCaip19Id: TokenCaip19Id,
    EvmAdapter: new (
      chainName: ChainName,
      mp: MultiProtocolProvider,
      addresses: { token: Address },
    ) => IHypTokenAdapter,
    SealevelAdapter: new (
      chainName: ChainName,
      mp: MultiProtocolProvider,
      addresses: { token: Address; warpRouter: Address; mailbox: Address },
      isSpl2022?: boolean,
    ) => IHypTokenAdapter,
  ) {
    const { protocol, reference: chainId } = parseCaip2Id(chainCaip2Id);
    const { address: baseTokenAddress, namespace } = parseCaip19Id(baseTokenCaip19Id);
    const multiProvider = getMultiProvider();
    const { name: chainName, mailbox } = multiProvider.getChainMetadata(chainId);
    if (protocol == ProtocolType.Ethereum) {
      return new EvmAdapter(chainName, multiProvider, {
        token: convertToProtocolAddress(routerAddress, protocol),
      });
    } else if (protocol === ProtocolType.Sealevel) {
      if (!mailbox) throw new Error('Mailbox address required for sealevel hyp adapter');
      return new SealevelAdapter(
        chainName,
        multiProvider,
        {
          token: convertToProtocolAddress(baseTokenAddress, protocol),
          warpRouter: convertToProtocolAddress(routerAddress, protocol),
          mailbox,
        },
        namespace === AssetNamespace.spl2022,
      );
    } else {
      throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }
}
