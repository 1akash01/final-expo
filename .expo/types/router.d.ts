/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/../features/profile/PartnerCommission`; params?: Router.UnknownInputParams; } | { pathname: `/../features/dealer/MemberTierScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../features/profile/WalletLinkedPages`; params?: Router.UnknownInputParams; } | { pathname: `/../features/electrician/ElectricianTierScreen`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/../features/profile/PartnerCommission`; params?: Router.UnknownOutputParams; } | { pathname: `/../features/dealer/MemberTierScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/../features/profile/WalletLinkedPages`; params?: Router.UnknownOutputParams; } | { pathname: `/../features/electrician/ElectricianTierScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/../features/profile/PartnerCommission${`?${string}` | `#${string}` | ''}` | `/../features/dealer/MemberTierScreen${`?${string}` | `#${string}` | ''}` | `/../features/profile/WalletLinkedPages${`?${string}` | `#${string}` | ''}` | `/../features/electrician/ElectricianTierScreen${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/../features/profile/PartnerCommission`; params?: Router.UnknownInputParams; } | { pathname: `/../features/dealer/MemberTierScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../features/profile/WalletLinkedPages`; params?: Router.UnknownInputParams; } | { pathname: `/../features/electrician/ElectricianTierScreen`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
