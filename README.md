# Lo-Fi Passwortmanager

Ein Local-First Passwortmanager aufgebaut um die Bibliothek [Automerge](https://automerge.org/).
Das Projekt ist im Rahmen von PSE (Praxis der Softwareentwicklung) Projekt am KIT entstanden.

## Entwicklung

Um mit der Entwicklung zu starten, muss zunächst das Repository geklont werden. Weiterhin wird zum verwenden der
Synchronisationsfunktionalität ein Automerge-Syncserver benötigt (
&rarr; [automerge-repo-sync-server](https://github.com/automerge/automerge-repo-sync-server)). Es wird ein öffentlicher
Server von Automerge bereitgestellt, dieser ist in der App als default hinterlegt, kann jedoch langsam sein oder
ausfälle haben.

Ebenfalls werden [NodeJS v24](https://nodejs.org/) und [Yarn](https://yarnpkg.com/) als Package Manager
benötigt.  
Zunächst müssen alle Abhängigkeiten mit `yarn install` installiert werden und danach kann der Entwicklungsserver mit
`yarn dev` ausgeführt werden.

Die App benutzt [React](https://react.dev/) als Framework und [Automerge](https://automerge.org/) zum persistieren der
Daten und die
Hauptkomponente liegt in
`src/main.tsx` und ein großteil des Stylings ist in `src/styles.css` definiert.

Um die App zu bauen, kann entweder `yarn build` ausgeführt werden, um eine einzelne Datei zu erhalten, die zu lokalen
ausführen gedacht ist, oder `yarn build:deploy` um eine Version zu erhalten, die dafür optimiert ist, auf einem
Webserver zu laufen.

### Datenstruktur

Das Schema für die JSON-Struktur, die von Automerge persistiert wird, wird von Folgendem Schema beschrieben:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AutomergeDoc",
  "type": "object",
  "required": ["salt", "validation", "items"],
  "properties": {
    "salt": {
      "type": "string",
      "minLength": 64,
      "maxLength": 64
    },
    "validation": {
      "type": "string",
      "minLength": 185,
      "maxLength": 185
    },
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/AutomergeItem"
      }
    }
  },
  "$defs": {
    "AutomergeItem": {
      "type": "object",
      "required": ["type", "name", "createdAt", "editedAt", "parentId"],
      "properties": {
        "name": {
          "type": "string"
        },
        "createdAt": {
          "type": "number",
          "description": "Unix timestamp"
        },
        "editedAt": {
          "type": "number",
          "description": "Unix timestamp"
        },
        "parentId": {
          "type": "string"
        }
      },
      "oneOf": [
        {
          "$ref": "#/$defs/AutomergeFolder"
        },
        {
          "$ref": "#/$defs/AutomergeEntry"
        }
      ]
    },
    "AutomergeFolder": {
      "properties": {
        "type": {
          "const": "folder"
        }
      }
    },
    "AutomergeEntry": {
      "required": ["username", "password", "url", "note"],
      "properties": {
        "type": {
          "const": "entry"
        },
        "username": {
          "type": "string"
        },
        "password": {
          "type": "string"
        },
        "url": {
          "type": "string"
        },
        "note": {
          "type": "string"
        }
      }
    }
  }
}
```