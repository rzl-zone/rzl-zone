/* eslint-disable quotes */
import type { Rule } from "eslint";
import type { TSESTree } from "@typescript-eslint/utils";

const react18APIs = new Set([
  // React Hooks (stable React 18)
  "useState",
  "useEffect",
  "useLayoutEffect",
  "useCallback",
  "useMemo",
  "useRef",
  "useContext",
  "useReducer",
  "useImperativeHandle",
  "useDebugValue",
  "useDeferredValue",
  "useTransition",
  "useId",
  "useSyncExternalStore",
  "useInsertionEffect",

  // Experimental Hooks in React 18 typings (unstable)
  "useOpaqueIdentifier",
  "useEvent",

  // Core React APIs (functions and components)
  "createElement",
  "cloneElement",
  "createContext",
  "isValidElement",
  "forwardRef",
  "memo",
  "lazy",
  "Children",
  "Fragment",
  "StrictMode",
  "Profiler",
  "Suspense",
  "startTransition",
  "flushSync",

  // React Component Classes & Utilities
  "Component",
  "PureComponent",
  "createRef",

  // React Concurrent APIs (React 18 stable concurrency)
  "startTransition",
  "useTransition",
  "useDeferredValue",
  "useId",
  "useSyncExternalStore",
  "flushSync",

  // React Event system & handler types
  "ReactEventHandler",
  "MouseEvent",
  "FormEvent",
  "ChangeEvent",
  "KeyboardEvent",
  "FocusEvent",
  "PointerEvent",
  "TouchEvent",
  "SyntheticEvent",
  "AnimationEvent",
  "ClipboardEvent",
  "CompositionEvent",
  "DragEvent",
  "PointerEventHandler",
  "ReactFocusEventHandler",
  "ReactKeyboardEventHandler",
  "ReactMouseEventHandler",
  "ReactTouchEventHandler",
  "ReactDragEventHandler",
  "ReactPointerEventHandler",

  // React Types (props, elements, nodes, refs, keys)
  "ReactNode",
  "ReactElement",
  "ReactElementLike",
  "ReactNodeLike",
  "ReactFragment",
  "ReactPortal",
  "Key",
  "Ref",
  "RefObject",
  "MutableRefObject",
  "RefCallback",
  "ForwardRefExoticComponent",

  // React Component Props & typings
  "PropsWithChildren",
  "PropsWithRef",
  "PropsWithoutRef",
  "ComponentProps",
  "ComponentPropsWithoutRef",
  "ComponentPropsWithRef",

  // React Functional Component Types
  "Context",
  "ComponentType",
  "FunctionComponent",
  "FC",
  "ReactFC",
  "ReactFunctionComponent",

  // React JSX & JSX-related types
  "JSXElementConstructor",
  "JSXElement",
  "JSXFragment",
  "JSX",
  "JSXNamespace",

  // React Children utilities & types
  "Children",
  "ReactChild",
  "ReactChildren",
  "ReactNodeArray",

  // React Utilities & internal types
  "ExoticComponent",
  "MemoExoticComponent",
  "NamedExoticComponent",
  "ReactMemo",
  "ReactLazyExoticComponent",
  "ReactDebugCurrentFrame",
  "isValidElementType",
  "lazyInitializer",

  // React Profiler API
  "Profiler",
  "ProfilerOnRenderCallback",

  // React Suspense List API (unstable but shipped in React 18)
  "SuspenseProps",
  "SuspenseList",
  "SuspenseListComponent",
  "unstable_SuspenseList",

  // React Server Components (experimental but shipped in React 18)
  "ServerContext",
  "createServerContext",
  "ServerComponent",
  "ClientComponent",
  "ServerProps",
  "ClientProps",
  "ReactFlightClientConfig",

  // React Ref related types for prop forwarding & attributes
  "RefAttributes",
  "EffectCallback",

  // React Dispatch & StateUpdater types
  "Dispatch",
  "SetStateAction",

  // React Internal types & utilities (from typings)
  "ReactPortalType",
  "ReactScope",
  "ReactScopeType",
  "ReactProviderType",
  "ReactProvider",
  "ReactContext",
  "ReactContextType",
  "ReactContextConsumer",
  "ReactContextProvider",

  // Experimental React 18 types (shipped in typings)
  "OffscreenProps",
  "OffscreenComponent",
  "OffscreenMode",
  "OffscreenType",

  // React Cache (experimental)
  "CacheContext",
  "CacheProvider",

  // JSX Runtime (new JSX transform helpers)
  "jsx",
  "jsxs",
  "jsxDEV",
  "Fragment as jsxFragment",

  // React Legacy Context API (rarely used but still present)
  "unstable_DebugTracingMode",
  "unstable_LegacyRoot",
  "unstable_ConcurrentMode",

  // Experimental tracing API
  "unstable_trace",

  // HTML & SVG intrinsic element props types (from @types/react)
  "HTMLAttributes",
  "DetailedHTMLProps",
  "AnchorHTMLAttributes",
  "AudioHTMLAttributes",
  "AreaHTMLAttributes",
  "BaseHTMLAttributes",
  "BlockquoteHTMLAttributes",
  "ButtonHTMLAttributes",
  "CanvasHTMLAttributes",
  "ColHTMLAttributes",
  "EmbedHTMLAttributes",
  "FormHTMLAttributes",
  "IframeHTMLAttributes",
  "ImgHTMLAttributes",
  "InputHTMLAttributes",
  "KeygenHTMLAttributes",
  "LabelHTMLAttributes",
  "LiHTMLAttributes",
  "LinkHTMLAttributes",
  "MapHTMLAttributes",
  "MenuHTMLAttributes",
  "MediaHTMLAttributes",
  "MetaHTMLAttributes",
  "MeterHTMLAttributes",
  "QuoteHTMLAttributes",
  "ObjectHTMLAttributes",
  "OlHTMLAttributes",
  "OptgroupHTMLAttributes",
  "OptionHTMLAttributes",
  "OutputHTMLAttributes",
  "ParamHTMLAttributes",
  "ProgressHTMLAttributes",
  "ScriptHTMLAttributes",
  "SelectHTMLAttributes",
  "SourceHTMLAttributes",
  "StyleHTMLAttributes",
  "TableHTMLAttributes",
  "TextAreaHTMLAttributes",
  "TdHTMLAttributes",
  "ThHTMLAttributes",
  "TimeHTMLAttributes",
  "TrackHTMLAttributes",
  "VideoHTMLAttributes",
  "WebViewHTMLAttributes",
  "CSSProperties",

  // SVG attributes
  "SVGAttributes",
  "CircleSVGAttributes",
  "EllipseSVGAttributes",
  "ForeignObjectSVGAttributes",
  "GSVGAttributes",
  "ImageSVGAttributes",
  "LineSVGAttributes",
  "LinearGradientSVGAttributes",
  "MarkerSVGAttributes",
  "MaskSVGAttributes",
  "PathSVGAttributes",
  "PatternSVGAttributes",
  "PolygonSVGAttributes",
  "PolylineSVGAttributes",
  "RadialGradientSVGAttributes",
  "RectSVGAttributes",
  "StopSVGAttributes",
  "SvgSVGAttributes",
  "TextSVGAttributes",
  "TSpanSVGAttributes"
]);

function typeNodeLooksLikeWithRef(typeNode?: TSESTree.TypeNode) {
  if (!typeNode) return false;
  if (typeNode.type === "TSTypeReference") {
    const tn = typeNode.typeName;
    if (tn.type === "Identifier") {
      const n = tn.name;
      return (
        n.includes("WithRef") ||
        n.includes("PropsWithRef") ||
        n.includes("ComponentPropsWithRef") ||
        n.toLowerCase().includes("ref")
      );
    } else if (tn.type === "TSQualifiedName") {
      const right = tn.right;
      const n = right?.name;
      return (
        n?.includes?.("WithRef") ||
        n?.includes?.("PropsWithRef") ||
        n?.includes?.("ComponentPropsWithRef") ||
        n?.toLowerCase?.().includes("ref")
      );
    }
  }
  if (
    typeNode.type === "TSUnionType" ||
    typeNode.type === "TSIntersectionType"
  ) {
    return typeNode.types.some(typeNodeLooksLikeWithRef);
  }
  if (typeNode.type === "TSTypeLiteral") {
    return typeNode.members.some(
      (m) =>
        m.type === "TSPropertySignature" &&
        (m.key as { name?: string })?.name === "ref"
    );
  }
  return false;
}

function isInImportDeclaration(node: TSESTree.Node) {
  let cur: TSESTree.Node | undefined = node;
  while (cur) {
    if (cur.type === "ImportDeclaration") return true;
    cur = cur.parent;
  }
  return false;
}

type PartialIdentifier = Partial<TSESTree.Identifier>;

const noReact19ApiRule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow React 19 APIs and disallow passing/receiving ref on components not using forwardRef",
      recommended: true
    },
    messages: {
      forbiddenApi:
        'Usage of React 19 API "{{name}}" is strictly prohibited to maintain backward compatibility and prevent potential runtime issues in React 18 environments.',
      forbiddenComponentRef:
        'Component "{{name}}" forwards or receives a ref without being wrapped in `React.forwardRef`, violating React 18’s ref forwarding contract and potentially causing unexpected behavior.'
    },
    schema: undefined
  },

  create(context) {
    const forwardRefComponents = new Set();
    const componentStack: Array<{
      name: string;
      node: TSESTree.Node;
      hasRef: boolean;
      maybeHasRefFromType: boolean;
    }> = [];

    const reportedImportNames = new Set();
    const reportedApiNodes = new WeakSet<TSESTree.Node>();

    // Track React aliases and named imports
    const reactAliases = new Set(); // e.g. React, R, etc
    const reactNamedImports = new Set(); // e.g. useState, useEffect, etc

    const markRef = () => {
      const c = componentStack.at(-1);
      if (c) c.hasRef = true;
    };

    const enterComponent = (
      name: string | null | undefined,
      node: TSESTree.Node
    ) => {
      if (!name || !/^[A-Z]/.test(name)) return;
      const info = {
        name,
        node,
        hasRef: false,
        maybeHasRefFromType: false
      };

      const fn = node.type === "VariableDeclarator" ? node.init : node;
      const firstParam = (fn as Partial<TSESTree.FunctionDeclaration>)
        ?.params?.[0];
      if (firstParam) {
        if (firstParam.type === "Identifier" && firstParam.typeAnnotation) {
          const ta = firstParam.typeAnnotation.typeAnnotation;
          if (typeNodeLooksLikeWithRef(ta)) info.maybeHasRefFromType = true;
        }
        if (firstParam.type === "ObjectPattern" && firstParam.typeAnnotation) {
          const ta = firstParam.typeAnnotation.typeAnnotation;
          if (typeNodeLooksLikeWithRef(ta)) info.maybeHasRefFromType = true;
          for (const prop of firstParam.properties) {
            if (
              ((prop as TSESTree.Property).key as PartialIdentifier)?.name ===
              "ref"
            )
              info.hasRef = true;
          }
        }
      }
      componentStack.push(info);
    };

    const exitComponent = () => {
      const comp = componentStack.pop();
      if (!comp) return;
      if (comp.hasRef && !forwardRefComponents.has(comp.name)) {
        context.report({
          node: comp.node,
          messageId: "forbiddenComponentRef",
          data: { name: comp.name }
        });
      }
    };

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value === "react") {
          for (const specifier of node.specifiers) {
            if (specifier.type === "ImportNamespaceSpecifier") {
              reactAliases.add(specifier.local.name);
            } else if (specifier.type === "ImportDefaultSpecifier") {
              reactAliases.add(specifier.local.name);
            } else if (specifier.type === "ImportSpecifier") {
              reactNamedImports.add(specifier.local.name);
            }
          }
        }
      },

      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (
          node.init?.type === "CallExpression" &&
          (node.init.callee as PartialIdentifier)?.name === "forwardRef" &&
          node.id.type === "Identifier"
        ) {
          forwardRefComponents.add(node.id.name);
        }
      },

      FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
        if (node.id) enterComponent(node.id.name, node);
      },
      FunctionExpression(node: TSESTree.FunctionExpression) {
        const parent = node.parent;
        if (parent.type === "VariableDeclarator")
          enterComponent((parent.id as { name?: string | null })?.name, parent);
      },
      ArrowFunctionExpression(node: TSESTree.ArrowFunctionExpression) {
        const parent = node.parent;
        if (parent.type === "VariableDeclarator")
          enterComponent((parent.id as PartialIdentifier)?.name, parent);
      },

      MemberExpression(node: TSESTree.MemberExpression) {
        // For ref usage detection on props
        if ((node.property as PartialIdentifier)?.name === "ref") markRef();

        // For React namespace usage like React.useEffectEvent
        if (
          node.object.type === "Identifier" &&
          reactAliases.has(node.object.name) &&
          node.property.type === "Identifier"
        ) {
          const apiName = node.property.name;
          if (!react18APIs.has(apiName) && !reportedApiNodes.has(node)) {
            reportedApiNodes.add(node);
            context.report({
              node,
              messageId: "forbiddenApi",
              data: { name: `${node.object.name}.${apiName}` }
            });
          }
        }
      },

      Property(node: TSESTree.Property) {
        const isParamDestructure =
          node.parent?.type === "ObjectPattern" &&
          [
            "FunctionDeclaration",
            "FunctionExpression",
            "ArrowFunctionExpression"
          ].includes(node.parent.parent?.type);
        if (isParamDestructure) return;
        if ((node.key as PartialIdentifier)?.name === "ref") markRef();
      },

      JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
        const current = componentStack.at(-1);
        if (!current) return;
        if (
          node.name.type === "JSXIdentifier" &&
          /^[a-z]/.test(node.name.name)
        ) {
          return;
        }
        for (const attr of node.attributes) {
          if (attr.type === "JSXAttribute" && attr.name.name === "ref") {
            markRef();
            return;
          }
        }
        for (const attr of node.attributes) {
          if (attr.type === "JSXSpreadAttribute") {
            const arg = attr.argument;
            if (arg.type === "ObjectExpression") {
              for (const p of arg.properties) {
                if (
                  p.type === "Property" &&
                  (p.key as PartialIdentifier)?.name === "ref"
                ) {
                  markRef();
                  return;
                }
              }
            }
            if (
              arg.type === "Identifier" &&
              arg.name === "props" &&
              current.maybeHasRefFromType
            ) {
              markRef();
              return;
            }
          }
        }
      },

      "FunctionDeclaration:exit": exitComponent,
      "FunctionExpression:exit": exitComponent,
      "ArrowFunctionExpression:exit": exitComponent,

      ImportSpecifier(node: TSESTree.ImportSpecifier) {
        // ImportSpecifier must be check, if import from react
        const importDecl = node.parent;
        if (
          importDecl &&
          importDecl.type === "ImportDeclaration" &&
          importDecl.source.value === "react"
        ) {
          const name = (node.imported as PartialIdentifier)?.name;
          if (
            name &&
            !react18APIs.has(name) &&
            !reportedImportNames.has(name)
          ) {
            reportedImportNames.add(name);
            context.report({
              node,
              messageId: "forbiddenApi",
              data: { name: (node.imported as PartialIdentifier)?.name }
            });
          }
        }
      },

      Identifier(node: TSESTree.Node) {
        // Skip if this identifier is part of a MemberExpression property that was already reported
        if (
          node.parent?.type === "MemberExpression" &&
          node.parent.property === node &&
          reportedApiNodes.has(node.parent)
        ) {
          return;
        }

        const name = (node as PartialIdentifier).name;
        // Just check the identifiers in reactNamedImports (named imports from react)
        if (
          reactNamedImports.has(name) &&
          name &&
          !react18APIs.has(name) &&
          // !reportedUsageNames.has(name) &&
          !isInImportDeclaration(node) &&
          !reportedApiNodes.has(node)
        ) {
          reportedApiNodes.add(node);
          // reportedUsageNames.add(name);
          context.report({
            node,
            messageId: "forbiddenApi",
            data: { name: name }
          });
        }
      }
    } as unknown as Rule.RuleListener;
  }
};

export default noReact19ApiRule;
