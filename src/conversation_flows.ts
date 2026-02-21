import { recommend, type UserProfile } from "./recommendation_engine";

export const widgetStart = {
  welcome:
    "Hi! Ik ben de SOVAH skincare assistant. Vertel me kort wat je huid nodig heeft, dan match ik je met de beste routine (of product). Pure care. True beauty.",
  quickReplies: [
    "Welke routine past bij mij?",
    "Ik heb last van onzuiverheden",
    "Ik wil meer glow"
  ]
};

export function handleQuickReply(reply: string): string {
  if (reply === "Welke routine past bij mij?") {
    return "Top! Wat is je huidtype (droog, vet, gecombineerd, normaal of gevoelig)? En wat is je belangrijkste doel (hydratatie, glow, anti-age, onzuiverheden, vlekjes of simpel)?";
  }

  if (reply === "Ik heb last van onzuiverheden") {
    return "Is je huid vooral vet, gecombineerd of gevoelig?";
  }

  if (reply === "Ik wil meer glow") {
    return "Is je huid eerder droog, vet, gecombineerd of gevoelig?";
  }

  return "Vertel me kort je huidtype en doel, dan maak ik direct een passende routine.";
}

export function formatRecommendation(profile: UserProfile): string {
  const rec = recommend(profile);

  const addOnBlock = rec.addOns.length
    ? rec.addOns.map((a) => `• ${a.name}: ${a.reason} (${a.url})`).join("\n")
    : "Geen add-ons nodig op dit moment.";

  return [
    `Dit past goed bij je huiddoel: ${rec.bundleName}.`,
    `Bundle: ${rec.bundleName} (${rec.bundleUrl})`,
    rec.bundleDescription,
    `Voordelen: ${rec.benefits.join(" ")}`,
    `Add-ons:\n${addOnBlock}`,
    `AM: ${rec.amPmOrder.am}`,
    `PM: ${rec.amPmOrder.pm}`,
    rec.cartPermalink ? `Direct toevoegen: ${rec.cartPermalink}` : "",
    "Zal ik dit direct voor je in de winkelwagen zetten?"
  ]
    .filter(Boolean)
    .join("\n\n");
}
