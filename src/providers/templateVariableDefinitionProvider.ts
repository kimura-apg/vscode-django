import {
  type CancellationToken,
  type Definition,
  type DefinitionProvider,
  type LocationLink,
  Position,
  type ProviderResult,
  type TextDocument,
} from "vscode";

export class TemplateVariableDefinitionProvider implements DefinitionProvider {
  provideDefinition(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
  ): ProviderResult<Definition | LocationLink[]> {
    const wordRange = document.getWordRangeAtPosition(
      position,
      /{{\s*[\w.]+\s*}}/,
    );

    console.log(wordRange);

    if (!wordRange) {
      return;
    }

    const variableName = document
      .getText(wordRange)
      .replace(/{{\s*|\s*}}/g, "");
    const definitionPosition = new Position(10, 0);

    return new Location(document.uri, definitionPosition);
  }
}
