Kurze Erklärung zur Erstellung der Logos für einsum.org Services:

## Tool
Ich (Paul) benutze [Graphite](https://editor.graphite.art/), ein parametrisiertes, DAG-basiertes Zeichenprogramm.
Inkscape geht auch, wenn man damit Leben kann, dass es furchtbar zu benutzen ist und alle 10 Minuten abstürzt.
Die Rohdateien ("*.graphite") liegen neben den exportierten svgs im Git und können einfach kopiert und bearbeitet werden, um neue Logos zu erstellen.

Mehr zu Graphite gibt es [hier](https://graphite.art/), aber am einfachsten ist es vermutlich, eine der existierenden Dateien zu laden, oben rechts den "Node Graph" zu aktivieren und sich das ganze anzuschauen. Das meiste ist Selbsterklärend.

## Design
Das Logo ist der Name vom Service als Text, mit dem 1. Buchstaben größer und als "Tensornetzwerk" gestaltet.

Font (arbiträr, aber bisher konsistent):
 - Hanken Grotesk (ein offener font)
 - Anfangsbuchstabe in Schriftgröße 70, weight 300 ("light"); nur das "B" von Benchmark hat weight 200 ("Extra light").
 - Resttext in Schriftgröße 50, weight 500 ("medium"), das kann aber bei besonders kurzen oder langen Namen variieren.
 - Farbige Umrandung vom 1. Buchstaben ist 2px dick (bzw. 4, von denen aber 2 unter dem Fill liegen und nicht zu sehen sind.)

Punkte
 - Der 1. Buchstabe ist mit etwa 3 Kreisen markiert (die quasi Tensoren symbolisieren), die auf der Linie liegen.
 - 8px Radius, 2px zusätzlich für die Umrandung, wie auch beim Buchstaben selbst.
 - Position meist an Endpunkten oder Kreuzungspunkten; nicht fest definiert.
 - Offene Endpunkte, wenn überhaupt, vermutlich besser etwas abrunden. (Siehe "F" für "Fast"; aktuell nicht verwendet.)
 - In Graphite zeichne ich einfach Hilfslinien (zur Not mit Länge 0) und lasse die Kreise auf deren Endpunkte setzen.

Farben sind im Wesentlichen von den Matplotlib Farbskalen tab20b und tab20c, siehe etwa [hier](https://martin-ueding.de/posts/matplotlib-colors-scales-as-hex-codes/#tab20). (Klick auf Kästchen kopiert den Hex-Code der Farbe.)
| Service 		| Farbe  	| Fill 	  | Stroke 	|
| ------------- | --------- | ------- | ------- |
| Benchmark(*) 	| Gelb 		| #ffd500 | #f2b200	|
| SQL			| Orange	| #fd8d3c | #e6550d	|
| Derivative	| Blau		| #9ecae1 | #3182bd	|
| Tenvexity		| Grün		| #a1d99b | #31a354	|
| Optimization	| Magenta	| #ce6dbd | #7b4173	|
| Path			| Grau		| #bdbdbd | #636363	|
| (Noch frei)	| Ocker?	| #e7ba52 | #8c6d31	|

(*) Diese Farbe ist nicht von der Matplotlib Skala.

## Export
- Als "<Service>_<mode>.svg" mit transparentem Hintergrund.
- Viewport ("Artboard" in Graphite) hat Größe 190p x 64p.
	- Wenn ein Service einen kürzeren Namen hat, muss es trotzdem so groß sein, damit alles richtig skaliert. Ein längerer Name ist aktuell nicht vorgesehen.
	- Das Logo ist horizontal zentriert auf diesem Hintergrund.
- Einmal für Light-Mode (schwarze Schrift) als "<Service>_light.svg" und einmal für Dark-Mode (weiße Schrift) als "<Service>_dark.svg" exportieren.
	- Die Farbe vom 1. Buchstaben sollte für beide Modi passen, andernfalls müsste man die auch variieren.
- Im Websiten Git für einsum.org gibt es aktuell (März 26) alle Logos doppelt. Habe vergessen, welche Variante tatsächlich geladen wird; vermutlich die äußere.
