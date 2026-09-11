using BonhommePendu.Models;

namespace BonhommePendu.Events
{
    // Un événement à créer si il ne reste plus d'essais (NbWrongGuesses est trop grand)
    public class LostEvent : GameEvent
    {
        public override string EventType { get { return "Lost"; } }

        public string Word { get; set; }

        public LostEvent(GameData gameData) {
            gameData.Lost = true;
            Word = gameData.Word;
        }
    }
}
