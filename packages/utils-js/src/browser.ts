const RzlUtilsJs: Record<string, unknown> = Object.create(null);

import * as assertions from "./assertions/index";
import * as conversions from "./conversions/index";
import * as events from "./events/index";
import * as formatters from "./formatters/index";
import * as generators from "./generators/index";
import * as operations from "./operations/index";
import * as parsers from "./parsers/index";
import * as predicates from "./predicates/index";
import * as promises from "./promises/index";
import * as strings from "./strings/index";
import * as urls from "./urls/index";

//! exclude all at tailwind category, for reduce size...
// include for tw-macro only at tailwind category
// import * as tailwind from "./tailwind/tw-macro";

Object.assign(
  RzlUtilsJs,
  assertions,
  conversions,
  events,
  formatters,
  generators,
  operations,
  parsers,
  predicates,
  promises,
  strings,
  urls
);

export default RzlUtilsJs;
