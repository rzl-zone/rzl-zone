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

const FIXES_RAW = {
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
  urlpattern: "URL Pattern",
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
  cdatasection: "CData Section",
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
  canvasrenderingcontext2d: "Canvas Rendering Context 2D",
  offscreencanvas: "Offscreen Canvas",
  webglrenderingcontext: "WebGL Rendering Context",
  webgl2renderingcontext: "WebGL 2 Rendering Context",
  imagebitmaprenderingcontext: "Image Bitmap Rendering Context",
  gpucanvascontext: "GPU Canvas Context",
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
} as const;
/** ----------------------------------------------------------
 * * ***Mapping table of JavaScript built-in and environment-specific types.***
 * -----------------------------------------------------------
 * - **Behavior:**
 *     - Maps internal or native type identifiers to **human-readable names** (usually PascalCase).
 *     - Keys are normalized to lowercase and stripped of spaces, dashes, or underscores.
 *     - Extend or modify entries to match your environment or platform.
 *
 * ---
 * - **⚠️ Internal:**
 *     - Used internally by {@link getPreciseType | `getPreciseType`}.
 *     - Not intended for direct use in application code.
 */
export const FIXES_RAW_DATA: Readonly<typeof FIXES_RAW> =
  Object.freeze(FIXES_RAW);

const TYPE_DATA = ["-Infinity", "Infinity", "NaN"] as const;
/** ----------------------------------------------------------
 * * ***List of JavaScript special numeric values.***
 * -----------------------------------------------------------
 *
 * - Contains special values recognized by {@link getPreciseType | `getPreciseType`},
 *   such as `"Infinity"`, `"-Infinity"`, and `"NaN"`.
 *
 * ---
 * - **⚠️ Internal:**
 *       - Used by {@link getPreciseType | `getPreciseType`} for numeric edge-case detection.
 */
export const SPECIAL_TYPE_DATA: Readonly<typeof TYPE_DATA> =
  Object.freeze(TYPE_DATA);

const ACRONYMS = [
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
] as const;
/** ----------------------------------------------------------
 * * ***List of acronyms to keep uppercase in formatted output.***
 * -----------------------------------------------------------
 *
 * - **Behavior:**
 *     - Prevents transformations (like camelCase or kebab-case) from altering
 *       known acronyms such as `HTML`, `URL`, `API`, etc.
 *     - Extend this list if you want more acronyms to remain uppercase.
 *
 * ---
 * - **⚠️ Internal:**
 *       - Used internally by {@link getPreciseType | `getPreciseType`} and related formatters.
 */
export const ACRONYMS_DATA: Readonly<typeof ACRONYMS> = Object.freeze(ACRONYMS);

/** ----------------------------------------------------------
 * * ***Type for `FIXES_CASTABLE_TABLE`.***
 * -----------------------------------------------------------
 */
type FixesCastableTable = Readonly<Record<string, string>>;

/**
 * @internal Core class utils for `getPreciseType`.
 */
export class PreciseType {
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

  /** ----------------------------------------------------------
   * * ***Normalized lookup table for type mapping.***
   * -----------------------------------------------------------
   *
   * - **Behavior:**
   *     - Converts all keys from {@link _FIXES_RAW | `FIXES_RAW`} into normalized form
   *       (lowercased and stripped of separators) for consistent lookup.
   *     - Values remain the formatted human-readable type names.
   *
   * ---
   * - **⚠️ Internal:**
   *       - Helper table for {@link getPreciseType | `getPreciseType`} and related matchers.
   *
   * ---
   * @internal ***`Not part of the public API.`***
   */
  private static FIXES_CASTABLE_TABLE: FixesCastableTable = Object.freeze(
    Object.entries(FIXES_RAW_DATA).reduce(
      (acc, [k, v]) => {
        acc[PreciseType.normalizeKeyForCase(k)] = v;
        return acc;
      },
      {} as Record<string, string>
    )
  ) as Readonly<Record<string, string>>;

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
      acronym: "Acronym",
      address: "Address",
      applet: "Applet",
      area: "Area",
      article: "Article",
      aside: "Aside",
      audio: "Audio",

      b: "Bold",
      base: "Base",
      basefont: "Base Font",
      bdi: "BDI",
      bdo: "BDO",
      big: "Big",
      blink: "Blink",
      blockquote: "Blockquote",
      body: "Body",
      br: "Break",
      button: "Button",

      canvas: "Canvas",
      caption: "Caption",
      center: "Center",
      circle: "Circle",
      cite: "Cite",
      clippath: "Clip Path",
      code: "Code",
      col: "Column",
      colgroup: "Column Group",

      data: "Data",
      datalist: "Datalist",
      dd: "Definition Description",
      defs: "Definitions",
      del: "Deleted Text",
      desc: "Description",
      details: "Details",
      dfn: "Definition",
      dialog: "Dialog",
      dir: "Directory",
      div: "Div",
      dl: "Definition List",
      dt: "Definition Term",

      ellipse: "Ellipse",
      em: "Emphasis",
      embed: "Embed",

      feblend: "Blend Filter",
      fecolormatrix: "Color Matrix Filter",
      fecomponenttransfer: "Component Transfer Filter",
      fecomposite: "Composite Filter",
      feconvolvematrix: "Convolve Matrix Filter",
      fediffuselighting: "Diffuse Lighting Filter",
      fedisplacementmap: "Displacement Map Filter",
      fedistantlight: "Distant Light Filter",
      fedropshadow: "Drop Shadow Filter",
      feflood: "Flood Filter",
      fefunca: "Function A",
      fefuncb: "Function B",
      fefuncg: "Function G",
      fefuncr: "Function R",
      fegaussianblur: "Gaussian Blur Filter",
      feimage: "Image Filter",
      femerge: "Merge Filter",
      femergenode: "Merge Node Filter",
      femorphology: "Morphology Filter",
      feoffset: "Offset Filter",
      fepointlight: "Point Light Filter",
      fespecularlighting: "Specular Lighting Filter",
      fespotlight: "Spot Light Filter",
      fetile: "Tile Filter",
      feturbulence: "Turbulence Filter",

      fieldset: "Fieldset",
      figcaption: "Figcaption",
      figure: "Figure",
      filter: "Filter",
      font: "Font",
      footer: "Footer",
      foreignobject: "Foreign Object",
      form: "Form",
      frame: "Frame",
      frameset: "Frameset",

      g: "Group",

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
      isindex: "Index",

      kbd: "Keyboard",
      keygen: "Key Generator",

      label: "Label",
      legend: "Legend",
      li: "List Item",
      line: "Line",
      lineargradient: "Linear Gradient",
      link: "Link",
      listing: "Listing",

      main: "Main",
      map: "Map",
      mark: "Mark",
      marker: "Marker",
      marquee: "Marquee",
      mask: "Mask",
      math: "Math",
      menu: "Menu",
      menuitem: "Menu Item",
      meta: "Meta",
      meter: "Meter",
      mfrac: "Math Fraction",
      mi: "Math Identifier",
      mn: "Math Number",
      mo: "Math Operator",
      mroot: "Math Root",
      mrow: "Math Row",
      ms: "Math String",
      msqrt: "Math Square Root",
      msub: "Math Subscript",
      msubsup: "Math Subscript Superscript",
      msup: "Math Superscript",
      mtext: "Math Text",
      multicol: "Multicolumn",

      nav: "Nav",
      nextid: "Next ID",
      nobr: "No Break",
      noembed: "No Embed",
      noframes: "No Frames",
      noscript: "NoScript",

      object: "Object",
      ol: "Ordered List",
      optgroup: "Option Group",
      option: "Option",
      output: "Output",

      p: "Paragraph",
      param: "Param",
      path: "Path",
      pattern: "Pattern",
      picture: "Picture",
      plaintext: "Plain Text",
      polygon: "Polygon",
      polyline: "Polyline",
      portal: "Portal",
      pre: "Preformatted",
      progress: "Progress",

      q: "Quote",

      radialgradient: "Radial Gradient",
      rb: "Ruby Base",
      rect: "Rectangle",
      rp: "RP",
      rt: "RT",
      rtc: "Ruby Text Container",
      ruby: "Ruby",

      s: "Strikethrough",
      samp: "Sample",
      script: "Script",
      search: "Search",
      section: "Section",
      select: "Select",
      slot: "Slot",
      small: "Small",
      source: "Source",
      spacer: "Spacer",
      span: "Span",
      stop: "Stop",
      strike: "Strike",
      strong: "Strong",
      style: "Style",
      sub: "Subscript",
      summary: "Summary",
      sup: "Superscript",
      svg: "SVG",
      symbol: "Symbol",

      table: "Table",
      tbody: "Table Body",
      td: "Table Data",
      template: "Template",
      text: "SVG Text",
      textarea: "Textarea",
      textpath: "Text Path",
      tfoot: "Table Footer",
      th: "Table Header",
      thead: "Table Head",
      time: "Time",
      title: "Title",
      tr: "Table Row",
      track: "Track",
      tspan: "Text Span",
      tt: "Teletype",

      u: "Underline",
      ul: "Unordered List",
      use: "Use",

      var: "Variable",
      video: "Video",

      wbr: "WBR",

      xmp: "XMP"
    };

    const normalizeTagName = PreciseType.normalizeKeyForCase(tagName);

    const defaultTagName = DEFAULTS[normalizeTagName];
    const normalizedName = defaultTagName
      ?.replace(/^HTML\s+/i, "")
      .replace(/\s+Element$/i, "");

    const displayName =
      PreciseType.FIXES_CASTABLE_TABLE[normalizeTagName] ??
      (normalizedName ? `HTML ${normalizedName} Element` : "HTML Element");

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
  private getCDataSectionType(
    value: unknown,
    options?: GetPreciseTypeOptions
  ): string | null {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    if (value instanceof CDATASection) {
      return this.converter(
        PreciseType.FIXES_CASTABLE_TABLE[
          PreciseType.normalizeKeyForCase("cdatasection")
        ] ?? "CDATA Section",
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
   * -----------------------------------------------------------
   * - **Description:**
   *     - Converts a JavaScript `Symbol` (including well-known symbols) into a standardized,
   *       human-readable name string.
   *     - Maps **well-known symbols** (e.g., `Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toStringTag`)
   *       to their corresponding normalized key in {@link PreciseType.castableTable | `castableTable`}.
   *     - Supports formatted output according to the given `formatCase` and `useAcronyms` options.
   *     - Falls back to the general `"Symbol"` type name if the provided symbol is not recognized.
   *
   * ---
   * - **Example:**
   *     ```ts
   *     const precise = new PreciseType();
   *
   *     precise.getSymbolName(Symbol.iterator);
   *     // ➜ "symbol-iterator"
   *
   *     precise.getSymbolName(Symbol.toStringTag, { formatCase: "toPascalCase" });
   *     // ➜ "SymbolToStringTag"
   *
   *     precise.getSymbolName(Symbol("custom"));
   *     // ➜ "symbol"
   *     ```
   *
   * ---
   * - **Options:**
   *     - `formatCase` ➔ Determines the string case style for the resulting symbol name.
   *     - `useAcronyms` ➔ Preserves known acronyms (like `URL`, `DOM`, `HTML`) if set to `true`.
   *
   * ---
   * - **⚠️ Internal:**
   *       - Helper for {@link getPreciseType | `getPreciseType`} that normalizes `Symbol` detection.
   *       - Not recommended for direct external use.
   *
   *
   * ---
   * @param value - The `Symbol` instance to analyze.
   * @param options - Optional settings for case formatting and acronym preservation.
   *
   * ---
   * @returns The formatted symbol name string.
   *
   * ---
   * @internal ***`Not part of the public API.`***
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
   * -----------------------------------------------------------
   * - **Description:**
   *     - Determines the specific **DOM Node subtype** (e.g., `HTMLDivElement`, `Comment`, `Text`, etc.)
   *       based on the given input `value`.
   *     - This method sequentially checks various DOM-related helpers:
   *       - {@link PreciseType.getHtmlElementType | `getHtmlElementType`}
   *       - {@link PreciseType.getCommentNodeType | `getCommentNodeType`}
   *       - {@link PreciseType.getTextNodeType | `getTextNodeType`}
   *       - {@link PreciseType.getOtherNodeType | `getOtherNodeType`}
   *     - Returns the first non-null type result found.
   *     - If no valid DOM node type is detected or an error occurs, it gracefully returns `null`.
   *
   * ---
   * - **Example:**
   *     ```ts
   *     const detector = new PreciseType();
   *     detector.detectDomNodeType(document.createElement("div"));
   *     // ➜ "HTMLDivElement"
   *
   *     detector.detectDomNodeType(document.createComment("test"));
   *     // ➜ "Comment"
   *
   *     detector.detectDomNodeType("not a node");
   *     // ➜ null
   *     ```
   *
   * ---
   * - **Options:**
   *     - `formatCase` ➔ Controls the output formatting (e.g., `"toKebabCase"`, `"toPascalCase"`, etc.).
   *     - `useAcronyms` ➔ Determines if acronyms like `"HTML"` or `"SVG"` remain uppercase.
   *
   * ---
   * - **⚠️ Internal:**
   *       - Used internally by {@link getPreciseType | `getPreciseType`} to refine DOM-related type detection.
   *       - Not intended for direct external use.
   *
   *
   * ---
   * @param value - The value to be inspected for a DOM node type.
   * @param options - Optional configuration to adjust case formatting and acronym behavior.
   *
   * ---
   * @returns The detected DOM node type string, or `null` if not applicable.
   *
   * ---
   * @internal ***`Not part of the public API.`***
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
        this.getCDataSectionType(value, { formatCase, useAcronyms }) ||
        this.getTextNodeType(value, { formatCase, useAcronyms }) ||
        this.getOtherNodeType(value, { formatCase, useAcronyms })
      );
    } catch {
      return null;
    }
  }

  /** ----------------------------------------------------------
   * * ***Detects whether a given value is a Proxy instance.***
   * -----------------------------------------------------------
   * - **Behavior:**
   *     - Attempts to define and delete a temporary property to trigger potential Proxy traps.
   *     - Works because most Proxy handlers will throw or behave differently during these operations.
   *     - Transparent Proxies (without traps) will **not** be detected.
   *
   * ---
   * @description
   * This method performs a heuristic check — it’s **not foolproof**, but reliably distinguishes
   * most Proxy-wrapped objects from ordinary ones without using non-standard APIs.
   *
   * ---
   * @param value - The value to inspect.
   * @returns `true` if the value behaves like a Proxy (throws on property mutation),
   *          otherwise `false`.
   *
   * ---
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
   * ---
   * @note
   * - Skips built-in native types (like `Array`, `Date`, `Map`, etc.) to prevent false positives.
   * - This is an **internal heuristic**, not a guaranteed Proxy detector.
   *
   * ---
   * @internal ***`Not part of the public API.`***
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
   * -----------------------------------------------------------
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
   * ---
   * @param {string} input - The string to convert.
   * @param {GetPreciseTypeOptions["formatCase"]} formatCase - The conversion method to apply.
   *
   * ---
   * @returns {string} The converted string according to the selected format.
   *
   * ---
   * @example
   * ```ts
   * converterHelper("hello world", "toCamelCase");
   * // ➔ "helloWorld"
   * ```
   * ---
   * @example
   * ```ts
   * converterHelper("my URL path", "slugify");
   * // ➔ "my-URL-path"
   * ```
   *
   * ---
   * @internal ***`Not part of the public API.`***
   */
  public converter(input: string, options?: GetPreciseTypeOptions): string {
    const { formatCase, useAcronyms } = this.determineOptions(options);

    const ignoreWord = useAcronyms ? ACRONYMS_DATA : [];

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
   * -----------------------------------------------------------
   * - **Description:**
   *     - This method removes all **spaces**, **underscores**, and **hyphens** from the given string,
   *       then converts the result to **lowercase**.
   *     - Used internally to ensure uniformity in key lookups and matching logic across
   *       type mapping tables like {@link PreciseType.fixesRaw | `fixesRaw`} and
   *       {@link PreciseType.castableTable | `castableTable`}.
   *
   * ---
   * - **Example:**
   *     ```ts
   *     PreciseType.normalizeKeyForCase("Map.Type");
   *     // ➔ "maptype"
   *     PreciseType.normalizeKeyForCase("Map-Type");
   *     // ➔ "maptype"
   *     PreciseType.normalizeKeyForCase("Set Type");
   *     // ➔ "settype"
   *     PreciseType.normalizeKeyForCase("Array_Type");
   *     // ➔ "arraytype"
   *     ```
   *
   * ---
   * - **⚠️ Internal:**
   *       - Helper method used by {@link getPreciseType | `getPreciseType`} and internal mapping constants.
   *       - Not intended for direct use in user code.
   *
   * ---
   * @param k - The input string key to normalize.
   *
   * ---
   * @returns The normalized lowercase key with all separators removed.
   *
   * ---
   * @internal ***`Not part of the public API.`***
   */
  public static normalizeKeyForCase(
    k: keyof typeof this.fixesRaw | AnyString
  ): string {
    return k.replace(/[\s_\-.]+/g, "").toLowerCase();
  }

  /** ----------------------------------------------------------
   * * ***Getting the internal map of type castable relationships used by {@link getPreciseType | `getPreciseType`}.***
   * -----------------------------------------------------------
   * - **Description:**
   *     - Returns an internal static mapping table that defines which primitive or structural types
   *       can be cast or interpreted as another related type within the internal logic of
   *       {@link getPreciseType | `getPreciseType`}.
   *
   * ---
   * - **⚠️ Internal:**
   *       - This is an internal helper of {@link getPreciseType | `getPreciseType`}.
   *       - Do not modify or rely on this table directly — it is **readonly** and may change without notice.
   *
   * ---
   * @readonly
   */
  static get castableTable(): FixesCastableTable {
    return PreciseType.FIXES_CASTABLE_TABLE;
  }

  /** ----------------------------------------------------------
   * * ***Retrieves the internal list of special type cases handled by {@link getPreciseType | `getPreciseType`}.***
   * -----------------------------------------------------------
   * - **Description:**
   *     - Returns an internal readonly list of specific type identifiers that require
   *       *custom handling* during type detection.
   *     - These are **exceptional values** or **edge cases** that don’t follow the normal
   *       JavaScript type resolution flow.
   *
   * ---
   * - **Example Values:**
   *     - `"Infinity"`, `"-Infinity"`, `"NaN"`, `"undefined"`, etc.
   *
   * ---
   * - **⚠️ Internal:**
   *       - Used internally by {@link getPreciseType | `getPreciseType`}.
   *       - This property is **readonly** and should not be modified directly.
   *
   * ---
   * @readonly
   */
  static get specialType(): Readonly<typeof TYPE_DATA> {
    return SPECIAL_TYPE_DATA;
  }

  /** ----------------------------------------------------------
   * * ***Retrieves the internal mapping of JavaScript built-in and environment-specific
   * type identifiers to their canonical PascalCase names.***
   * -----------------------------------------------------------
   * - **Description:**
   *     - Provides a mapping table where **keys** represent normalized raw type names
   *       (as obtained from `Object.prototype.toString.call(value)` or environment checks),
   *       and **values** represent their **canonical PascalCase equivalents**.
   *     - This table ensures consistent, human-readable type strings across different environments.
   *
   * ---
   * - **Example Mapping:**
   *     ```ts
   *       {
   *         "[object Map]": "Map",
   *         "[object WeakMap]": "WeakMap",
   *         "[object AsyncFunction]": "AsyncFunction",
   *         "[object GeneratorFunction]": "GeneratorFunction",
   *         "[object BigInt]": "BigInt",
   *       }
   *     ```
   *
   * ---
   * - **⚠️ Internal:**
   *       - Used internally by {@link getPreciseType | `getPreciseType`}.
   *       - This property is **readonly** and should not be modified directly.
   *
   * ---
   * @readonly
   */
  static get fixesRaw(): Readonly<typeof FIXES_RAW> {
    return FIXES_RAW_DATA;
  }

  /** ----------------------------------------------------------
   * * ***Retrieves the internal list of common acronyms that should remain fully uppercase during string formatting.***
   * -----------------------------------------------------------
   * - **Description:**
   *     - This list defines acronyms (e.g., `"URL"`, `"HTTP"`, `"HTML"`, `"SVG"`, `"XML"`, `"DOM"`)
   *       that will be **preserved in uppercase** when applying case transformations through
   *       {@link getPreciseType | `getPreciseType`} or any formatting utility using it.
   *     - Ensures consistency in output for technical identifiers that are conventionally capitalized.
   *
   * ---
   * - **Example:**
   *     ```ts
   *       ["URL", "HTTP", "HTML", "SVG", "XML", "DOM"]
   *     ```
   *
   * ---
   * - **⚠️ Internal:**
   *       - Used internally by {@link getPreciseType | `getPreciseType`}.
   *       - This property is **readonly** and not intended for modification.
   *
   * ---
   * @readonly
   */
  static get acronymsList(): Readonly<typeof ACRONYMS> {
    return ACRONYMS_DATA;
  }
}
