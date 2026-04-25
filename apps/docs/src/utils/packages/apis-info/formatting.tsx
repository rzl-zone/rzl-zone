import { cn } from "@rzl-zone/docs-ui/utils";

type Status = "beta" | "stable";

type StatusFormat = {
  icon: string;
  title: string;
  desc: string;
  colorDecs: string;
};

export const formatApisVersInfo = {
  since: (since: string) => (
    <>
      <code>{since.replace(/\.*$/, "")}</code>.
    </>
  ),
  category: (category: string) => (
    <>
      <code>{category.replace(/\.*$/, "")}</code>.
    </>
  ),
  stability: (status: Status) => {
    const statusMap = {
      beta: {
        icon: "⚠️",
        title: "Beta",
        desc: "(Unstable)",
        colorDecs: cn("text-orange-500 dark:text-orange-400")
      },
      stable: {
        icon: "✅",
        title: "Stable",
        desc: "(Production-ready)",
        colorDecs: cn("text-green-600 dark:text-green-500")
      }
    } satisfies Record<Status, StatusFormat>;

    const statusFormat = statusMap[status] ?? {
      icon: "⁉️",
      title: "Unknown",
      desc: "(No Recommend)",
      colorDecs: cn("text-red-600 dark:text-red-500")
    };

    return (
      <>
        {statusFormat.icon} <code>{statusFormat.title}</code>{" "}
        <span className={cn("font-semibold", statusFormat.colorDecs)}>
          {statusFormat.desc}
        </span>
        .
      </>
    );
  }
};
