# Lo-Fi Passwortmanager

Ein Local-First Passwortmanager aufgebaut um die Bibliothek [Automerge](https://automerge.org/).
Das Projekt ist im Rahmen von PSE (Praxis der Softwareentwicklung) Projekt am KIT entstanden.

## Build

Um ein Build auszuführen, muss zunächst

```
yarn install
```

ausgeführt werden, und danach entweder

```
yarn build
```

um eine einzelne Datei zu erhalten, die zu lokalen ausführen gedacht ist, oder

```
yarn build:deploy
```

um eine Version zu erhalten, die dafür optimiert ist, auf einem Webserver zu laufen.