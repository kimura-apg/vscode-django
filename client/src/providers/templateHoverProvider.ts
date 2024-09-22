import {
  type CancellationToken,
  Hover,
  type HoverProvider,
  type Position,
  type ProviderResult,
  type TextDocument,
} from "vscode";

export class TemplateHoverProvider implements HoverProvider {
  provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
  ): ProviderResult<Hover> {
    const wordRange = document.getWordRangeAtPosition(
      position,
      /{{\s*[\w.]+\s*}}/,
    );

    if (!wordRange) {
      return;
    }

    console.log(document);

    const word = document.getText(wordRange);
    const fileName = documend.fileName.replace(/^.*[\\\/]/, "");
    // Replace {{ variable }} to variable
    const variableName = word.replace(/{{\s*|\s*}}/g, "");

    console.log(fileName);

    return new Hover(variableName);
  }

  // getContextVariableTypeFromDjango(
  //   fileName: string,
  //   variableName: string,
  // ): string {
  //   const djangoFilePath = path.join(__dirname, "path_to_django_view_file.py"); // Adjust the path accordingly
  //   const fileContent = fs.readFileSync(djangoFilePath, "utf-8");

  //   const renderRegex =
  //     /render\s*\(\s*request\s*,\s*["']([^"']+)["']\s*,\s*{([^}]+)}\s*\)/;
  //   const match = renderRegex.exec(fileContent);

  //   if (match && match[1] === fileName) {
  //     const contextVariables = match[2].split(",").map((v) =>
  //       v
  //         .trim()
  //         .split(":")
  //         .map((s) => s.trim()),
  //     );
  //     for (const [key, value] of contextVariables) {
  //       if (key === variableName) {
  //         return typeof value;
  //       }
  //     }
  //   }

  //   return "unknown";
  // }
}
