export async function fullTextSearch({
  table,
  tableAlias,
  searchField,
  where,
  joins,
  orderBy,
}: {
  table: string[];
  searchField: string[];
  tableAlias?: string;
  where?: string[] | null;
  joins?: string[] | null;
  orderBy?: string[] | null;
}) {
  const tableSql = table.map((tableName) => `"${tableName}"`).join(".");

  const searchFieldSql = searchField.map((field) => `"${field}"`).join(".");

  let whereSql =
    `to_tsvector('english', extensions.unaccent(${searchFieldSql})) 
  @@ to_tsquery('english', extensions.unaccent($1))` + (where ? " AND " : "");

  if (where && where.length > 0) {
    const extraWhereConditions = where
      .map((condition) => `${condition}`)
      .join(" AND ");
    whereSql += extraWhereConditions;
  }

  const sqlJoins = joins ? joins.join("\n      ") : "";

  const sqlOrderBy = orderBy
    ? orderBy.map((field) => `"${field}"`).join(".")
    : "id";

  const query = `
      SELECT *
      FROM ${tableSql} ${tableAlias}
      ${sqlJoins}
      WHERE ${whereSql}
      ORDER BY ${sqlOrderBy} DESC
      LIMIT $2;
    `;

  console.log(query);

  return query;
}
