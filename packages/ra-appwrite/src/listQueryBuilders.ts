import { Query } from 'appwrite';
import type { SortPayload } from 'react-admin';

type BuildSortQueriesType = (sort?: SortPayload) => string[];

export const buildSortQueries: BuildSortQueriesType = ({
    field,
    order,
}: SortPayload) => {
    const finalField = field === 'id' ? '$id' : field;
    return [
        order === 'ASC'
            ? Query.orderAsc(finalField)
            : Query.orderDesc(finalField),
    ];
};

export const buildPaginationQueries = (page: number, perPage: number) => {
    return [Query.offset((page - 1) * perPage), Query.limit(perPage)];
};

type BuildFilterQueriesType = (filters?: any) => string[];

export const buildFilterQueries: BuildFilterQueriesType = filters => {
    const appwriteFilters: string[] = [];

    Object.entries(filters).forEach(([key, value]) => {
        appwriteFilters.push(generateFilter(key, value));
    });

    return appwriteFilters;
};

/**
 * Generate a filter string for Appwrite
 * @returns Appwrite's filter string
 */
const generateFilter = (key: string, value: any): string => {
    if (key.endsWith('_eq')) {
        return Query.equal(key.slice(0, -3), value);
    }
    if (key.endsWith('_ne')) {
        return Query.notEqual(key.slice(0, -3), value);
    }
    if (key.endsWith('_gt')) {
        return Query.greaterThan(key.slice(0, -3), value);
    }
    if (key.endsWith('_gte')) {
        return Query.greaterThanEqual(key.slice(0, -4), value);
    }
    if (key.endsWith('_lt')) {
        return Query.lessThan(key.slice(0, -3), value);
    }
    if (key.endsWith('_lte')) {
        return Query.lessThanEqual(key.slice(0, -4), value);
    }
    if (key.endsWith('_contains')) {
        return Query.search(key.slice(0, -9), `%${value}%`);
    }
    if (key.endsWith('_between')) {
        if (!Array.isArray(value) || value.length !== 2) {
            throw new Error(
                `Value array must contain exactly two elements for "between" operator`
            );
        }
        return Query.between(key.slice(0, -8), value[0], value[1]);
    }
    if (key.endsWith('_isnull')) {
        return Query.isNull(key.slice(0, -7));
    }
    if (key.endsWith('_isnotnull')) {
        return Query.isNotNull(key.slice(0, -10));
    }
    if (key.endsWith('_startswith')) {
        return Query.startsWith(key.slice(0, -11), value);
    }
    if (key.endsWith('_endswith')) {
        return Query.endsWith(key.slice(0, -9), value);
    }

    return Query.equal(key, value);
};
