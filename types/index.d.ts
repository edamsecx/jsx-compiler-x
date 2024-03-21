type TagTypes =
  | "tag-left-bracket" // <
  | "tag-name" // name
  | "component-name" // Cmp
  | "tag-right-bracket" // >
  | "tag-closing-left-bracket" // </
  | "tag-self-closing-right-bracket" // />
  | "fragment-open" // <>
  | "fragment-close"; // </>

type AttributeTypes =
  | "attribute-name" // name
  | "attribute-assign" // =
  | "attribute-value"; // "value"

type ContentTypes = "content"; // text

type TokenTypes = TagTypes | AttributeTypes | ContentTypes;

type Token = {
  type: TokenTypes;
  value: string;
};

type Tokens = Token[];
