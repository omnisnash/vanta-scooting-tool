const DEFAULT_INCERTITUDE = 0.1; // 10%

export interface ReferencialsConfiguration {
  incertitude: number;
  elements: ElementPerReferentials[];
}

// A < B < C < D
export enum ReferencialType {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

export type ReferentialPerValue = {
  [values in ReferencialType]: number;
};

export interface ElementPerReferentials {
  id: string;
  values: ReferentialPerValue;
}

export default class AppConfiguration {
  public referencials: ReferencialsConfiguration;

  constructor() {
    this.referencials = { incertitude: -1, elements: [] };
  }

  public getReferencialForElement(element: string): null | ReferentialPerValue {
    const referential = this.referencials.elements.find(
      (elementReferencial) =>
        elementReferencial.id.toLocaleLowerCase() ===
        element.toLocaleLowerCase()
    );
    return referential ? referential.values : null;
  }

  static getDefaultConfiguration(): AppConfiguration {
    const configuration = new AppConfiguration();

    configuration.referencials.elements = [
      {
        id: "Ag",
        values: {
          A: 0.8,
          B: 20,
          C: 40,
          D: 200,
        },
      },
      {
        id: "As",
        values: {
          A: 19,
          B: 30,
          C: 50,
          D: 250,
        },
      },
      {
        id: "Ba",
        values: {
          A: 350,
          B: 500,
          C: 2000,
          D: 10000,
        },
      },
      {
        id: "Cd",
        values: {
          A: 1.3,
          B: 5,
          C: 20,
          D: 100,
        },
      },
      {
        id: "Cr",
        values: {
          A: 100,
          B: 250,
          C: 800,
          D: 4000,
        },
      },
      {
        id: "Co",
        values: {
          A: 25,
          B: 50,
          C: 300,
          D: 1500,
        },
      },
      {
        id: "Cu",
        values: {
          A: 65,
          B: 100,
          C: 500,
          D: 2500,
        },
      },
      {
        id: "Sn",
        values: {
          A: 5,
          B: 50,
          C: 300,
          D: 1500,
        },
      },
      {
        id: "Mn",
        values: {
          A: 1000,
          B: 1000,
          C: 2200,
          D: 11000,
        },
      },
      {
        id: "Mo",
        values: {
          A: 2,
          B: 10,
          C: 40,
          D: 200,
        },
      },
      {
        id: "Ni",
        values: {
          A: 50,
          B: 100,
          C: 500,
          D: 2500,
        },
      },
      {
        id: "Pb",
        values: {
          A: 40,
          B: 500,
          C: 1000,
          D: 5000,
        },
      },
      {
        id: "Zn",
        values: {
          A: 155,
          B: 500,
          C: 1500,
          D: 7500,
        },
      },
    ];

    configuration.referencials.incertitude = DEFAULT_INCERTITUDE;

    return configuration;
  }
}
