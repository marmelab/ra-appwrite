import type { DataProvider } from 'react-admin';
import {
    type Client,
    type Models,
    Databases,
    Query,
    Permission,
    Role,
    ID,
} from 'appwrite';
import omit from 'lodash/omit';

import {
    buildFilterQueries,
    buildPaginationQueries,
    buildSortQueries,
} from './listQueryBuilders';

export type AppWriteDataProviderParams = {
    client: Client;
    databaseId: string;
    collectionIds: Record<string, string>;
    defaultReadPermissions?: Permission[];
    defaultWritePermissions?: Permission[];
};

const toRaRecord = ({
    $id,
    $permissions,
    $databaseId,
    $collectionId,
    ...restData
}: Models.Document): any => ({
    id: $id,
    ...restData,
});

export const appWriteDataProvider = (
    params: AppWriteDataProviderParams
): Required<DataProvider> => {
    const {
        client,
        databaseId,
        collectionIds,
        defaultReadPermissions = [Permission.read(Role.any())],
        defaultWritePermissions = [Permission.write(Role.any())],
    } = params;

    const database = new Databases(client);

    return {
        getList: async (resource, { pagination, sort, filter }) => {
            const { page = 1, perPage = 10 } = pagination ?? {};
            const { total, documents: data } = await database.listDocuments(
                databaseId,
                collectionIds[resource],
                [
                    ...buildPaginationQueries(page, perPage),
                    ...buildSortQueries(sort),
                    ...buildFilterQueries(filter),
                ]
            );
            return { data: data.map(toRaRecord), total };
        },
        getManyReference: async (
            resource,
            { target, id, pagination, sort, filter }
        ) => {
            const { page = 1, perPage = 10 } = pagination ?? {};
            const { total, documents: data } = await database.listDocuments(
                databaseId,
                collectionIds[resource],
                [
                    ...buildFilterQueries(filter),
                    ...[Query.equal(target, id)],
                    ...buildPaginationQueries(page, perPage),
                    ...buildSortQueries(sort),
                ]
            );
            return { data: data.map(toRaRecord), total };
        },
        getOne: async (resource, { id }) => {
            const data = await database.getDocument(
                databaseId,
                collectionIds[resource],
                id.toString()
            );
            return { data: toRaRecord(data) };
        },
        update: async (resource, { id, data, meta }) => {
            const readPermissions =
                meta?.readPermissions ?? defaultReadPermissions;
            const writePermissions =
                meta?.writePermissions ?? defaultWritePermissions;

            const updatedData = await database.updateDocument(
                databaseId,
                collectionIds[resource],
                id.toString(),
                { $id: data.id, ...omit(data, 'id') } as any,
                [...readPermissions, ...writePermissions]
            );

            return { data: toRaRecord(updatedData) };
        },
        create: async (resource, { data, meta }) => {
            const readPermissions =
                meta?.readPermissions ?? defaultReadPermissions;
            const writePermissions =
                meta?.writePermissions ?? defaultWritePermissions;

            const createdData = await database.createDocument(
                databaseId,
                collectionIds[resource],
                meta?.documentId ?? ID.unique(),
                data as unknown as object,
                [...readPermissions, ...writePermissions]
            );

            return { data: toRaRecord(createdData) };
        },
        delete: async (resource, { id }) => {
            await database.deleteDocument(
                databaseId,
                collectionIds[resource],
                id.toString()
            );
            return { data: { id } } as any;
        },
        deleteMany: async (resource, { ids }) => {
            await Promise.all(
                ids.map(id =>
                    database.deleteDocument(
                        databaseId,
                        collectionIds[resource],
                        id.toString()
                    )
                )
            );
            return { data: ids.map(id => ({ id })) } as any;
        },
        getMany: async (resource, { ids }) => {
            const data = await Promise.all(
                ids.map(id =>
                    database.getDocument<any>(
                        databaseId,
                        collectionIds[resource],
                        id.toString()
                    )
                )
            );
            return { data: data.map(toRaRecord) };
        },
        updateMany: async (resource, { ids, data, meta }) => {
            const readPermissions =
                meta?.readPermissions ?? defaultReadPermissions;
            const writePermissions =
                meta?.writePermissions ?? defaultWritePermissions;

            const updatedData = await Promise.all(
                ids.map(id =>
                    database.updateDocument<any>(
                        databaseId,
                        collectionIds[resource],
                        id.toString(),
                        data as unknown as object,
                        [...readPermissions, ...writePermissions]
                    )
                )
            );
            return { data: updatedData.map(toRaRecord) };
        },
        supportAbortSignal: false,
    };
};
