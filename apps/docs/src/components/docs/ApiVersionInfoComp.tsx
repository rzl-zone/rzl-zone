import { apiVersionInfo } from "@/utils/packages/apis-info";
import type { ApiVersionEntries } from "@/utils/packages/apis-info/types";

export function ApiVersionInfoComp<
  P extends keyof ApiVersionEntries,
  C extends keyof ApiVersionEntries[P],
  N extends keyof ApiVersionEntries[P][C]
>({
  categoryApi,
  nameApi,
  packageName
}: {
  packageName: P;
  categoryApi: C;
  nameApi: N;
}) {
  const dataApiVersionInfo = apiVersionInfo(packageName, categoryApi, nameApi, {
    format: true
  });

  if (!dataApiVersionInfo) return null;

  return (
    <>
      <ul>
        <li>
          <strong>Since:</strong> {dataApiVersionInfo.since}
        </li>
        <li>
          <strong>Category:</strong> {dataApiVersionInfo.category}
        </li>
        <li>
          <strong>Stability:</strong> {dataApiVersionInfo.stability}
        </li>
      </ul>
    </>
  );
}
