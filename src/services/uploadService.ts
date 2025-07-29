// services/uploadService.ts
import Backendless from "backendless";

export const getUserPastPapers = async (userId: string) => {
  try {
    // Assuming you have a Backendless Data Table named 'past_papers'
    // and a column 'uploaded_by' storing the userId.

    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setWhereClause(`uploaded_by = '${userId}'`);
    queryBuilder.setSortBy(['uploaded_at DESC']); // descending order by uploaded_at

    const data = await Backendless.Data.of("past_papers").find(queryBuilder);
    return data || [];
  } catch (err: any) {
    console.error("[getUserPastPapers] Error fetching past papers:", err.message || err);
    return [];
  }
};
