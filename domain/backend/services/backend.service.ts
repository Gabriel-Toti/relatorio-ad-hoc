import { executeQuery, QueryArguments } from "../repositories/backend.repository";

export async function executeQueryService(qargs: QueryArguments) {
    try {
        const toCamelCase = (str: string) =>
            str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        const convertKeysAndValuesToCamelCase = (obj: any): any  => {
                if (Array.isArray(obj)) {
                return obj.map(convertKeysAndValuesToCamelCase);
                } else if (obj !== null && typeof obj === 'object') {
                return Object.entries(obj).reduce((acc, [key, value]) => {
                    const camelKey = toCamelCase(key);
                    acc[camelKey] = convertKeysAndValuesToCamelCase(value);
                    return acc;
                }, {} as any);
                } else if (typeof obj === 'string') {
                return toCamelCase(obj);
                }
                return obj;
            }
    
        qargs = convertKeysAndValuesToCamelCase(qargs);
        const data = await executeQuery(qargs);
        return {
            data: data,
            message: "Query executed successfully"
        };
    } catch (error) {
        throw error;
    }
}