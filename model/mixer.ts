abstract class Mixer {
  abstract getMixes(): string[];
  abstract getInputs(mix: string): string[];
}

export default Mixer;
