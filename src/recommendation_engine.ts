import bundleCatalog from "../data/bundle_catalog.json";
import { guardrailNotes, shouldAvoidAha, type GuardrailFlags } from "./guardrails";
import { buildBundleCartPermalink } from "./shopify_cart";

export type SkinType = "droog" | "vet" | "gecombineerd" | "normaal" | "gevoelig";
export type Goal = "hydratatie" | "glans & balans" | "glow" | "vlekjes" | "anti-age" | "onzuiverheden" | "simpel";

export type UserProfile = {
  skinType?: SkinType;
  goal?: Goal;
  concerns?: string[];
  mentionsTextureOrDullness?: boolean;
  mentionsAcne?: boolean;
  asksSingleProduct?: boolean;
  flags?: GuardrailFlags;
};

export type Recommendation = {
  bundleName: string;
  bundleUrl: string;
  bundleDescription: string;
  benefits: string[];
  addOns: Array<{ name: string; url: string; reason: string }>;
  amPmOrder: { am: string; pm: string };
  cartPermalink: string | null;
  notes: string[];
};

const bundleMap = new Map((bundleCatalog as any).bundles.map((b: any) => [b.name, b]));

function pickBundle(profile: UserProfile): string {
  if (profile.goal === "anti-age") return "Firm & Smooth Skin Routine";
  if (profile.goal === "glow" || profile.goal === "vlekjes") return "Glow & Radiance Routine";
  if (profile.goal === "onzuiverheden") return "Clear & Balanced Skin Routine";
  if (profile.goal === "simpel") return "Simple Daily Skincare Routine";
  if (profile.skinType === "gevoelig") return "Sensitive & Reactive Skin Routine";
  if (profile.skinType === "droog") return "Dry & Dehydrated Skin Routine";
  if (profile.skinType === "vet") return "Clear & Balanced Skin Routine";
  if (profile.skinType === "gecombineerd") return "Combination Skin Balance Routine";
  return "Normal & Balanced Skin Routine";
}

export function recommend(profile: UserProfile): Recommendation {
  const bundleName = pickBundle(profile);
  const bundle = bundleMap.get(bundleName);
  if (!bundle) throw new Error(`Unknown bundle: ${bundleName}`);

  const addOns: Recommendation["addOns"] = [];

  if (profile.mentionsAcne || profile.concerns?.some((c) => /acne|puist|onzuiver/i.test(c))) {
    addOns.push({
      name: "Acne Spot Care",
      url: "https://sovahcare.com/products/acne-spot-care",
      reason: "Gericht product voor plaatselijk gebruik bij puistjes of onzuiverheden."
    });
  }

  const avoidAha = shouldAvoidAha(profile.flags ?? {});
  if (!avoidAha && (profile.mentionsTextureOrDullness || profile.concerns?.some((c) => /dof|textuur|ruw|pori|oneven|build-up|exfol/i.test(c)))) {
    addOns.push({
      name: "AHA Peeling Concentrate",
      url: "https://sovahcare.com/products/aha-peeling-concentrate",
      reason: "Kan helpen bij dofheid of textuur; begin rustig en doe eerst een patch test."
    });
  }

  return {
    bundleName,
    bundleUrl: bundle.url,
    bundleDescription: bundle.description,
    benefits: [
      "Bundle-first match op huidtype en hoofddoel.",
      "Gebalanceerde routine met producten die op elkaar aansluiten.",
      "Duidelijke AM/PM-opbouw zonder overbodige stappen."
    ],
    addOns: addOns.slice(0, 2),
    amPmOrder: {
      am: "Reinigen → behandelen/serum → hydrateren → SPF",
      pm: "Reinigen → behandelen/serum → nachtverzorging"
    },
    cartPermalink: buildBundleCartPermalink(bundleName),
    notes: guardrailNotes(profile.flags ?? {})
  };
}
