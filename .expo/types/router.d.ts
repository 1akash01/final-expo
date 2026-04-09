/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/../shared/components/TestimonialShowcase`; params?: Router.UnknownInputParams; } | { pathname: `/../features/electrician/RewardsScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../features/electrician/ScanScreen`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/../shared/components/TestimonialShowcase`; params?: Router.UnknownOutputParams; } | { pathname: `/../features/electrician/RewardsScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/../features/electrician/ScanScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/../shared/components/TestimonialShowcase${`?${string}` | `#${string}` | ''}` | `/../features/electrician/RewardsScreen${`?${string}` | `#${string}` | ''}` | `/../features/electrician/ScanScreen${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/../shared/components/TestimonialShowcase`; params?: Router.UnknownInputParams; } | { pathname: `/../features/electrician/RewardsScreen`; params?: Router.UnknownInputParams; } | { pathname: `/../features/electrician/ScanScreen`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
