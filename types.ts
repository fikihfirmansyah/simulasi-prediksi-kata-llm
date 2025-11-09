export type Vector = [number, number, number];

export type VectorDictionary = Record<string, Vector>;

export type TargetContexts = Record<string, Vector>;

export interface PredictionResult {
  predictedWord: string;
  distance: number;
  fullSentence: string;
}
