import {
  picocolors,
  EOL,
  NEWLINE,
  joinInline,
  formatOptionValue,
  joinLines,
  joinLinesLoose,
  padText
} from "@/utils/helper/formatter";

const RzlBuildTools = Object.create(null) as {
  utils: {
    picocolors: typeof picocolors;
    EOL: typeof EOL;
    NEWLINE: typeof NEWLINE;
    joinInline: typeof joinInline;
    formatOptionValue: typeof formatOptionValue;
    joinLines: typeof joinLines;
    joinLinesLoose: typeof joinLinesLoose;
    padText: typeof padText;
  };
};

const utils = Object.create(null) as (typeof RzlBuildTools)["utils"];

Object.assign(utils, {
  picocolors,
  EOL: EOL,
  NEWLINE,
  joinInline,
  formatOptionValue,
  joinLines,
  joinLinesLoose,
  padText
});

Object.freeze(utils);

RzlBuildTools.utils = utils;

Object.defineProperty(RzlBuildTools, Symbol.toStringTag, {
  value: "RzlBuildTools"
});

Object.freeze(RzlBuildTools);

export default RzlBuildTools;
