/**
 * Links a mix to a list of inputs.
 */
interface MixAssignment {
  /**
   * The identifier of the mix.
   */
  mix: string;

  /**
   * A list of identifiers for inputs, that should be associated with the mix.
   */
  inputs: string[];
}

export default MixAssignment;
