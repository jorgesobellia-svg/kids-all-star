import { Linking, Platform } from 'react-native';

// Suscripción Pelotín Plus.
// Los pagos van SOLO por Apple In-App Purchase y Google Play Billing, a través de RevenueCat
// (que valida los recibos y avisa si la suscripción sigue activa).
//
// Configuración (ver README):
//   EXPO_PUBLIC_RC_IOS_KEY, EXPO_PUBLIC_RC_ANDROID_KEY  -> claves públicas de RevenueCat
//   Entitlement en RevenueCat: "plus"
//   Productos en las tiendas: kas_plus_monthly (USD 4.99/mes) y kas_plus_annual (USD 39.99/año)
//   Offering "default" con los paquetes Monthly y Annual.
//
// Sin claves (o en la vista web) funciona en MODO DE PRUEBA: no cobra nada y simula la compra.

export const ENTITLEMENT = 'plus';
export const FALLBACK_PRICES = { monthly: 'USD 4.99', annual: 'USD 39.99' };

export type Plan = 'monthly' | 'annual';

const key = Platform.select({
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY,
  android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
  default: undefined,
});

export const TEST_MODE = !key || Platform.OS === 'web';

let Purchases: any = null;
let configured = false;

function rc() {
  if (TEST_MODE) return null;
  if (!Purchases) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Purchases = require('react-native-purchases').default;
  }
  return Purchases;
}

export async function initBilling(appUserId: string): Promise<boolean> {
  const P = rc();
  if (!P) return false;
  if (!configured) {
    P.configure({ apiKey: key, appUserID: appUserId });
    configured = true;
  }
  return isPlusActive();
}

export async function isPlusActive(): Promise<boolean> {
  const P = rc();
  if (!P) return false;
  try {
    const info = await P.getCustomerInfo();
    return !!info.entitlements.active[ENTITLEMENT];
  } catch {
    return false;
  }
}

export async function getPrices(): Promise<{ monthly: string; annual: string }> {
  const P = rc();
  if (!P) return FALLBACK_PRICES;
  try {
    const o = await P.getOfferings();
    return {
      monthly: o.current?.monthly?.product.priceString ?? FALLBACK_PRICES.monthly,
      annual: o.current?.annual?.product.priceString ?? FALLBACK_PRICES.annual,
    };
  } catch {
    return FALLBACK_PRICES;
  }
}

export type PurchaseResult = 'active' | 'cancelled' | 'error';

export async function purchase(plan: Plan): Promise<PurchaseResult> {
  const P = rc();
  if (!P) {
    // Modo de prueba: simula una compra correcta.
    await new Promise((r) => setTimeout(r, 400));
    return 'active';
  }
  try {
    const o = await P.getOfferings();
    const pkg = plan === 'annual' ? o.current?.annual : o.current?.monthly;
    if (!pkg) return 'error';
    const { customerInfo } = await P.purchasePackage(pkg);
    return customerInfo.entitlements.active[ENTITLEMENT] ? 'active' : 'error';
  } catch (e: unknown) {
    const err = e as { userCancelled?: boolean | null };
    return err?.userCancelled ? 'cancelled' : 'error';
  }
}

export async function restore(): Promise<boolean> {
  const P = rc();
  if (!P) return false;
  try {
    const info = await P.restorePurchases();
    return !!info.entitlements.active[ENTITLEMENT];
  } catch {
    return false;
  }
}

/** Abre la pantalla de la tienda para gestionar o cancelar la suscripción. */
export async function manageSubscription(): Promise<void> {
  const P = rc();
  if (P) {
    try {
      await P.showManageSubscriptions();
      return;
    } catch {
      // sigue con el enlace de la tienda
    }
  }
  const url = Platform.OS === 'android' ? 'https://play.google.com/store/account/subscriptions' : 'https://apps.apple.com/account/subscriptions';
  Linking.openURL(url).catch(() => {});
}
