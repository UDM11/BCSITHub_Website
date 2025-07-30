// services/uploadService.ts
import Backendless from "backendless";

export const getUserPastPapers = async (userId: string) => {
  try {
    // Assuming you have a Backendless Data Table named 'past_papers'
    // and a column 'uploaded_by' storing the userId.

    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setWhereClause(`uploadedBy = '${userId}'`);
    queryBuilder.setSortBy(['uploadedDate DESC']); // descending order by uploaded_at

    const data = await Backendless.Data.of("PastPapers").find(queryBuilder);
    return data || [];
  } catch (err: any) {
    console.error("[getUserPastPapers] Error fetching past papers:", err.message || err);
    return [];
  }
};
