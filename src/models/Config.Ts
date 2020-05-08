export default interface AppConfiguration {
    referencials: ReferencialsConfiguration;
}

export interface ReferencialsConfiguration {
    incertitude: number;
    elements: ElementPerReferentials[];
}

export interface ElementPerReferentials {
    id: string;
    values: Map<ReferencialType, number>
}

// A < B < C < D
export enum ReferencialType {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D'
}

