export interface SessionsDTO {
    data: ReadonlyArray<Session>
}

export interface Session {
    id: string;
    type: "sessions";
    attributes: SessionAttributes;
    relationships: SessionRelationships;
}

export interface SessionAttributes {
    from: string;
    to: string;
}

export interface SessionRelationships {
    performance: Relation<PerformanceRelation>;
}

export interface PerformanceRelation {
    id: string;
    type: "performances";
}

export interface Relation<T> {
    data: T;
}

