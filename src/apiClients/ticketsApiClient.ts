import performancesData from "../data/perfomance-data.json";
import sessionsData from "../data/sessions-data.json";
import {deserializePerformancesDTO} from "../models/deserializePerformancesDTO";
import {deserializeSessionsDTO} from "../models/deserializeSessionsDTO";
import {PerformancesDTO} from "../models/PerformancesDTOModel";
import {SessionsDTO} from "../models/SessionsDTOModel";
import {resolveAfterDelay} from "../utils/minimalPromiseTime";

export interface ITicketsApiClient {
    getPerformances(): Promise<PerformancesDTO>;
    getSessions(): Promise<SessionsDTO>;
}

export class TicketsApiClient implements ITicketsApiClient {

    getPerformances(): Promise<PerformancesDTO>{
        return resolveAfterDelay(deserializePerformancesDTO(performancesData), 1500 );
    }

    getSessions(): Promise<SessionsDTO>{
        return resolveAfterDelay(deserializeSessionsDTO(sessionsData), 1500 );

    }

}