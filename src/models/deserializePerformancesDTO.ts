import {PerformancesDTO, Performance, PerformanceAttributes} from "./PerformancesDTOModel";

export const deserializePerformancesDTO = function (obj: any): PerformancesDTO {
    const performancesDTO = {} as PerformancesDTO;
    performancesDTO.data = obj.data.map((item: any) => deserializePerformance(item));
    return performancesDTO;
};

export const deserializePerformance = function (obj: any): Performance {
    const performance = {} as Performance;
    performance.id = obj.id;
    performance.type = "performances";
    performance.attributes = deserializePerformanceAttributes(obj.attributes);
    return performance;
};

export const deserializePerformanceAttributes = function (obj: any): PerformanceAttributes {
    const performanceAttributes = {} as PerformanceAttributes;
    performanceAttributes.title = obj.title;
    performanceAttributes.genres = obj.genres;

    return performanceAttributes;
};

