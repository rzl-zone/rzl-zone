import type { AnyString } from "@rzl-zone/ts-types-plus";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { getPreciseType, GetPreciseTypeOptions } from "../getPreciseType";

import { slugify } from "@/strings/cases/slugify";
import { toDotCase } from "@/strings/cases/toDotCase";
import { toCamelCase } from "@/strings/cases/toCamelCase";
import { toKebabCase } from "@/strings/cases/toKebabCase";
import { toSnakeCase } from "@/strings/cases/toSnakeCase";
import { toLowerCase } from "@/strings/cases/toLowerCase";
import { toPascalCase } from "@/strings/cases/toPascalCase";
import { toPascalCaseSpace } from "@/strings/cases/toPascalCaseSpace";

import { isNull } from "@/predicates/is/isNull";
import { isObjectOrArray } from "@/predicates/is/isObjectOrArray";

export class PreciseType {
  /** ----------------------------------------------------------
   * * ***Mapping table of JavaScript built-in and environment-specific types.***
   * ----------------------------------------------------------
   * - **Behavior:**
   *    - Maps internal or native type identifiers to **human-readable names** (usually PascalCase).
   *    - Keys are normalized to lowercase and stripped of spaces, dashes, or underscores.
   *    - Extend or modify entries to match your environment or platform.
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`}.
   *    - Not intended for direct use in application code.
   *
   * @internal
   */
  private static readonly FIXES_RAW = Object.freeze({
    // primitives
    string: "String",
    number: "Number",
    boolean: "Boolean",
    bigint: "Bigint",
    symbol: "Symbol",
    undefined: "Undefined",
    null: "Null",
    regexp: "Reg Exp",

    // reflect / proxy / atomics
    reflect: "Reflect",
    proxy: "Proxy",
    atomics: "Atomics",

    // core / objects
    array: "Array",
    object: "Object",
    function: "Function",
    arguments: "Arguments",

    // functions
    asyncfunction: "Async Function",
    generatorfunction: "Generator Function",
    asyncgeneratorfunction: "Async Generator Function",
    generator: "Generator",
    promise: "Promise",

    // errors
    evalerror: "Eval Error",
    rangeerror: "Range Error",
    referenceerror: "Reference Error",
    syntaxerror: "Syntax Error",
    typeerror: "Type Error",
    urierror: "URI Error",
    aggregateerror: "Aggregate Error",
    error: "Error",

    // typed arrays & binary
    int8array: "Int 8 Array",
    uint8array: "Uint 8 Array",
    uint8clampedarray: "Uint 8 Clamped Array",
    int16array: "Int 16 Array",
    uint16array: "Uint 16 Array",
    int32array: "Int 32 Array",
    uint32array: "Uint 32 Array",
    float32array: "Float 32 Array",
    float64array: "Float 64 Array",
    bigint64array: "Big Int 64 Array",
    biguint64array: "Big Uint 64 Array",
    arraybuffer: "Array Buffer",
    sharedarraybuffer: "Shared Array Buffer",
    dataview: "Data View",
    arraybufferview: "Array Buffer View",

    // collections
    map: "Map",
    set: "Set",
    weakmap: "Weak Map",
    weakset: "Weak Set",

    // iterators (note: toString tag can be "Map Iterator" etc.)
    mapiterator: "Map Iterator",
    weakmapiterator: "Weak Map Iterator",
    setiterator: "Set Iterator",
    weaksetiterator: "Weak Set Iterator",
    arrayiterator: "Array Iterator",
    stringiterator: "String Iterator",
    asynciterator: "Async Iterator",
    iteratorresult: "Iterator Result",
    arrayiteratorresult: "Array Iterator Result",

    // streams / fetch / web
    readablestream: "Readable Stream",
    writablestream: "Writable Stream",
    transformstream: "Transform Stream",
    readablestreamdefaultreader: "Readable Stream Default Reader",
    writablestreamdefaultwriter: "Writable Stream Default Writer",
    readablestreamdefaultcontroller: "Readable Stream Default Controller",
    transformstreamdefaultcontroller: "Transform Stream Default Controller",
    abortcontroller: "Abort Controller",
    abortsignal: "Abort Signal",
    fetch: "fetch",
    request: "Request",
    response: "Response",
    headers: "Headers",
    formdata: "FormData",
    blob: "Blob",
    file: "File",
    filelist: "FileList",
    filereader: "FileReader",

    // intl
    intl: "Intl",
    collator: "Intl. Collator",
    datetimeformat: "Intl. Date Time Format",
    displaynames: "Intl. Display Names",
    listformat: "Intl. List Format",
    locale: "Intl. Locale",
    numberformat: "Intl. Number Format",
    pluralrules: "Intl. Plural Rules",
    relativetimeformat: "Intl. Relative Time Format",
    segmenter: "Intl. Segmenter",

    // es2021+
    weakref: "Weak Ref",
    urlpattern: "URLPattern",
    structuredclone: "structured Clone",
    finalizationregistry: "Finalization Registry",

    // performance / observers
    performance: "Performance",
    performanceobserver: "Performance Observer",
    performanceentry: "Performance Entry",
    performancemark: "Performance Mark",
    performancemeasure: "Performance Measure",

    // webassembly
    webassembly: "Web Assembly",
    wasmmodule: "WebAssembly. Module",
    wasminstance: "WebAssembly. Instance",
    wasmmemory: "WebAssembly. Memory",
    wasmtable: "WebAssembly. Table",

    // node-ish / common hosts
    buffer: "Buffer",
    process: "Process",
    eventemitter: "Event Emitter",
    stream: "Stream",
    fs: "fs",
    path: "path",
    url: "URL",
    urlsearchparams: "URL Search Params",

    // DOM basics
    node: "Node",
    element: "Element",
    htmlelement: "HTML Element",
    svgelement: "SVG Element",
    document: "Document",
    documentfragment: "Document Fragment",
    shadowroot: "Shadow Root",
    nodelist: "Node List",
    htmlcollection: "HTML Collection",

    // observers / misc DOM
    resizeobserver: "Resize Observer",
    mutationobserver: "Mutation Observer",
    intersectionobserver: "Intersection Observer",

    // Reflection / Symbolic
    symboliterator: "Symbol. Iterator",
    symbolasynciterator: "Symbol. Async Iterator",
    symboltostringtag: "Symbol. To String Tag",
    symbolspecies: "Symbol. Species",
    symbolhasinstance: "Symbol. Has Instance",
    symbolisconcatspreadable: "Symbol. Is Concat Spreadable",
    symbolunscopables: "Symbol. Unscopables",
    symbolmatch: "Symbol. Match",
    symbolreplace: "Symbol. Replace",
    symbolsearch: "Symbol. Search",
    symbolsplit: "Symbol. Split",
    symboltoprimitive: "Symbol. To Primitive",
    symbolmatchall: "Symbol. Match All",
    symbolarguments: "Symbol. Arguments", // deprecated

    // Numbers & Math
    math: "Math",
    bigintconstructor: "Bigint Constructor",
    numberconstructor: "Number Constructor",
    stringconstructor: "String Constructor",
    booleanconstructor: "Boolean Constructor",

    // URL / Networking (modern web)
    formdataevent: "Form Data Event",
    customevent: "Custom Event",
    messagechannel: "Message Channel",
    messageport: "Message Port",
    messageevent: "Message Event",
    websocket: "Web Socket",
    eventsource: "Event Source",

    // Storage APIs
    indexeddb: "IndexedDB",
    idbrequest: "IDB Request",
    idbtransaction: "IDB Transaction",
    idbobjectstore: "IDB Object Store",
    idbcursor: "IDB Cursor",
    localstorage: "Local Storage",
    sessionstorage: "Session Storage",

    // Navigator / Browser APIs
    navigator: "Navigator",
    geolocation: "Geolocation",
    clipboard: "Clipboard",
    notification: "Notification",

    // Canvas / Graphics
    canvas: "Canvas",
    canvasrenderingcontext2d: "Canvas Rendering Context 2D",
    offscreencanvas: "Offscreen Canvas",
    webglrenderingcontext: "WebGL Rendering Context",
    imagedata: "Image Data",
    imagebitmap: "Image Bitmap",

    // Media
    mediastream: "Media Stream",
    mediarecorder: "Media Recorder",
    mediastreamtrack: "Media Stream Track",
    audiocontext: "Audio Context",
    audiobuffer: "Audio Buffer",
    audioworklet: "Audio Worklet",

    // Workers
    worker: "Worker",
    sharedworker: "Shared Worker",
    serviceworker: "Service Worker",
    workerglobalscope: "Worker Global Scope",

    // Structured Clone / Transferable
    structuredcloneerror: "Structured Clone Error",
    transferable: "Transferable",

    // Testing / Diagnostics
    report: "Report",
    console: "Console",
    diagnosticreport: "Diagnostic Report",

    // Misc
    domrect: "DOM Rect",
    dompoint: "DOM Point",
    dommatrix: "DOM Matrix",
    domparser: "DOM Parser",
    xmlhttprequest: "XML HTTP Request",
    customelementregistry: "Custom Element Registry",

    // additions-ons
    text: "Text",
    comment: "Comment",
    animation: "Animation",
    documenttype: "Document Type",
    characterdata: "Character Data",
    animationevent: "Animation Event",
    customemmetregistry: "Custom Emmet Registry",
    websocketmessageevent: "WebSocket Message Event"
  } as const);

  /** ----------------------------------------------------------
   * * ***List of JavaScript special numeric values.***
   * ----------------------------------------------------------
   *
   * - Contains special values recognized by {@link getPreciseType | `getPreciseType`},
   *   such as `"Infinity"`, `"-Infinity"`, and `"NaN"`.
   *
   * - **⚠️ Internal:**
   *    - Used by {@link getPreciseType | `getPreciseType`} for numeric edge-case detection.
   *
   * @internal
   */
  private static readonly SPECIAL_TYPE = Object.freeze([
    "-Infinity",
    "Infinity",
    "NaN"
  ] as const);

  /** ----------------------------------------------------------
   * * ***List of acronyms to keep uppercase in formatted output.***
   * ----------------------------------------------------------
   *
   * - **Behavior:**
   *    - Prevents transformations (like camelCase or kebab-case) from altering
   *      known acronyms such as `HTML`, `URL`, `API`, etc.
   *    - Extend this list if you want more acronyms to remain uppercase.
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`} and related formatters.
   *
   * @internal
   */
  private static readonly ACRONYMS = Object.freeze([
    // Web & Protocols
    "URI",
    "URL",
    "URN",
    "HTTP",
    "HTTPS",
    "FTP",
    "FTPS",
    "SFTP",
    "SSH",
    "SMTP",
    "POP3",
    "IMAP",
    "WS",
    "WSS",
    "TCP",
    "UDP",
    "IP",
    "ICMP",
    "ARP",
    "RTP",
    "RTSP",
    "SIP",

    // Web APIs & Standards
    "HTML",
    "XHTML",
    "XML",
    "WBR",
    "CSS",
    "SVG",
    "JSON",
    "JSONP",
    "DOM",
    "IDB",
    "DB",
    "RTC",
    "ICE",
    "TLS",
    "SSL",
    "CORS",
    "WASM",
    "CSR",
    "SSR",
    "PWA",
    "DPI",
    "CDN",

    // Programming / JS Ecosystem
    "JS",
    "TS",
    "JSX",
    "TSX",
    "CLI",
    "API",
    "SDK",
    "UI",
    "UX",
    "OS",
    "ID",
    "UUID",
    "PID",
    "NPM",
    "YARN",
    "ESM",
    "CJS",
    "BOM",
    "MVC",
    "MVVM",
    "ORM",
    "DAO",
    "CRUD",
    "FIFO",
    "LIFO",
    "OOP",
    "FP",
    "REPL",

    // Data Formats & Types
    "CSV",
    "TSV",
    "SQL",
    "YAML",
    "JSON",
    "MD",
    "INI",
    "PDF",
    "XLS",
    "XLSX",
    "RTF",
    "XML",
    "BMP",
    "GIF",
    "PNG",
    "JPEG",
    "WEBP",
    "MP3",
    "MP4",
    "AVI",
    "MOV",
    "FLAC",
    "MKV",
    "WAV",

    // Common Abbreviations
    "URLSearchParams",
    "XHR",
    "2D",
    "3D",
    "GL",
    "WebGL",
    "TTL",
    "UID",
    "GID",
    "MAC",
    "IP",
    "DNS",
    "DHCP",
    "VPN",
    "LAN",
    "WAN",
    "SSID",
    "IoT",
    "API",
    "SDK",
    "CLI",
    "LTS",
    "EOL",

    // Hardware & Infrastructure
    "CPU",
    "GPU",
    "RAM",
    "ROM",
    "SSD",
    "HDD",
    "BIOS",
    "USB",
    "PCI",
    "SATA",
    "DIMM",
    "DDR",
    "VGA",
    "HDMI",
    "KVM",
    "ASIC",
    "FPGA",
    "SoC",
    "NAS",
    "SAN",

    // Networking
    "TCP",
    "UDP",
    "IP",
    "MAC",
    "DNS",
    "DHCP",
    "VPN",
    "LAN",
    "WAN",
    "SSID",
    "NAT",
    "QoS",
    "MPLS",
    "BGP",
    "OSPF",
    "ICMP",
    "IGMP",
    "LLDP",
    "ARP",
    "RARP",

    // Security
    "AES",
    "RSA",
    "OTP",
    "MFA",
    "PKI",
    "VPN",
    "IAM",
    "ACL",
    "CSP",
    "XSS",
    "CSRF",
    "HSTS",
    "WAF",
    "DDoS",
    "IDS",
    "IPS",
    "SOC",
    "SIEM",

    // Cloud / DevOps / Infrastructure
    "AWS",
    "GCP",
    "AZURE",
    "CI",
    "CD",
    "K8S",
    "IaC",
    "PaaS",
    "SaaS",
    "IaaS",
    "API",
    "CLI",
    "SDK",
    "REST",
    "SOAP",
    "JSON-RPC",
    "gRPC",
    "ELB",
    "EKS",
    "AKS",
    "FaaS",
    "CaaS",

    // User Interface & Tools
    "GUI",
    "IDE",
    "FAQ",
    "UX",
    "UI",
    "CLI",
    "API",
    "SDK",
    "LTS",
    "EOL",
    "WYSIWYG",
    "CMS",
    "CRM",

    // Miscellaneous
    "GPS",
    "LED",
    "OLED",
    "LCD",
    "RFID",
    "NFC",
    "CPU",
    "GPU",
    "AI",
    "ML",
    "DL",
    "DB",
    "SQL",
    "NoSQL",
    "ORM",
    "JSON",
    "XML",
    "CSV",
    "HTTP",
    "HTTPS",

    // Testing & QA
    "TDD",
    "BDD",
    "CI",
    "CD",
    "QA",
    "SLA",
    "SLO",
    "MTTR",
    "MTBF",
    "UAT",
    "RPA",

    // Business & Project Management
    "KPI",
    "OKR",
    "ROI",
    "RFP",
    "SLA",
    "CRM",
    "ERP",
    "PMO",
    "SCRUM",
    "KANBAN",

    // Multimedia & Graphics
    "FPS",
    "HDR",
    "VR",
    "AR",
    "3D",
    "2D",
    "MP3",
    "MP4",
    "GIF",
    "PNG",
    "JPEG",
    "SVG",
    "BMP",
    "TIFF",

    // Operating Systems & File Systems
    "POSIX",
    "NTFS",
    "FAT",
    "EXT",
    "EXT4",
    "APFS",
    "HFS",
    "ISO",

    // Programming Languages & Tools
    "HTML",
    "CSS",
    "JS",
    "TS",
    "PHP",
    "SQL",
    "JSON",
    "XML",
    "YAML",
    "BASH",
    "ZSH",
    "JSON",
    "YAML",
    "INI",
    "DOTENV",

    // Containers & Virtualization
    "VM",
    "VMM",
    "VPC",
    "OCI",
    "LXC",
    "Docker",
    "K8S",
    "CRI",
    "CNI"
  ] as const);

  /** ----------------------------------------------------------
   * * ***Normalized lookup table for type mapping.***
   * ----------------------------------------------------------
   *
   * - **Behavior:**
   *    - Converts all keys from {@link FIXES_RAW | `FIXES_RAW`} into normalized form
   *      (lowercased and stripped of separators) for consistent lookup.
   *    - Values remain the formatted human-readable type names.
   *
   * - **⚠️ Internal:**
   *    - Helper table for {@link getPreciseType | `getPreciseType`} and related matchers.
   *
   * @internal
   */
  private static readonly FIXES_CASTABLE_TABLE = Object.freeze(
    Object.entries(PreciseType.FIXES_RAW).reduce(
      (acc, [k, v]) => {
        acc[PreciseType.normalizeKeyForCase(k)] = v;
        return acc;
      },
      {} as Record<string, string>
    )
  );

  /**
   * @internal
   */
  private formatCase: GetPreciseTypeOptions["formatCase"] = "toKebabCase";
  /**
   * @internal
   */
  private useAcronyms: GetPreciseTypeOptions["useAcronyms"] = false;

  constructor(params?: GetPreciseTypeOptions) {
    this.formatCase = params?.formatCase;
    this.useAcronyms = params?.useAcronyms;
  }

  /**
   * @internal
   */
  private determineOptions(options?: GetPreciseTypeOptions) {
    return {
      formatCase: options?.formatCase || this.formatCase,
      useAcronyms: options?.useAcronyms ?? this.useAcronyms
    };
  }

  // ------------------------
  // Helpers for DOM detection
  // ------------------------

  /**
   * @internal
   */
  private getHtmlElementType(
    value: unknown,
    options?: GetPreciseTypeOptions
  ): string | null {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    if (typeof HTMLElement === "undefined" || !(value instanceof HTMLElement))
      return null;

    const tagName = value.tagName;

    const DEFAULTS: Record<string, string> = {
      a: "Anchor",
      abbr: "Abbreviation",
      address: "Address",
      area: "Area",
      article: "Article",
      aside: "Aside",
      audio: "Audio",
      b: "Bold",
      base: "Base",
      bdi: "BDI",
      bdo: "BDO",
      blockquote: "Blockquote",
      body: "Body",
      br: "Break",
      button: "Button",
      canvas: "Canvas",
      caption: "Caption",
      cite: "Cite",
      code: "Code",
      col: "Column",
      colgroup: "Column Group",
      data: "Data",
      datalist: "Datalist",
      dd: "Definition Description",
      del: "Deleted Text",
      details: "Details",
      dfn: "Definition",
      dialog: "Dialog",
      div: "Div",
      dl: "Definition List",
      dt: "Definition Term",
      em: "Emphasis",
      embed: "Embed",
      fieldset: "Fieldset",
      figcaption: "Figcaption",
      figure: "Figure",
      footer: "Footer",
      form: "Form",
      h1: "Heading 1",
      h2: "Heading 2",
      h3: "Heading 3",
      h4: "Heading 4",
      h5: "Heading 5",
      h6: "Heading 6",
      head: "Head",
      header: "Header",
      hr: "Horizontal Rule",
      html: "HTML",
      i: "Italic",
      iframe: "IFrame",
      img: "Image",
      input: "Input",
      ins: "Inserted Text",
      kbd: "Keyboard",
      label: "Label",
      legend: "Legend",
      li: "List Item",
      link: "Link",
      main: "Main",
      map: "Map",
      mark: "Mark",
      meta: "Meta",
      meter: "Meter",
      nav: "Nav",
      noscript: "NoScript",
      object: "Object",
      ol: "Ordered List",
      optgroup: "Option Group",
      option: "Option",
      output: "Output",
      p: "Paragraph",
      param: "Param",
      picture: "Picture",
      pre: "Preformatted",
      progress: "Progress",
      q: "Quote",
      rp: "RP",
      rt: "RT",
      ruby: "Ruby",
      s: "Strikethrough",
      samp: "Sample",
      script: "Script",
      section: "Section",
      select: "Select",
      small: "Small",
      source: "Source",
      span: "Span",
      strong: "Strong",
      style: "Style",
      sub: "Subscript",
      summary: "Summary",
      sup: "Superscript",
      table: "Table",
      tbody: "Table Body",
      td: "Table Data",
      template: "Template",
      textarea: "Textarea",
      tfoot: "Table Footer",
      th: "Table Header",
      thead: "Table Head",
      time: "Time",
      title: "Title",
      tr: "Table Row",
      track: "Track",
      u: "Underline",
      ul: "Unordered List",
      var: "Variable",
      video: "Video",
      wbr: "WBR"
    };

    const displayName =
      PreciseType.FIXES_CASTABLE_TABLE[
        PreciseType.normalizeKeyForCase(tagName)
      ] ??
      (DEFAULTS[tagName]
        ? `HTML ${DEFAULTS[tagName]} Element`
        : "HTML Element");

    return this.converter(displayName, { formatCase, useAcronyms });
  }

  /**
   * @internal
   */
  private getCommentNodeType(
    value: unknown,
    options?: GetPreciseTypeOptions
  ): string | null {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    if (value instanceof Comment) {
      return this.converter(
        PreciseType.FIXES_CASTABLE_TABLE[
          PreciseType.normalizeKeyForCase("comment")
        ] ?? "Comment",
        { formatCase, useAcronyms }
      );
    }
    return null;
  }

  /**
   * @internal
   */
  private getTextNodeType(
    value: unknown,
    options?: GetPreciseTypeOptions
  ): string | null {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    if (value instanceof Text) {
      return this.converter(
        PreciseType.FIXES_CASTABLE_TABLE[
          PreciseType.normalizeKeyForCase("text")
        ] ?? "Text",
        { formatCase, useAcronyms }
      );
    }
    return null;
  }

  /**
   * @internal
   */
  private getOtherNodeType(
    value: unknown,
    options?: GetPreciseTypeOptions
  ): string | null {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    if (typeof Node !== "undefined" && value instanceof Node) {
      return this.converter(
        PreciseType.FIXES_CASTABLE_TABLE[
          PreciseType.normalizeKeyForCase("node")
        ] ?? "Node",
        { formatCase, useAcronyms }
      );
    }
    return null;
  }

  /** ----------------------------------------------------------
   * * ***Retrieves the canonical string representation of a given `Symbol`.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Converts a JavaScript `Symbol` (including well-known symbols) into a standardized,
   *      human-readable name string.
   *    - Maps **well-known symbols** (e.g., `Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toStringTag`)
   *      to their corresponding normalized key in {@link PreciseType.castableTable | `castableTable`}.
   *    - Supports formatted output according to the given `formatCase` and `useAcronyms` options.
   *    - Falls back to the general `"Symbol"` type name if the provided symbol is not recognized.
   *
   * - **Example:**
   *    ```ts
   *    const precise = new PreciseType();
   *
   *    precise.getSymbolName(Symbol.iterator);
   *    // ➜ "symbol-iterator"
   *
   *    precise.getSymbolName(Symbol.toStringTag, { formatCase: "toPascalCase" });
   *    // ➜ "SymbolToStringTag"
   *
   *    precise.getSymbolName(Symbol("custom"));
   *    // ➜ "symbol"
   *    ```
   *
   * - **Options:**
   *    - `formatCase` → Determines the string case style for the resulting symbol name.
   *    - `useAcronyms` → Preserves known acronyms (like `URL`, `DOM`, `HTML`) if set to `true`.
   *
   * - **⚠️ Internal:**
   *    - Helper for {@link getPreciseType | `getPreciseType`} that normalizes `Symbol` detection.
   *    - Not recommended for direct external use.
   *
   * @param value - The `Symbol` instance to analyze.
   * @param options - Optional settings for case formatting and acronym preservation.
   * @returns The formatted symbol name string.
   *
   * @internal
   */
  public getSymbolName(value: symbol, options?: GetPreciseTypeOptions): string {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    // Map Symbol well-known keys to fix name at FIXES_CASTABLE_TABLE
    const symbolMap = new Map<symbol, string>([
      [Symbol.iterator, "symboliterator"],
      [Symbol.asyncIterator, "symbolasynciterator"],
      [Symbol.toStringTag, "symboltostringtag"],
      [Symbol.species, "symbolspecies"],
      [Symbol.hasInstance, "symbolhasinstance"],
      [Symbol.isConcatSpreadable, "symbolisconcatspreadable"],
      [Symbol.unscopables, "symbolunscopables"],
      [Symbol.match, "symbolmatch"],
      [Symbol.replace, "symbolreplace"],
      [Symbol.search, "symbolsearch"],
      [Symbol.split, "symbolsplit"],
      [Symbol.toPrimitive, "symboltoprimitive"],
      [Symbol.matchAll, "symbolmatchall"]
    ]);

    const key = symbolMap.get(value);
    if (key) {
      return this.converter(
        PreciseType.FIXES_CASTABLE_TABLE[
          PreciseType.normalizeKeyForCase(key)
        ] ?? key,
        { formatCase, useAcronyms }
      );
    }

    // Default fallback for any other symbol
    return this.converter(
      PreciseType.FIXES_CASTABLE_TABLE[
        PreciseType.normalizeKeyForCase("symbol")
      ] ?? "Symbol",
      { formatCase, useAcronyms }
    );
  }

  /** ----------------------------------------------------------
   * * ***Detects the precise DOM node type of a given value.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Determines the specific **DOM Node subtype** (e.g., `HTMLDivElement`, `Comment`, `Text`, etc.)
   *      based on the given input `value`.
   *    - This method sequentially checks various DOM-related helpers:
   *      - {@link PreciseType.getHtmlElementType | `getHtmlElementType`}
   *      - {@link PreciseType.getCommentNodeType | `getCommentNodeType`}
   *      - {@link PreciseType.getTextNodeType | `getTextNodeType`}
   *      - {@link PreciseType.getOtherNodeType | `getOtherNodeType`}
   *    - Returns the first non-null type result found.
   *    - If no valid DOM node type is detected or an error occurs, it gracefully returns `null`.
   *
   * - **Example:**
   *    ```ts
   *    const detector = new PreciseType();
   *    detector.detectDomNodeType(document.createElement("div"));
   *    // ➜ "HTMLDivElement"
   *
   *    detector.detectDomNodeType(document.createComment("test"));
   *    // ➜ "Comment"
   *
   *    detector.detectDomNodeType("not a node");
   *    // ➜ null
   *    ```
   *
   * - **Options:**
   *    - `formatCase` → Controls the output formatting (e.g., `"toKebabCase"`, `"toPascalCase"`, etc.).
   *    - `useAcronyms` → Determines if acronyms like `"HTML"` or `"SVG"` remain uppercase.
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`} to refine DOM-related type detection.
   *    - Not intended for direct external use.
   *
   * @param value - The value to be inspected for a DOM node type.
   * @param options - Optional configuration to adjust case formatting and acronym behavior.
   * @returns The detected DOM node type string, or `null` if not applicable.
   *
   * @internal
   */
  public detectDomNodeType(
    value: unknown,
    options?: GetPreciseTypeOptions
  ): string | null {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    try {
      return (
        this.getHtmlElementType(value, { formatCase, useAcronyms }) ||
        this.getCommentNodeType(value, { formatCase, useAcronyms }) ||
        this.getTextNodeType(value, { formatCase, useAcronyms }) ||
        this.getOtherNodeType(value, { formatCase, useAcronyms })
      );
    } catch {
      return null;
    }
  }

  /** ----------------------------------------------------------
   * * ***Detects whether a given value is a Proxy instance.***
   * ----------------------------------------------------------
   *
   * - **Behavior:**
   *    - Attempts to define and delete a temporary property to trigger potential Proxy traps.
   *    - Works because most Proxy handlers will throw or behave differently during these operations.
   *    - Transparent Proxies (without traps) will **not** be detected.
   *
   * @description
   * This method performs a heuristic check — it’s **not foolproof**, but reliably distinguishes
   * most Proxy-wrapped objects from ordinary ones without using non-standard APIs.
   *
   * @param value - The value to inspect.
   * @returns `true` if the value behaves like a Proxy (throws on property mutation),
   *          otherwise `false`.
   *
   * @example
   * ```ts
   * const target = {};
   * const proxy = new Proxy(target, {});
   *
   * console.log(preciseType.isProxy(target)); // false
   * console.log(preciseType.isProxy(proxy));  // false (transparent proxy)
   *
   * const proxyWithTrap = new Proxy(target, {
   *   set() { throw new Error("trap!"); }
   * });
   *
   * console.log(preciseType.isProxy(proxyWithTrap)); // true
   * ```
   *
   * @note
   * - Skips built-in native types (like `Array`, `Date`, `Map`, etc.) to prevent false positives.
   * - This is an **internal heuristic**, not a guaranteed Proxy detector.
   *
   * @internal
   */
  public isProxy(value: unknown): boolean {
    if (isNull(value) || !isObjectOrArray(value)) return false;

    // Exclude built-in types to avoid false positives
    const tag = Object.prototype.toString.call(value);
    const skipTags = [
      "[object Array]",
      "[object Date]",
      "[object RegExp]",
      "[object Map]",
      "[object Set]",
      "[object WeakMap]",
      "[object WeakSet]",
      "[object Function]",
      "[object Error]",
      "[object Promise]",
      "[object Generator]",
      "[object GeneratorFunction]",
      "[object AsyncFunction]"
    ];
    if (skipTags.includes(tag)) return false;

    try {
      // Try to define and delete a property; Proxy traps might throw here
      Reflect.defineProperty(value, "__proxy_detect__", {
        configurable: true,
        value: 1
      });
      Reflect.deleteProperty(value, "__proxy_detect__");
      return false; // If success, it's not Proxy (or proxy without traps on these ops)
    } catch {
      return true; // If error, probably Proxy with traps
    }
  }

  /** ----------------------------------------------------------
   * * ***Helper function to convert an input string to a specific casing/format.***
   * ----------------------------------------------------------
   *
   * @description
   * - Chooses the conversion function based on the `formatCase` option.
   * - Supports multiple casing/formatting functions:
   *   - `toPascalCaseSpace`.
   *   - `toPascalCase`.
   *   - `toCamelCase`.
   *   - `toKebabCase`.
   *   - `toSnakeCase`.
   *   - `toDotCase`.
   *   - `slugify`.
   * - Uses `ACRONYMS` as ignored words for certain conversion functions.
   *
   * @param {string} input - The string to convert.
   * @param {GetPreciseTypeOptions["formatCase"]} formatCase - The conversion method to apply.
   * @returns {string} The converted string according to the selected format.
   *
   * @example
   * converterHelper("hello world", "toCamelCase");
   * // ➔ "helloWorld"
   *
   * @example
   * converterHelper("my URL path", "slugify");
   * // ➔ "my-URL-path"
   *
   * @internal
   */
  public converter(input: string, options?: GetPreciseTypeOptions): string {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    const ignoreWord = useAcronyms ? PreciseType.ACRONYMS : [];

    switch (formatCase) {
      case "slugify":
        return slugify(input, ignoreWord);
      case "toDotCase":
        return toDotCase(input, ignoreWord);
      case "toCamelCase":
        return toCamelCase(input, ignoreWord);
      case "toSnakeCase":
        return toSnakeCase(input, ignoreWord);
      case "toLowerCase":
        return toLowerCase(input, ignoreWord);
      case "toPascalCase":
        return toPascalCase(input, ignoreWord);
      case "toPascalCaseSpace":
        return toPascalCaseSpace(input, ignoreWord);

      default:
        return toKebabCase(input, ignoreWord);
    }
  }

  /** ----------------------------------------------------------
   * * ***Normalizes a string key for consistent case-insensitive matching.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - This method removes all **spaces**, **underscores**, and **hyphens** from the given string,
   *      then converts the result to **lowercase**.
   *    - Used internally to ensure uniformity in key lookups and matching logic across
   *      type mapping tables like {@link PreciseType.fixesRaw | `fixesRaw`} and
   *      {@link PreciseType.castableTable | `castableTable`}.
   *
   * - **Example:**
   *    ```ts
   *    PreciseType.normalizeKeyForCase("Map.Type");   // ➔ "maptype"
   *    PreciseType.normalizeKeyForCase("Map-Type");   // ➔ "maptype"
   *    PreciseType.normalizeKeyForCase("Set Type");   // ➔ "settype"
   *    PreciseType.normalizeKeyForCase("Array_Type"); // ➔ "arraytype"
   *    ```
   *
   * - **⚠️ Internal:**
   *    - Helper method used by {@link getPreciseType | `getPreciseType`} and internal mapping constants.
   *    - Not intended for direct use in user code.
   *
   * @param k - The input string key to normalize.
   * @returns The normalized lowercase key with all separators removed.
   *
   * @internal
   */
  public static normalizeKeyForCase(
    k: keyof typeof this.fixesRaw | AnyString
  ): string {
    return k.replace(/[\s_\-.]+/g, "").toLowerCase();
  }

  /** ----------------------------------------------------------
   * * ***Getting the internal map of type castable relationships used by {@link getPreciseType | `getPreciseType`}.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Returns an internal static mapping table that defines which primitive or structural types
   *      can be cast or interpreted as another related type within the internal logic of
   *      {@link getPreciseType | `getPreciseType`}.
   *
   * - **⚠️ Internal:**
   *    - This is an internal helper of {@link getPreciseType | `getPreciseType`}.
   *    - Do not modify or rely on this table directly — it is **readonly** and may change without notice.
   *
   * @readonly
   */
  static get castableTable(): typeof PreciseType.FIXES_CASTABLE_TABLE {
    return PreciseType.FIXES_CASTABLE_TABLE;
  }

  /** ----------------------------------------------------------
   * * ***Retrieves the internal list of special type cases handled by {@link getPreciseType | `getPreciseType`}.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Returns an internal readonly list of specific type identifiers that require
   *      *custom handling* during type detection.
   *    - These are **exceptional values** or **edge cases** that don’t follow the normal
   *      JavaScript type resolution flow.
   *
   * - **Example Values:**
   *    - `"Infinity"`, `"-Infinity"`, `"NaN"`, `"undefined"`, etc.
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`}.
   *    - This property is **readonly** and should not be modified directly.
   *
   * @readonly
   */
  static get specialType(): typeof this.SPECIAL_TYPE {
    return this.SPECIAL_TYPE;
  }

  /** ----------------------------------------------------------
   * * ***Retrieves the internal mapping of JavaScript built-in and environment-specific
   * type identifiers to their canonical PascalCase names.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - Provides a mapping table where **keys** represent normalized raw type names
   *      (as obtained from `Object.prototype.toString.call(value)` or environment checks),
   *      and **values** represent their **canonical PascalCase equivalents**.
   *    - This table ensures consistent, human-readable type strings across different environments.
   *
   * - **Example Mapping:**
   *    ```ts
   *      {
   *        "[object Map]": "Map",
   *        "[object WeakMap]": "WeakMap",
   *        "[object AsyncFunction]": "AsyncFunction",
   *        "[object GeneratorFunction]": "GeneratorFunction",
   *        "[object BigInt]": "BigInt",
   *      }
   *    ```
   *
   * - **⚠️ Internal:**
   *    - Used internally by {@link getPreciseType | `getPreciseType`}.
   *    - This property is **readonly** and should not be modified directly.
   *
   * @readonly
   */
  static get fixesRaw(): typeof this.FIXES_RAW {
    return this.FIXES_RAW;
  }

  /** ----------------------------------------------------------
   * * ***Retrieves the internal list of common acronyms that should remain fully uppercase during string formatting.***
   * ----------------------------------------------------------
   *
   * - **Description:**
   *    - This list defines acronyms (e.g., `"URL"`, `"HTTP"`, `"HTML"`, `"SVG"`, `"XML"`, `"DOM"`)
   *      that will be **preserved in uppercase** when applying case transformations through
   *      {@link getPreciseType | `getPreciseType`} or any formatting utility using it.
   *    - Ensures consistency in output for technical identifiers that are conventionally capitalized.
   *
   * - **Example:**
   *    ```ts
   *      ["URL", "HTTP", "HTML", "SVG", "XML", "DOM"]
   *    ```
   *
   * - **⚠️ Internal:**
   *     - Used internally by {@link getPreciseType | `getPreciseType`}.
   *     - This property is **readonly** and not intended for modification.
   *
   * @readonly
   */
  static get acronymsList(): typeof this.ACRONYMS {
    return this.ACRONYMS;
  }
}
