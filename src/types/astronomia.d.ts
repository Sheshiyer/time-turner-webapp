declare module 'astronomia' {
  export namespace julian {
    export function DateToJD(date: Date): number;
    export function JDToJulianMillenium(jd: number): number;
  }

  export class solar {
    apparentLongitude(t: number): number;
  }
}
