export interface PerformancesDTO {
    data: ReadonlyArray<Performance>
}

export interface Performance {
    id: string;
    type: "performances";
    attributes: PerformanceAttributes;
}

export interface PerformanceAttributes {
    title: string;
    genres: ReadonlyArray<string>;
}
