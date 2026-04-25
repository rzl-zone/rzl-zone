import { DATA_ATTRIBUTE } from "../constants";

const { FORM, CHILD_BUTTON_SUBMIT, IS_BTN_SUBMIT_RZL_PROGRESS } =
  DATA_ATTRIBUTE;
const { IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION, IS_METHOD_POST_FORM } =
  FORM;

/** Utils for `progress-bar`.
 *
 * @internal
 */
export const setNestedAttribute = (
  node: ChildNode | Element,
  type: "delete" | "add",
  attr: { qualifiedName: string; value: string }
) => {
  if (
    node.childNodes.length &&
    node instanceof Element &&
    node.children.length
  ) {
    node.childNodes.forEach((child) => {
      if (child.nodeName === "#text") return;
      if (node instanceof Element) {
        if (type === "add") {
          node.setAttribute(CHILD_BUTTON_SUBMIT, "true");
        } else {
          node.removeAttribute(CHILD_BUTTON_SUBMIT);
        }
      }

      setNestedAttribute(child, type, attr);
    });
  } else {
    if (node instanceof Element) {
      if (type === "add") {
        node.setAttribute(CHILD_BUTTON_SUBMIT, "true");
      } else {
        node.removeAttribute(CHILD_BUTTON_SUBMIT);
      }
    }
  }
};

/** Utils for `progress-bar`.
 *
 * @internal
 */
export const setAttributeChildSubmitBtn = (
  docs: Document,
  type: "delete" | "add" = "add"
) => {
  docs?.querySelectorAll("button")?.forEach((doc) => {
    if (
      doc.type === "submit" &&
      IS_BTN_SUBMIT_RZL_PROGRESS(doc) &&
      (IS_METHOD_POST_FORM(doc.form) ||
        IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION(doc.form))
    )
      doc.childNodes.forEach((e) => {
        setNestedAttribute(e, type, {
          value: "true",
          qualifiedName: CHILD_BUTTON_SUBMIT
        });
      });
  });
};
