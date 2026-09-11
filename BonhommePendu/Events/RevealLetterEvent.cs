using BonhommePendu.Models;

namespace BonhommePendu.Events
{
    // Un événement à créer pour CHAQUE positon d'une lettre que l'on veut révéler (alors il faut faire plusieurs événements si la lettre est là plusieurs fois!)
    public class RevealLetterEvent : GameEvent
    {
        public override string EventType { get { return "RevealLetter"; } }

        public char Letter { get; set; }
        public int Index { get; set; }

        public RevealLetterEvent(GameData gameData, char letter, int index)
        {
            Index = index;
            Letter = gameData.RevealLetter(index);
            if (gameData.HasGuessedTheWord)
            {
                Events = new List<GameEvent>
                {
                    new WonEvent(gameData)
                };
            }
        }
    }
}
