
import {
    PerformanceRelation, Relation, Session, SessionAttributes, SessionRelationships,
    SessionsDTO
} from "./SessionsDTOModel";

export const deserializeSessionsDTO = function (obj: any): SessionsDTO {
    const sessionsDTO = {} as SessionsDTO;
    sessionsDTO.data = obj.data.map((item: any) => deserializeSession(item));
    return sessionsDTO;
};

export const deserializeSession = function (obj: any): Session {
    const session = {} as Session;
    session.id = obj.id;
    session.type = "sessions";
    session.attributes = deserializeSessionAttributes(obj.attributes);
    session.relationships = deserializeSessionRelationships(obj.relationships);
    return session;
};

export const deserializeSessionAttributes = function (obj: any): SessionAttributes {
    const sessionAttributes = {} as SessionAttributes;
    sessionAttributes.from = obj.title;
    sessionAttributes.to = obj.genres;

    return sessionAttributes;
};


export const deserializeSessionRelationships= function (obj: any): SessionRelationships {
    const sessionRelationships = {} as SessionRelationships;
    sessionRelationships.performance = deserializeRelation<PerformanceRelation>(obj.performance, deserializePerformanceRelation);

    return sessionRelationships;
};


export const deserializeRelation = function<T> (obj: any, deserializer_T: (obj: any) => T ): Relation<T> {
    const relation = {} as Relation<T>;
    relation.data = deserializer_T(obj);

    return relation;
};

export const deserializePerformanceRelation = function(obj: any): PerformanceRelation{
    const performanceRelation = {} as PerformanceRelation;
    performanceRelation.id = obj.id;
    performanceRelation.type = "performances";

    return performanceRelation;
};

