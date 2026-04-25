import { Node, Type, TypeChecker, TypeFormatFlags } from "ts-morph";

interface TypeSimplifierContext {
  type: Type;
  checker: TypeChecker;
  location?: Node;
}

export interface TypeSimplifierOptions {
  /**
   * whether the simplified names should be preferred over the type names.
   *
   * Default: always prefer simplified ones.
   */
  shouldSimplify?: (ctx: TypeSimplifierContext) => boolean;
  override?: (ctx: TypeSimplifierContext) => string | undefined;
  noUndefined?: boolean;
}

export function getSimpleForm(
  ctx: TypeSimplifierContext,
  options: TypeSimplifierOptions = {}
): string {
  const { type } = ctx;
  const { override, shouldSimplify, noUndefined = false } = options;

  if (type.isUndefined() && noUndefined) return "";

  const overridden = override?.(ctx);
  if (overridden) return overridden;

  if (shouldSimplify && !shouldSimplify(ctx)) {
    return type.getText(
      ctx.location,
      TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
    );
  }

  const typeSymbol = type.getSymbol();
  const typeAliasSymbol = type.getAliasSymbol();
  if (typeAliasSymbol) {
    const args = type.getAliasTypeArguments();
    if (args.length === 0) return typeAliasSymbol.getName();

    const nextOptions = { ...options, noUndefined: false };
    return `${typeAliasSymbol.getName()}<${args.map((arg) => getSimpleForm({ ...ctx, type: arg }, nextOptions)).join(", ")}>`;
  }

  // if (type.isUnion()) return "union";
  if (type.isUnion()) {
    const types: string[] = [];
    for (const t of type.getUnionTypes()) {
      const str = getSimpleForm({ ...ctx, type: t });
      // const str = getSimpleForm(t, checker, noUndefined);
      if (str.length > 0 && str !== "never") types.unshift(str);
    }

    return types.length > 0
      ? // boolean | null will become true | false | null, need to ensure it's still returned as boolean
        dedupe(types).join(" | ").replace("true | false", "boolean")
      : "never";
  }

  if (type.isIntersection()) {
    const types: string[] = [];
    for (const t of type.getIntersectionTypes()) {
      const str = getSimpleForm({ ...ctx, type: t }, options);
      if (str.length > 0 && str !== "never") types.unshift(str);
    }

    return dedupe(types).join(" & ");
  }

  if (type.isTuple()) {
    return "tuple";
  }

  if (type.isArray() || type.isReadonlyArray()) {
    const elementType = type.getArrayElementType();

    if (!elementType) return "array";

    const simplified = getSimpleForm({ ...ctx, type: elementType }, options);

    return simplified ? `${simplified}[]` : "array";
  }

  if (type.getCallSignatures().length > 0) {
    return "function";
  }

  const symbol = typeSymbol || typeAliasSymbol;

  if (symbol?.getName() === "Set") {
    const [first] = type.getTypeArguments();

    if (first) {
      const inner = getSimpleForm({ ...ctx, type: first }, options);
      return `Set<${inner}>`;
    }

    return "Set";
  }

  if (type.isClassOrInterface() || type.isObject()) {
    return "object";
  }

  return type.getText(
    ctx.location,
    TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
  );
}

function dedupe<T>(arr: T[]): T[] {
  const dedupe = new Set<T>();
  const out: T[] = [];

  for (const item of arr) {
    if (!dedupe.has(item)) {
      out.push(item);
      dedupe.add(item);
    }
  }

  return out;
}
