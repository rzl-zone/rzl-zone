import type { RawTag } from "./base";

export interface ParameterTag {
  name: string;
  description?: string;
}

export interface TypedTags {
  default?: string;
  params?: ParameterTag[];
  typeDecsLink?: string;
  returns?: string;
}

/**
 * Parse tags, only returns recognized fields.
 */
export function parseTags(tags: RawTag[]): TypedTags {
  const typed: TypedTags = {};

  for (const { name: key, text } of tags) {
    if (key === "default" || key === "defaultValue") {
      typed.default = text;
      continue;
    }

    if (key === "link") {
      const match =
        /\[(?<label>.+?)\]\((?<url>(https?:\/\/|\/|#|\.\/)[^)]+)\)/.exec(text);
      const url = match?.groups?.url?.trim();

      typed.typeDecsLink = url;
      continue;
    }

    if (key === "param") {
      const sepIdx = text.indexOf("-");
      const param = sepIdx === -1 ? text.trim() : text.slice(0, sepIdx).trim();
      const description = sepIdx === -1 ? "" : text.slice(sepIdx + 1).trim();

      typed.params ??= [];
      typed.params.push({
        name: param,
        description
      });
      continue;
    }

    if (key === "returns") {
      typed.returns = text;
    }
  }

  return typed;
}
