import { executeQuery, QueryArguments } from "../repositories/backend.repository";

export async function executeQueryService(qargs: QueryArguments) {
    try {
        const data = await executeQuery(qargs);
        return {
            data: data,
            message: "Query executed successfully"
        };
    } catch (error) {
        throw error;
    }
}