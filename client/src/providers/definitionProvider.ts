import { dirname, resolve } from "path";
import {
  type CancellationToken,
  type Definition,
  type DefinitionProvider,
  Location,
  Position,
  type ProviderResult,
  type TextDocument,
  type Uri,
  workspace,
} from "vscode";
import { DJANGO_HTML_SELECTOR, PYTHON_SELECTOR } from "../constants";

const regex = (regexes: RegExp[]) =>
  new RegExp(regexes.map((re) => re.source).join(""));

const quote = /(?:\'|\")/;
const path_re = /([\w/\-]+\.[\w]+)/;
const rel_path_re = /((?:(?:\.\/|(?:\.\.\/)+))[\w/\-]+\.[\w]+)/;

const PATH_RE = regex([quote, path_re, quote]);
const RELATIVE_PATH_RE = regex([quote, rel_path_re, quote]);
const BEGIN_OF_FILE = new Position(0, 0);

const cache: any = {};

export class TemplatePathProvider implements DefinitionProvider {
  public selector = [DJANGO_HTML_SELECTOR, PYTHON_SELECTOR];

  private static getTemplate(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
  ): Thenable<Uri | null> {
    let path: string;
    let search: string;
    const line = document.lineAt(position.line).text;
    const match = line.match(PATH_RE);
    const relative_match = line.match(RELATIVE_PATH_RE);

    if (relative_match) {
      path = relative_match[1];
      search = workspace.asRelativePath(
        resolve(dirname(document.uri.path), path),
      );
    } else if (match) {
      path = match[1];
      search = `**/{templates,jinja2}/${path}`;
    } else {
      return Promise.resolve(null);
    }

    const pos = position.character;
    const cursorOverPath =
      pos > line.indexOf(path) && pos < line.indexOf(path) + path.length;

    let uri: Thenable<Uri | null>;

    if (search in cache) {
      uri = Promise.resolve(cache[search]);
    } else {
      uri = workspace.findFiles(search, "", 1, token).then((results) => {
        const result = results.length ? results[0] : null;
        if (result) cache[search] = result;
        return result;
      });
    }

    if (cursorOverPath) {
      return uri;
    } else {
      return Promise.resolve(null);
    }
  }

  public provideDefinition(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
  ): ProviderResult<Definition> {
    return TemplatePathProvider.getTemplate(document, position, token).then(
      (template) => {
        if (!template) return null;
        return new Location(template, BEGIN_OF_FILE);
      },
    );
  }
}
