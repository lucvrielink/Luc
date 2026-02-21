export type GuardrailFlags = {
  isTeen?: boolean;
  verySensitive?: boolean;
  severeCondition?: boolean;
};

export function shouldAvoidAha(flags: GuardrailFlags): boolean {
  return Boolean(flags.isTeen || flags.verySensitive);
}

export function guardrailNotes(flags: GuardrailFlags): string[] {
  const notes: string[] = [];

  if (flags.isTeen) {
    notes.push("Voor tieners houden we de routine extra mild en simpel.");
  }

  if (flags.verySensitive) {
    notes.push("Bij een heel gevoelige huid adviseren we eerst een patch test.");
  }

  if (flags.severeCondition) {
    notes.push("Bij ernstige of aanhoudende klachten is professioneel huidadvies verstandig.");
  }

  return notes;
}
