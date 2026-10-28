/** Relations can be UUIDs or expanded stories depending on resolve_relations. */
export const storyblokRelationIds = (
  relations?: readonly (string | { uuid: string })[]
): string[] =>
  relations?.map((relation) =>
    typeof relation === 'string' ? relation : relation.uuid
  ) ?? []
