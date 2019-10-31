import performancesData from "../data/perfomance-data.json";
import sessionsData from "../data/sessions-data.json";
import {deserializePerformancesDTO} from "../models/deserializePerformancesDTO";
import {deserializeSessionsDTO} from "../models/deserializeSessionsDTO";
import {PerformancesDTO} from "../models/PerformancesDTOModel";
import {SessionsDTO} from "../models/SessionsDTOModel";
import {rejectAfterDelay, resolveAfterDelay} from "../utils/minimalPromiseTime";
import {OrderDTO} from "../models/OrderDTOModel";

export interface ITicketsApiClient {
    makeTicketsOrder(order: OrderDTO, rejectRequest?: boolean): Promise<void>;

    getPerformances(): Promise<PerformancesDTO>;

    getSessions(): Promise<SessionsDTO>;
}

export class TicketsApiClient implements ITicketsApiClient {

    makeTicketsOrder(order: OrderDTO, rejectRequest: boolean = false): Promise<void> {
        if (rejectRequest) {
            return rejectAfterDelay({
                "errors_tree": {
                    "data": {
                        "birthday": ["unexpected format"],
                        "payment": {
                            "card": {
                                "valid_to": ["expired"],
                            }
                        }
                    }
                }
            }, 500);
        }
        return resolveAfterDelay(undefined, 500);

    }

    getPerformances(): Promise<PerformancesDTO> {
        return resolveAfterDelay(deserializePerformancesDTO(performancesData), 1500);
    }

    getSessions(): Promise<SessionsDTO> {
        return resolveAfterDelay(deserializeSessionsDTO(sessionsData), 1500);
    }

}