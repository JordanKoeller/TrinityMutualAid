

export const groupBy = <T>(array: T[], groupSize: number): T[][] => {
    return array.reduce((agg, elem) => {
        if (agg[agg.length - 1].length === groupSize) {
            return [...agg, [elem]];
        } else {
            agg[agg.length - 1].push(elem);
            return agg;
        }
    }, [[]] as T[][]);
}