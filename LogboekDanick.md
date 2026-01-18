Donderdag 2-10-2025
TIJD: 10.45 - 13.00

- Ik heb gewerkt aan het maken van de mock-ups op basis van de klad versies die ik en lucie hebben gemaakt met visily.
- Begonnen met het ontwerpen van een eenvoudig logo.
- Tutorial kijken over react.

Donderdag 2-10-2025
TIJD: 14.00 - 16.00

- afkijken van react tutoriel & ben er achter gekomen dat er een verschil is tussen react native en react

Zaterdag 11-2-2025
TIJD: 2H

- Ik heb de login screens gemaakt met navigation (zonder te letten op css gewoon de implementatie met alles wat op het scherm voorlopig moet)

Dinsdag 7-2-2025
TIJD: 3H

- documentatie over firebase gelezen
- en firebase gebruikt voor de login en create van user
- volgende stap is om firestore ook te implementeren voor de extra informatie wanneer een user inlogt.
- Opnieuw begonnen met react alles verplaatsen van react-native naar react! was niet zo moeilijk fundamenteel leek het erg op elkaar.

woensdag 8-2-2025
TIJD: 2H

- opzoeken van potentiele API die we kunen gebruiken.

maandag 13-10-2025

- Spotify API voor de UI, artiest-info, album covers

- Audius API of Jamendo API voor de daadwerkelijke muziekstream
  Geen copyright-issues

📚 Audius Docs → https://docs.audius.org/

📚 Jamendo Docs → https://developer.jamendo.com/v3.0

9/12 - 13:00 - 16:50
- about pagina gemaakt
- search geoptimaliseerd met en het zoeken gaat nu 25keer zo snel als ervoor.
- toevoegen van favoriete artiesten per user opgelost nu werkt het daadwerkelijk met de database & niet met de localstorage
- security rules van fire console geschreven adhv AI
11/12 - 1:00-3:15 (zoeken voor oplossing van landingspagina)
optie 1: discover pagina maken en deze als landingspagina maken 
optie 2: een aangenamere manier voor het wachten met bv. een interactieve beweging van ons logo
optie 3: oplossing van de docent en de preview URLS per liedje ophalen enkel wanneer je zo nodig hebt.

15/11
- home pagina verbeterd omdat het ophalen van de previews onregelmatig was bij de opstart van de applicatie duurde het langer
en dan tijdens het gebruiken van onze app ging dit veel sneller maar we kregen alsong veel errors in de console omdat we 
teveel calls deden tegelijk voor alle previewURL's op te halen. Soms kon het ook zijn dat het tijdens 
het gebruik van de applicatie de app dat de fyp (home) weer langer deed om alles op te laden ik zou niet exact weten hoe dit kwam.
we hebben dit opgelost door eerst alle sounds van de fyp op te halen met de SpotifyAPI enkel de metadata 
dus de naam van artist, titel van het liedje ect. Vervolgens gaan we per sound de previewURL
ophalen via de ItunesSearchAPI. We laden gelijk ook de volgende sound op zodat het een mooiere overgang heeft.

16/11
-“Het probleem werd veroorzaakt door een relatieve base path (./) in de Vite-configuratie. 
Dit zorgde ervoor dat assets incorrect werden geladen op Netlify. 
Door de base path aan te passen naar / werden alle statische assets correct geserveerd.”
playlist verbinden met user ID 

3/1 15 - 16:30
Taal veranderd => onze PWA stond in het engels en nederlands gemixt wat verwarend was dus dit moest ook opgelost worden.
background probleem opgelost => op bepaalde pagina's  
begonnen met documentatie 
persoonlijke reflectie geschreven

11/1
Samen met Lucie aan documentatie gewerkt.

